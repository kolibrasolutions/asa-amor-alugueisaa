import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCustomer, useUpdateCustomer, Customer } from '@/hooks/useCustomers';

const customerSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  rg: z.string().min(1, 'RG é obrigatório'),
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
      // Enviar apenas os campos permitidos
      const cleanData = {
        nome: data.nome,
        endereco: data.endereco,
        telefone: data.telefone,
        cidade: data.cidade,
        cpf: data.cpf,
        rg: data.rg,
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
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            {...register('nome')}
            placeholder="Nome completo"
          />
          {errors.nome && (
            <p className="text-sm text-red-500">{errors.nome.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="endereco">Endereço *</Label>
          <Input
            id="endereco"
            {...register('endereco')}
            placeholder="Endereço completo"
          />
          {errors.endereco && (
            <p className="text-sm text-red-500">{errors.endereco.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="telefone">Tel. *</Label>
            <Input
              id="telefone"
              {...register('telefone')}
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && (
              <p className="text-sm text-red-500">{errors.telefone.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              {...register('cidade')}
              placeholder="Cidade"
            />
            {errors.cidade && (
              <p className="text-sm text-red-500">{errors.cidade.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="text-sm text-red-500">{errors.cpf.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="rg">RG *</Label>
            <Input
              id="rg"
              {...register('rg')}
              placeholder="00.000.000-0"
            />
            {errors.rg && (
              <p className="text-sm text-red-500">{errors.rg.message}</p>
            )}
          </div>
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
