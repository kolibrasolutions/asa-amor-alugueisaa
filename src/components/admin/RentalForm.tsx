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
import { useCreateRental, useUpdateRental, useRental, sendRentalNotification } from '@/hooks/useRentals';
import { useCreateRentalItem, useRentalItems, useDeleteRentalItem } from '@/hooks/useRentalItems';
import { useBulkUpdateProductStatus } from '@/hooks/useProductAvailability';
import { useProductAvailabilityByDate } from '@/hooks/useProductAvailabilityByDate';
import { ProductStatusBadge } from './ProductStatusBadge';
import { CustomerSearchField } from './CustomerSearchField';
import { ProductVariantSearchField } from './ProductVariantSearchField';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const rentalSchema = z.object({
  customer_id: z.string().min(1, 'Cliente é obrigatório'),
  event_date: z.date({ required_error: 'Data do evento é obrigatória' }),
  rental_start_date: z.date({ required_error: 'Data de início é obrigatória' }),
  rental_end_date: z.date({ required_error: 'Data de fim é obrigatória' }),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'overdue']),
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
  const bulkUpdateProductStatus = useBulkUpdateProductStatus();
  const { toast } = useToast();

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [newProduct, setNewProduct] = useState({
    product_id: '',
    quantity: 1,
  });

  const form = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      status: 'pending',
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
        }))
      );
    }
  }, [rentalItems]);

  // Buscar disponibilidade por data
  const watchedDates = form.watch(['rental_start_date', 'rental_end_date']);
  const startDate = watchedDates[0] ? format(watchedDates[0], 'yyyy-MM-dd') : '';
  const endDate = watchedDates[1] ? format(watchedDates[1], 'yyyy-MM-dd') : '';
  
  const allProductIds = products?.map(p => p.id) || [];
  const { data: availabilityData, refetch: refetchAvailability } = useProductAvailabilityByDate({
    productIds: allProductIds,
    startDate,
    endDate,
    excludeRentalId: rentalId || undefined
  });

  // Forçar refetch quando as datas mudarem
  useEffect(() => {
    if (startDate && endDate && allProductIds.length > 0) {

      refetchAvailability();
    }
  }, [startDate, endDate, allProductIds.length, refetchAvailability]);

  // Mostrar todos os produtos, mas com indicação de disponibilidade
  const allProductsWithAvailability = products?.map(product => {
    // Verificar se o produto tem status disponível
    const hasAvailableStatus = product.status === 'available';
    
    // Verificar se o produto está disponível na data selecionada
    const dateAvailability = availabilityData?.find(av => av.productId === product.id);
    const isAvailableOnDate = !startDate || !endDate || dateAvailability?.isAvailable === true;
    const isOverdue = dateAvailability?.isOverdue === true;
    const availabilityStatus = dateAvailability?.status || 'available';
    
    // Se estamos editando, permitir produtos que já estão no aluguel atual
    const isAlreadyInCurrentRental = rentalId && selectedProducts.some(sp => sp.product_id === product.id);
    
    const isFullyAvailable = (hasAvailableStatus && isAvailableOnDate && !isOverdue) || isAlreadyInCurrentRental;
    
    // Debug detalhado
    // console.log(`🔍 Produto ${product.name} (${product.id}):`, {
    //   hasAvailableStatus,
    //   isAvailableOnDate,
    //   isOverdue,
    //   availabilityStatus,
    //   dateAvailability: dateAvailability?.isAvailable,
    //   isAlreadyInCurrentRental,
    //   isFullyAvailable,
    //   status: product.status
    // });
    
    return {
      ...product,
      isFullyAvailable,
      hasAvailableStatus,
      isAvailableOnDate,
      isOverdue,
      availabilityStatus,
      isAlreadyInCurrentRental
    };
  });





  const addProduct = () => {
    if (!newProduct.product_id) return;

    const product = allProductsWithAvailability?.find(p => p.id === newProduct.product_id);
    if (!product || !product.isFullyAvailable) return;

    // Verificar se o produto já foi selecionado
    const alreadySelected = selectedProducts.find(sp => sp.product_id === newProduct.product_id);
    if (alreadySelected) {
      // Atualizar quantidade do produto existente
      setSelectedProducts(prev => 
        prev.map(item => 
          item.product_id === newProduct.product_id
            ? { ...item, quantity: item.quantity + newProduct.quantity }
            : item
        )
      );
    } else {
      // Adicionar novo produto
      setSelectedProducts(prev => [...prev, newProduct]);
    }
    
    setNewProduct({ product_id: '', quantity: 1 });
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const updateProductStatuses = async (status: 'rented' | 'available') => {
    if (selectedProducts.length === 0) return;
    
    const productIds = selectedProducts.map(item => item.product_id);
    await bulkUpdateProductStatus.mutateAsync({ productIds, status });
  };

  const onSubmit = async (data: RentalFormData) => {
    try {
      let rentalResult;

      // Convert dates to strings and ensure all required fields are present
      const rentalData = {
        customer_id: data.customer_id,
        event_date: data.event_date.toISOString().split('T')[0],
        rental_start_date: data.rental_start_date.toISOString().split('T')[0],
        rental_end_date: data.rental_end_date.toISOString().split('T')[0],
        total_amount: 0,
        status: data.status,
        notes: data.notes || '',
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

        // Atualizar status dos produtos baseado no status do aluguel
        if (data.status === 'confirmed' || data.status === 'in_progress') {
          await updateProductStatuses('rented');
        } else if (data.status === 'completed' || data.status === 'cancelled') {
          await updateProductStatuses('available');
        }

        // Enviar notificação APENAS para aluguéis novos (não para edições)
        if (!rentalId) {
          console.log('🔵 MOBILE DEBUG: Iniciando envio de notificação...');
          console.log('🔵 MOBILE DEBUG: User Agent:', navigator.userAgent);
          console.log('🔵 MOBILE DEBUG: Platform:', navigator.platform);
          console.log('🔵 MOBILE DEBUG: Is Mobile?', window.innerWidth < 768);
          
          toast({
            title: "🔔 Enviando notificação...",
            description: "Preparando resumo do aluguel para envio.",
          });
          
          // Enviar notificação diretamente sem setTimeout para melhor compatibilidade mobile
          try {
            console.log('🔵 MOBILE DEBUG: Chamando sendRentalNotification...');
            await sendRentalNotification(currentRentalId);
            console.log('🔵 MOBILE DEBUG: sendRentalNotification concluída com sucesso');
            toast({
              title: "✅ Notificação enviada!",
              description: "Resumo do aluguel enviado com sucesso.",
            });
          } catch (error) {
            console.error('🔴 MOBILE DEBUG: Erro ao enviar notificação:', error);
            toast({
              title: "⚠️ Falha na notificação",
              description: `Erro: ${error.message || 'Erro desconhecido'}`,
              variant: "destructive",
            });
          }
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

  const getProductStatus = (productId: string) => {
    const product = products?.find(p => p.id === productId);
    return product?.status || 'available';
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
                    <FormControl>
                      <CustomerSearchField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Digite o nome ou CPF do cliente..."
                      />
                    </FormControl>
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
                        <SelectItem value="pending">Reservado</SelectItem>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos do Aluguel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(!startDate || !endDate) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Selecione primeiro as datas de início e fim do aluguel para verificar a disponibilidade dos produtos no período.
                  </AlertDescription>
                </Alert>
              )}
              
              {(startDate && endDate) && (!allProductsWithAvailability?.some(p => p.isFullyAvailable)) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(() => {
                      const overdueCount = allProductsWithAvailability?.filter(p => p.isOverdue).length || 0;
                      const occupiedCount = allProductsWithAvailability?.filter(p => !p.isAvailableOnDate && !p.isOverdue).length || 0;
                      
                      if (overdueCount > 0 && occupiedCount > 0) {
                        return `Não há produtos disponíveis para aluguel nas datas selecionadas. ${overdueCount} produto(s) em atraso e ${occupiedCount} produto(s) ocupados neste período.`;
                      } else if (overdueCount > 0) {
                        return `Não há produtos disponíveis para aluguel nas datas selecionadas. ${overdueCount} produto(s) em atraso.`;
                      } else {
                        return 'Não há produtos disponíveis para aluguel nas datas selecionadas. Os produtos mostrados estão ocupados neste período.';
                      }
                    })()
                    }
                  </AlertDescription>
                </Alert>
              )}

              {allProductsWithAvailability && allProductsWithAvailability.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium">Produto</label>
                    <ProductVariantSearchField
                      value={newProduct.product_id}
                      onChange={(productId) =>
                        setNewProduct(prev => ({ ...prev, product_id: productId }))
                      }
                      placeholder="Buscar produto por nome ou SKU..."
                      availableProducts={allProductsWithAvailability?.filter(p => !p.is_variant)}
                      allAvailableProducts={allProductsWithAvailability}
                      showAvailabilityOnly={true}
                    />
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

                  <Button type="button" onClick={addProduct} disabled={!newProduct.product_id}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              )}

              {selectedProducts.length > 0 && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{getProductName(item.product_id)}</TableCell>
                          <TableCell>
                            <ProductStatusBadge status={getProductStatus(item.product_id) as 'available' | 'rented' | 'maintenance'} />
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
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
