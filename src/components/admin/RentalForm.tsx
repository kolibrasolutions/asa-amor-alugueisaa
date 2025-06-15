
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { useCreateRental, useUpdateRental, useRental } from '@/hooks/useRentals';
import { useCreateRentalItem, useRentalItems, useDeleteRentalItem } from '@/hooks/useRentalItems';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const rentalSchema = z.object({
  customer_id: z.string().min(1, 'Cliente é obrigatório'),
  event_date: z.date({ required_error: 'Data do evento é obrigatória' }),
  rental_start_date: z.date({ required_error: 'Data de início é obrigatória' }),
  rental_end_date: z.date({ required_error: 'Data de fim é obrigatória' }),
  total_amount: z.number().min(0, 'Valor total deve ser positivo'),
  deposit_amount: z.number().min(0).optional(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
});

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  rentalId?: string | null;
  onClose: () => void;
}

interface SelectedProduct {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export const RentalForm = ({ rentalId, onClose }: RentalFormProps) => {
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const { data: rental } = useRental(rentalId || '');
  const { data: rentalItems } = useRentalItems(rentalId || '');
  const createRental = useCreateRental();
  const updateRental = useUpdateRental();
  const createRentalItem = useCreateRentalItem();
  const deleteRentalItem = useDeleteRentalItem();

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [newProduct, setNewProduct] = useState({
    product_id: '',
    quantity: 1,
    unit_price: 0,
  });

  const form = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      status: 'pending',
      total_amount: 0,
      deposit_amount: 0,
    },
  });

  // Carregar dados do aluguel para edição
  useEffect(() => {
    if (rental) {
      form.reset({
        customer_id: rental.customer_id,
        event_date: new Date(rental.event_date),
        rental_start_date: new Date(rental.rental_start_date),
        rental_end_date: new Date(rental.rental_end_date),
        total_amount: rental.total_amount,
        deposit_amount: rental.deposit_amount || 0,
        status: rental.status,
        notes: rental.notes || '',
      });
    }
  }, [rental, form]);

  // Carregar itens do aluguel
  useEffect(() => {
    if (rentalItems) {
      setSelectedProducts(
        rentalItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );
    }
  }, [rentalItems]);

  // Calcular total automaticamente
  useEffect(() => {
    const total = selectedProducts.reduce(
      (acc, item) => acc + (item.quantity * item.unit_price),
      0
    );
    form.setValue('total_amount', total);
  }, [selectedProducts, form]);

  const addProduct = () => {
    if (!newProduct.product_id) return;

    const product = products?.find(p => p.id === newProduct.product_id);
    if (!product) return;

    const productToAdd = {
      ...newProduct,
      unit_price: newProduct.unit_price || product.rental_price || 0,
    };

    setSelectedProducts(prev => [...prev, productToAdd]);
    setNewProduct({ product_id: '', quantity: 1, unit_price: 0 });
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: RentalFormData) => {
    try {
      let rentalResult;

      // Convert dates to strings for the database
      const rentalData = {
        ...data,
        event_date: data.event_date.toISOString().split('T')[0],
        rental_start_date: data.rental_start_date.toISOString().split('T')[0],
        rental_end_date: data.rental_end_date.toISOString().split('T')[0],
        status: data.status || 'pending',
      };

      if (rentalId) {
        rentalResult = await updateRental.mutateAsync({ id: rentalId, ...rentalData });
      } else {
        rentalResult = await createRental.mutateAsync(rentalData);
      }

      // Gerenciar itens do aluguel
      if (rentalResult) {
        const currentRentalId = rentalId || rentalResult.id;

        // Remover itens existentes se estiver editando
        if (rentalId && rentalItems) {
          for (const item of rentalItems) {
            await deleteRentalItem.mutateAsync(item.id);
          }
        }

        // Adicionar novos itens
        for (const product of selectedProducts) {
          await createRentalItem.mutateAsync({
            rental_id: currentRentalId,
            ...product,
          });
        }
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar aluguel:', error);
    }
  };

  const getProductName = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">
          {rentalId ? 'Editar Aluguel' : 'Novo Aluguel'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                        <SelectItem value="completed">Finalizado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do Evento *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rental_start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rental_end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Sinal (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos do Aluguel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium">Produto</label>
                  <Select
                    value={newProduct.product_id}
                    onValueChange={(value) =>
                      setNewProduct(prev => ({ ...prev, product_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Quantidade</label>
                  <Input
                    type="number"
                    min="1"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Preço Unitário (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.unit_price}
                    onChange={(e) =>
                      setNewProduct(prev => ({ ...prev, unit_price: parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>

                <Button type="button" onClick={addProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {selectedProducts.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço Unit.</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{getProductName(item.product_id)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>R$ {item.unit_price.toFixed(2)}</TableCell>
                          <TableCell>R$ {(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeProduct(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-end">
                <FormField
                  control={form.control}
                  name="total_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          readOnly
                          className="text-right font-bold text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre o aluguel..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createRental.isPending || updateRental.isPending}
            >
              {rentalId ? 'Atualizar' : 'Criar'} Aluguel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
