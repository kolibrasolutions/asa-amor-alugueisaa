import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sendWhatsAppNotification, sendNtfyNotification } from '@/lib/utils';
import { getNotificationSettings } from '@/lib/notificationConfig';

export interface Rental {
  id: string;
  customer_id: string;
  contract_number: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RentalWithCustomer {
  id: string;
  customer_id: string;
  contract_number: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  deposit_amount?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  customer_nome: string;
  customer_endereco: string;
  customer_telefone: string;
  customer_cpf: string;
  customer_rg?: string;
  customer_cidade?: string;
  customer_email?: string;
  rental_items?: RentalItem[];
}

export interface RentalItem {
  id: string;
  rental_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: {
    id: string;
    name: string;
    brand?: string;
    color?: string;
    size?: string;
  };
}

interface Customer {
  id: string;
  full_name: string;
  address: string;
  phone: string;
  document_number: string;
  email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CustomerWithNome extends Customer {
  nome?: string;
}

interface RentalResponse {
  id: string;
  customer_id: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  customer: Customer;
}

// Função para detectar se um aluguel está em atraso
export const isRentalOverdue = (rental: RentalWithCustomer): boolean => {
  const today = new Date();
  const endDate = new Date(rental.rental_end_date);
  
  // Considera em atraso se passou da data de fim e não está finalizado ou cancelado
  return endDate < today && !['completed', 'cancelled'].includes(rental.status);
};

// Função para obter o status efetivo do aluguel (incluindo atraso)
export const getEffectiveStatus = (rental: RentalWithCustomer): 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'overdue' => {
  if (isRentalOverdue(rental)) {
    return 'overdue';
  }
  return rental.status;
};

export const useRentals = () => {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_with_customer')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as RentalWithCustomer[];
    },
  });
};

export const useRental = (id: string) => {
  return useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rental_with_customer')
        .select(`
          *,
          rental_items(
            id,
            quantity,
            unit_price,
            product:products(
              id,
              name,
              brand,
              color,
              size
            )
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data as RentalWithCustomer;
    },
    enabled: !!id,
  });
};

export const useCreateRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rental: Omit<Rental, 'id' | 'created_at' | 'updated_at' | 'contract_number'>) => {
      // 1. Gerar o número do contrato
      const { data: contractNumberData, error: contractNumberError } = await supabase.rpc('generate_next_contract_number');

      if (contractNumberError) {
        throw new Error('Falha ao gerar o número do contrato: ' + contractNumberError.message);
      }
      
      const newContractNumber = contractNumberData;

      // 2. Criar o aluguel com o número do contrato
      const { data, error } = await supabase
        .from('rentals')
        .insert([{ 
          ...rental,
          contract_number: newContractNumber 
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async (newRental) => {
      // Invalidar múltiplas queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['product-availability'] }); // Cache de disponibilidade
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Cache de produtos
      queryClient.invalidateQueries({ queryKey: ['rental-items'] }); // Cache de itens de aluguel
      
      toast({
        title: "Aluguel criado",
        description: "Aluguel criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar aluguel: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Função auxiliar para enviar notificações de aluguel
export const sendRentalNotification = async (rentalId: string) => {
  try {
    console.log('🟡 RENTAL NOTIFICATION DEBUG: Iniciando envio de notificação');
    console.log('🟡 RENTAL NOTIFICATION DEBUG: Rental ID:', rentalId);
    console.log('🟡 RENTAL NOTIFICATION DEBUG: User Agent:', navigator.userAgent);
    console.log('🟡 RENTAL NOTIFICATION DEBUG: Is Mobile?', window.innerWidth < 768);
    
    // Buscar dados do aluguel a partir da VIEW para incluir dados do cliente
    const { data: rental, error: rentalError } = await supabase
      .from('rental_with_customer')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (rentalError) {
      console.error('Erro ao buscar aluguel:', rentalError);
      return;
    }

    console.log('📋 Dados do aluguel:', rental);

    // Na view, os dados do cliente já vêm no objeto principal
    const customerName = rental.customer_nome || 'Cliente não encontrado';

    // Buscar itens do aluguel com detalhes dos produtos
    const { data: rentalItems, error: itemsError } = await supabase
      .from('rental_items')
      .select(`
        quantity,
        product:products(
          name,
          sku,
          description,
          brand,
          color,
          size
        )
      `)
      .eq('rental_id', rentalId);

    if (itemsError) {
      console.error('Erro ao buscar itens:', itemsError);
      return;
    }

    console.log('📦 Itens do aluguel:', rentalItems);

    // Mapear produtos com detalhes
    const products = rentalItems?.map(item => ({
      name: item.product?.name || 'Produto não encontrado',
      sku: item.product?.sku || undefined,
      description: item.product?.description || undefined,
      quantity: item.quantity,
      brand: item.product?.brand || undefined,
      color: item.product?.color || undefined,
      size: item.product?.size || undefined,
    })) || [];

    // Preparar dados para notificação
    const summary = {
      customerName: customerName,
      eventDate: rental.event_date ? new Date(rental.event_date).toLocaleDateString('pt-BR') : 'Não informado',
      startDate: rental.rental_start_date ? new Date(rental.rental_start_date).toLocaleDateString('pt-BR') : 'Não informado',
      endDate: rental.rental_end_date ? new Date(rental.rental_end_date).toLocaleDateString('pt-BR') : 'Não informado',
      itemsCount: rentalItems?.length || 0,
      status: rental.status || 'pending',
      products: products
    };

    console.log('📋 Dados para notificação:', summary);

    // === TENTAR NTFY.SH PRIMEIRO (RECOMENDADO) ===
    console.log('🟡 RENTAL NOTIFICATION DEBUG: Buscando configurações NTFY do Supabase...');
    
    let ntfySuccess = false;
    const notificationSettings = await getNotificationSettings();
    const { ntfy_configs: ntfyConfigs, ntfy_server_url: ntfyServerUrl } = notificationSettings;
    
    console.log('🟡 RENTAL NOTIFICATION DEBUG: Configurações carregadas:', {
      ntfyConfigs,
      ntfyServerUrl,
      configsCount: ntfyConfigs.length
    });
    
    if (ntfyConfigs.length > 0) {
      try {
        console.log(`🟡 RENTAL NOTIFICATION DEBUG: Enviando notificação ntfy para ${ntfyConfigs.length} funcionário(s)...`);
        console.log(`🟡 RENTAL NOTIFICATION DEBUG: Configurações que serão usadas:`, ntfyConfigs);
        
        // Enviar para todos os funcionários configurados
        const promises = ntfyConfigs.map(async (config, index) => {
          if (!config.topic) {
            console.log(`🟡 RENTAL NOTIFICATION DEBUG: Config ${index} sem tópico, pulando...`);
            return false;
          }
          
          console.log(`🟡 RENTAL NOTIFICATION DEBUG: Enviando para ${config.name} (tópico: ${config.topic})...`);
          const result = await sendNtfyNotification(
            {
              topic: config.topic,
              serverUrl: ntfyServerUrl
            },
            summary
          );
          console.log(`🟡 RENTAL NOTIFICATION DEBUG: Resultado para ${config.name}:`, result);
          return result;
        });
        
        console.log(`🟡 RENTAL NOTIFICATION DEBUG: Aguardando todas as promises...`);
        const results = await Promise.all(promises);
        console.log(`🟡 RENTAL NOTIFICATION DEBUG: Resultados das promises:`, results);
        
        const successCount = results.filter(Boolean).length;
        
        if (successCount > 0) {
          ntfySuccess = true;
          console.log(`✅ RENTAL NOTIFICATION DEBUG: ${successCount}/${ntfyConfigs.length} notificações ntfy enviadas com sucesso!`);
        } else {
          console.log('❌ RENTAL NOTIFICATION DEBUG: Falha no envio de todas as notificações ntfy');
        }
      } catch (error) {
        console.error('🔴 RENTAL NOTIFICATION DEBUG: Erro ao enviar notificações ntfy:', error);
        console.error('🔴 RENTAL NOTIFICATION DEBUG: Stack trace:', error.stack);
      }
    } else {
      console.log('⚠️ RENTAL NOTIFICATION DEBUG: ntfy não configurado - ntfyConfigs.length:', ntfyConfigs.length);
    }

    // === FALLBACK PARA WHATSAPP SE NTFY FALHAR ===
    if (!ntfySuccess) {
      const { whatsapp_phone: whatsappPhone, whatsapp_api_key: whatsappApiKey } = notificationSettings;
      
      if (whatsappPhone && whatsappApiKey) {
        try {
          console.log('📱 Enviando notificação WhatsApp...');
          const whatsappSuccess = await sendWhatsAppNotification(
            {
              phoneNumber: whatsappPhone,
              apiKey: whatsappApiKey
            },
            summary
          );

          if (whatsappSuccess) {
            console.log('✅ Notificação WhatsApp enviada com sucesso!');
          }
        } catch (error) {
          console.error('Erro ao enviar notificação WhatsApp:', error);
        }
      } else if (ntfyConfigs.length === 0) {
        console.log('⚠️ Nenhuma notificação configurada');
      }
    }

    console.log('=== FIM DA NOTIFICAÇÃO ===');
    
  } catch (error) {
    console.error('Erro geral ao processar notificação:', error);
  }
};

export const useUpdateRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...rental }: Partial<Rental> & { id: string }) => {
      const { data, error } = await supabase
        .from('rentals')
        .update(rental)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar múltiplas queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['product-availability'] }); // Cache de disponibilidade
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Cache de produtos
      queryClient.invalidateQueries({ queryKey: ['rental-items'] }); // Cache de itens de aluguel
      
      toast({
        title: "Aluguel atualizado",
        description: "Aluguel atualizado com sucesso! Disponibilidade atualizada.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar aluguel: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useConfirmReturn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rentalId: string) => {
      console.log('✅ === CONFIRMANDO DEVOLUÇÃO ===');
      console.log('📋 Rental ID:', rentalId);
      
      // Primeiro, buscar os produtos do aluguel para liberar depois
      const { data: rentalItems, error: rentalItemsError } = await supabase
        .from('rental_items')
        .select('product_id, quantity')
        .eq('rental_id', rentalId);

      if (rentalItemsError) {
        console.error('❌ Erro ao buscar itens do aluguel:', rentalItemsError);
        throw rentalItemsError;
      }

      console.log('📦 Produtos no aluguel a serem liberados:', rentalItems?.map(item => item.product_id));

      // Atualizar o status do aluguel para completed
      const { data, error } = await supabase
        .from('rentals')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', rentalId)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Erro ao atualizar status do aluguel:', error);
        throw error;
      }
      
      console.log('✅ Status do aluguel atualizado para completed');
      
      // Liberar os produtos verificando se não há outros aluguéis ativos
      if (rentalItems && rentalItems.length > 0) {
        const productIds = rentalItems.map(item => item.product_id);
        
        console.log(`🔄 Sincronizando produtos individualmente...`);
        
        // Para cada produto, usar a função de sincronização individual
        for (const productId of productIds) {
          await syncSingleProductStatus(productId);
        }
      }

      // Executar sincronização completa para garantir consistência
      console.log('🔄 Executando sincronização completa...');
      await syncAllProductStatuses();
      
      console.log('✅ === DEVOLUÇÃO CONFIRMADA COM SUCESSO ===');
      return data;
    },
    onSuccess: () => {
      console.log('🔄 Invalidando caches...');
      
      // Invalidar múltiplas queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['product-availability'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['rental-items'] });
      
      // Forçar reload completo dos dados com múltiplas tentativas
      setTimeout(() => {
        console.log('🔄 Primeiro refetch...');
        queryClient.refetchQueries({ queryKey: ['products'] });
        queryClient.refetchQueries({ queryKey: ['product-availability'] });
      }, 100);
      
      setTimeout(() => {
        console.log('🔄 Segundo refetch...');
        queryClient.refetchQueries({ queryKey: ['products'] });
        queryClient.refetchQueries({ queryKey: ['product-availability'] });
      }, 1000);
      
      setTimeout(() => {
        console.log('🔄 Terceiro refetch...');
        queryClient.refetchQueries({ queryKey: ['products'] });
        queryClient.refetchQueries({ queryKey: ['product-availability'] });
      }, 2000);
      
      toast({
        title: "Devolução confirmada",
        description: "O aluguel foi finalizado e os produtos foram liberados com sucesso!",
      });
    },
    onError: (error) => {
      console.error('❌ Erro na confirmação de devolução:', error);
      toast({
        title: "Erro",
        description: "Erro ao confirmar devolução: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Função auxiliar para sincronizar status dos produtos
const syncAllProductStatuses = async () => {
  try {
    console.log('🔄 Sincronizando status de todos os produtos...');
    
    // Buscar todos os produtos
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, status');

    if (!allProducts) return;

    console.log(`📊 Total de produtos para sincronizar: ${allProducts.length}`);

    // Para cada produto, verificar se há aluguéis ativos
    for (const product of allProducts) {
      const { data: activeRentals } = await supabase
        .from('rental_items')
        .select(`
          rentals!inner(id, status)
        `)
        .eq('product_id', product.id)
        .in('rentals.status', ['pending', 'confirmed', 'in_progress']);

      // Determinar status correto
      const correctStatus = (!activeRentals || activeRentals.length === 0) ? 'available' : 'rented';
      
      // Atualizar status apenas se necessário
      if (product.status !== correctStatus) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            status: correctStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`❌ Erro ao atualizar produto ${product.id}:`, updateError);
        } else {
          console.log(`✅ Produto ${product.id}: ${product.status} → ${correctStatus}`);
        }
      } else {
        console.log(`✓ Produto ${product.id}: ${correctStatus} (já correto)`);
      }
    }
    
    console.log('✅ Sincronização concluída!');
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  }
};

// Função auxiliar para sincronizar status de um produto específico
const syncSingleProductStatus = async (productId: string) => {
  try {
    console.log(`🔄 Sincronizando produto ${productId}...`);
    
    // Buscar produto atual
    const { data: product } = await supabase
      .from('products')
      .select('id, status')
      .eq('id', productId)
      .single();

    if (!product) {
      console.error(`❌ Produto ${productId} não encontrado`);
      return;
    }

    // Verificar se há aluguéis ativos para este produto
    const { data: activeRentals } = await supabase
      .from('rental_items')
      .select(`
        rentals!inner(id, status, rental_start_date, rental_end_date)
      `)
      .eq('product_id', productId)
      .in('rentals.status', ['pending', 'confirmed', 'in_progress']);

    // Determinar status correto
    const correctStatus = (!activeRentals || activeRentals.length === 0) ? 'available' : 'rented';
    
    console.log(`📊 Produto ${productId}:`);
    console.log(`   Status atual: ${product.status}`);
    console.log(`   Status correto: ${correctStatus}`);
    console.log(`   Aluguéis ativos: ${activeRentals?.length || 0}`);
    
    // Atualizar status apenas se necessário
    if (product.status !== correctStatus) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          status: correctStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updateError) {
        console.error(`❌ Erro ao atualizar produto ${productId}:`, updateError);
      } else {
        console.log(`✅ Produto ${productId} atualizado: ${product.status} → ${correctStatus}`);
      }
    } else {
      console.log(`✓ Produto ${productId} já está correto: ${correctStatus}`);
    }
    
  } catch (error) {
    console.error(`❌ Erro na sincronização do produto ${productId}:`, error);
  }
};

export const useDeleteRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Excluindo aluguel:', id);
      
      // Primeiro, buscar os produtos do aluguel para verificar seu status
      const { data: rentalItems } = await supabase
        .from('rental_items')
        .select('product_id')
        .eq('rental_id', id);

      console.log('📦 Produtos no aluguel:', rentalItems?.map(item => item.product_id));

      // Excluir o aluguel
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      // Verificar se os produtos podem ser marcados como disponíveis
      if (rentalItems && rentalItems.length > 0) {
        const productIds = rentalItems.map(item => item.product_id);
        
        // Para cada produto, verificar se ainda há outros aluguéis ativos
        for (const productId of productIds) {
          // Buscar outros aluguéis ativos que usam este produto
          const { data: otherActiveRentals } = await supabase
            .from('rental_items')
            .select(`
              rentals!inner(id, status)
            `)
            .eq('product_id', productId)
            .in('rentals.status', ['pending', 'confirmed', 'in_progress']);

          console.log(`🔍 Produto ${productId} - outros aluguéis ativos:`, otherActiveRentals?.length || 0);

          // Se não há outros aluguéis ativos, marcar como disponível
          if (!otherActiveRentals || otherActiveRentals.length === 0) {
            const { error: updateError } = await supabase
              .from('products')
              .update({ status: 'available' })
              .eq('id', productId);

            if (updateError) {
              console.error(`❌ Erro ao atualizar status do produto ${productId}:`, updateError);
            } else {
              console.log(`✅ Produto ${productId} marcado como disponível`);
            }
          } else {
            console.log(`⚠️ Produto ${productId} ainda em uso por outros aluguéis ativos`);
          }
        }
      }

      // Executar sincronização completa para garantir consistência
      await syncAllProductStatuses();
    },
    onSuccess: () => {
      // Invalidar múltiplas queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['product-availability'] }); // Cache de disponibilidade
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Cache de produtos
      queryClient.invalidateQueries({ queryKey: ['rental-items'] }); // Cache de itens de aluguel
      
      // Forçar reload completo dos dados
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['products'] });
        queryClient.refetchQueries({ queryKey: ['product-availability'] });
      }, 500);
      
      toast({
        title: "Aluguel excluído",
        description: "Aluguel removido com sucesso! Status dos produtos sincronizado. Verifique o console para detalhes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir aluguel: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook para forçar sincronização completa de produtos (útil para debug/correção)
export const useForceSyncProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('🔄 === FORÇANDO SINCRONIZAÇÃO COMPLETA ===');
      
      // Executar sincronização completa
      await syncAllProductStatuses();
      
      // Aguardar um pouco para garantir que as mudanças foram aplicadas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ === SINCRONIZAÇÃO FORÇADA CONCLUÍDA ===');
      return true;
    },
    onSuccess: () => {
      console.log('🔄 Invalidando caches após sincronização forçada...');
      
      // Invalidar múltiplas queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['product-availability'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['rental-items'] });
      
      // Forçar reload completo dos dados
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['products'] });
        queryClient.refetchQueries({ queryKey: ['product-availability'] });
      }, 500);
      
      toast({
        title: "Sincronização forçada",
        description: "Todos os produtos foram sincronizados com sucesso! Verifique o console para detalhes.",
      });
    },
    onError: (error) => {
      console.error('❌ Erro na sincronização forçada:', error);
      toast({
        title: "Erro",
        description: "Erro ao sincronizar produtos: " + error.message,
        variant: "destructive",
      });
    },
  });
};
