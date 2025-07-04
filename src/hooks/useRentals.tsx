import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sendWhatsAppNotification } from '@/lib/utils';

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
      return data.map((rental: any) => ({
        ...rental,
        customer_nome: (rental.customer as any)?.nome,
        customer_endereco: (rental.customer as any)?.endereco,
        customer_telefone: (rental.customer as any)?.telefone,
        customer_cpf: (rental.customer as any)?.cpf,
        customer_rg: (rental.customer as any)?.rg,
        customer_cidade: (rental.customer as any)?.cidade,
        customer_email: (rental.customer as any)?.email,
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
        customer_nome: data.customer?.nome,
        customer_endereco: data.customer?.endereco,
        customer_telefone: data.customer?.telefone,
        customer_cpf: data.customer?.cpf,
        customer_rg: data.customer?.rg,
        customer_cidade: data.customer?.cidade,
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
        .from('rental_with_customer')
        .insert([rental])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async (newRental) => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      
      toast({
        title: "Aluguel criado",
        description: "Aluguel criado com sucesso!",
      });

      // Enviar notificação WhatsApp
      try {
        // Buscar configurações do WhatsApp (você pode armazenar no localStorage ou variáveis de ambiente)
        const whatsappPhone = localStorage.getItem('whatsapp_phone');
        const whatsappApiKey = localStorage.getItem('whatsapp_api_key');
        
        if (whatsappPhone && whatsappApiKey) {
          // Buscar dados completos do cliente
          const { data: customerData } = await supabase
            .from('customers')
            .select('nome')
            .eq('id', newRental.customer_id)
            .single();

          // Buscar itens do aluguel
          const { data: rentalItems } = await supabase
            .from('rental_items')
            .select('*')
            .eq('rental_id', newRental.id);

          if (customerData) {
            const summary = {
              customerName: (customerData as any).nome,
              eventDate: new Date(newRental.event_date).toLocaleDateString('pt-BR'),
              startDate: new Date(newRental.rental_start_date).toLocaleDateString('pt-BR'),
              endDate: new Date(newRental.rental_end_date).toLocaleDateString('pt-BR'),
              itemsCount: rentalItems?.length || 0,
              status: newRental.status
            };

            const success = await sendWhatsAppNotification(
              {
                phoneNumber: whatsappPhone,
                apiKey: whatsappApiKey
              },
              summary
            );

            if (success) {
              toast({
                title: "📱 WhatsApp enviado",
                description: "Notificação enviada para o WhatsApp!",
              });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao enviar notificação WhatsApp:', error);
        // Não mostrar erro para o usuário, pois o aluguel foi criado com sucesso
      }
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

export const useUpdateRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...rental }: Partial<Rental> & { id: string }) => {
      const { data, error } = await supabase
        .from('rental_with_customer')
        .update(rental)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Aluguel atualizado",
        description: "Aluguel atualizado com sucesso!",
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

export const useDeleteRental = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rental_with_customer')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast({
        title: "Aluguel excluído",
        description: "Aluguel removido com sucesso!",
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
