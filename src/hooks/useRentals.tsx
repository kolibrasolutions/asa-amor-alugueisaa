import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sendWhatsAppNotification, sendNtfyNotification } from '@/lib/utils';

export interface Rental {
  id: string;
  customer_id: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RentalWithCustomer {
  id: string;
  customer_id: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  deposit_amount?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
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

interface RentalResponse {
  id: string;
  customer_id: string;
  rental_start_date: string;
  rental_end_date: string;
  event_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  customer: Customer;
}

export const useRentals = () => {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          customer:customers!inner(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      // Transform data to match RentalWithCustomer interface
      return (data as RentalResponse[]).map((rental) => ({
        ...rental,
        customer_nome: rental.customer.full_name,
        customer_endereco: rental.customer.address,
        customer_telefone: rental.customer.phone,
        customer_cpf: rental.customer.document_number,
        customer_rg: '',
        customer_cidade: '',
        customer_email: rental.customer.email,
      })) as RentalWithCustomer[];
    },
  });
};

export const useRental = (id: string) => {
  return useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          customer:customers!inner(*),
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
      
      // Transform data to match RentalWithCustomer interface
      const transformedData = {
        ...data,
        customer_nome: data.customer?.full_name,
        customer_endereco: data.customer?.address,
        customer_telefone: data.customer?.phone,
        customer_cpf: data.customer?.document_number,
        customer_rg: '',
        customer_cidade: '',
        customer_email: data.customer?.email,
      };
      
      return transformedData as RentalWithCustomer;
    },
    enabled: !!id,
  });
};

export const useCreateRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (rental: Omit<Rental, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('rentals')
        .insert([rental])
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
    console.log('=== ENVIANDO NOTIFICAÇÃO DE ALUGUEL ===');
    console.log('Rental ID:', rentalId);
    
    // Buscar dados do aluguel
    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', rentalId)
      .single();

    if (rentalError) {
      console.error('Erro ao buscar aluguel:', rentalError);
      return;
    }

    console.log('📋 Dados do aluguel:', rental);

    // Buscar cliente diretamente usando o customer_id
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', rental.customer_id)
      .single();

    console.log('👤 Dados do cliente raw:', customer);
    console.log('👤 Campos disponíveis:', customer ? Object.keys(customer) : 'null');
    
    if (customerError) {
      console.error('❌ Erro ao buscar cliente:', customerError);
    }

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
      customerName: customer?.full_name || (customer ? `Cliente ID: ${rental.customer_id}` : 'Cliente não encontrado'),
      eventDate: rental.event_date ? new Date(rental.event_date).toLocaleDateString('pt-BR') : 'Não informado',
      startDate: rental.rental_start_date ? new Date(rental.rental_start_date).toLocaleDateString('pt-BR') : 'Não informado',
      endDate: rental.rental_end_date ? new Date(rental.rental_end_date).toLocaleDateString('pt-BR') : 'Não informado',
      itemsCount: rentalItems?.length || 0,
      status: rental.status || 'pending',
      products: products
    };

    console.log('📋 Dados para notificação:', summary);

    // === TENTAR NTFY.SH PRIMEIRO (RECOMENDADO) ===
    const ntfyTopic = localStorage.getItem('ntfy_topic');
    const ntfyServerUrl = localStorage.getItem('ntfy_server_url') || 'https://ntfy.sh';
    
    let ntfySuccess = false;
    if (ntfyTopic) {
      try {
        console.log('📤 Enviando notificação ntfy...');
        ntfySuccess = await sendNtfyNotification(
          {
            topic: ntfyTopic,
            serverUrl: ntfyServerUrl
          },
          summary
        );

        if (ntfySuccess) {
          console.log('✅ Notificação ntfy enviada com sucesso!');
        } else {
          console.log('❌ Falha no envio ntfy');
        }
      } catch (error) {
        console.error('Erro ao enviar notificação ntfy:', error);
      }
    } else {
      console.log('⚠️ ntfy não configurado');
    }

    // === FALLBACK PARA WHATSAPP SE NTFY FALHAR ===
    if (!ntfySuccess) {
      const whatsappPhone = localStorage.getItem('whatsapp_phone');
      const whatsappApiKey = localStorage.getItem('whatsapp_api_key');
      
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
      } else if (!ntfyTopic) {
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

// Função auxiliar para sincronizar status dos produtos
const syncAllProductStatuses = async () => {
  try {
    console.log('🔄 Sincronizando status de todos os produtos...');
    
    // Buscar todos os produtos
    const { data: allProducts } = await supabase
      .from('products')
      .select('id');

    if (!allProducts) return;

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
      
      // Atualizar status se necessário
      await supabase
        .from('products')
        .update({ status: correctStatus })
        .eq('id', product.id);
      
      console.log(`📦 Produto ${product.id}: ${correctStatus}`);
    }
    
    console.log('✅ Sincronização concluída!');
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
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
