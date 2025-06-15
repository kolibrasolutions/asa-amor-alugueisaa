import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCustomer, useUpdateCustomer, Customer } from '@/hooks/useCustomers';

const customerSchema = z.object({
  full_name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  document_number: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer | null;
  onClose: () => void;
}

export const CustomerForm = ({ customer, onClose }: CustomerFormProps) => {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {},
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      // Convert empty strings to undefined for optional fields, but keep full_name
      const cleanData: Omit<Customer, 'id' | 'created_at' | 'updated_at'> = {
        full_name: data.full_name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        document_number: data.document_number || undefined,
        notes: data.notes || undefined,
      };

      if (customer) {
        await updateCustomer.mutateAsync({ id: customer.id, ...cleanData });
      } else {
        await createCustomer.mutateAsync(cleanData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {customer ? 'Editar Cliente' : 'Novo Cliente'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input
            id="full_name"
            {...register('full_name')}
            placeholder="Nome completo do cliente"
          />
          {errors.full_name && (
            <p className="text-sm text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="document_number">CPF/CNPJ</Label>
          <Input
            id="document_number"
            {...register('document_number')}
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Textarea
            id="address"
            {...register('address')}
            placeholder="Endereço completo"
          />
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Observações sobre o cliente"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={createCustomer.isPending || updateCustomer.isPending}
          >
            {createCustomer.isPending || updateCustomer.isPending
              ? 'Salvando...'
              : customer ? 'Atualizar' : 'Criar'
            }
          </Button>
        </div>
      </form>
    </div>
  );
};
