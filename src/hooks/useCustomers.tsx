import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Customer {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  cidade: string;
  cpf: string;
  rg: string;
  email?: string;
  created_at?: string;
}

export type CustomerInsert = Omit<Customer, 'id' | 'created_at'>;

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match Customer interface
      return (data ?? []).map((customer: any) => ({
        id: customer.id,
        nome: customer.nome || customer.full_name || '',
        endereco: customer.endereco || customer.address || '',
        telefone: customer.telefone || customer.phone || '',
        cidade: customer.cidade || '',
        cpf: customer.cpf || customer.document_number || '',
        rg: customer.rg || '',
        email: customer.email || '',
        created_at: customer.created_at,
      })) as Customer[];
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (customer: CustomerInsert) => {
      // Map frontend interface to database structure
      const dbCustomer = {
        nome: customer.nome,
        endereco: customer.endereco,
        telefone: customer.telefone,
        cidade: customer.cidade,
        cpf: customer.cpf,
        rg: customer.rg,
        email: customer.email,
      };
      
      const { data, error } = await supabase
        .from('customers')
        .insert([dbCustomer as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente criado",
        description: "Cliente adicionado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar cliente: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...customer }: Partial<Customer> & { id: string }) => {
      // Map frontend interface to database structure
      const dbCustomer = {
        ...(customer.nome && { nome: customer.nome }),
        ...(customer.endereco && { endereco: customer.endereco }),
        ...(customer.telefone && { telefone: customer.telefone }),
        ...(customer.cidade && { cidade: customer.cidade }),
        ...(customer.cpf && { cpf: customer.cpf }),
        ...(customer.rg && { rg: customer.rg }),
        ...(customer.email && { email: customer.email }),
      };
      
      const { data, error } = await supabase
        .from('customers')
        .update(dbCustomer as any)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente: " + error.message,
        variant: "destructive",
      });
    },
  });
};
