
import { useRental } from '@/hooks/useRentals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RentalStatusBadge } from './RentalStatusBadge';
import { ArrowLeft, Edit, User, Calendar, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RentalDetailsProps {
  rentalId: string;
  onClose: () => void;
  onEdit: () => void;
}

export const RentalDetails = ({ rentalId, onClose, onEdit }: RentalDetailsProps) => {
  const { data: rental, isLoading } = useRental(rentalId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Carregando detalhes do aluguel...</p>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="p-6">
        <p>Aluguel não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Detalhes do Aluguel</h1>
        </div>
        <Button onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-lg">{rental.customer.full_name}</p>
            </div>
            {rental.customer.email && (
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p>{rental.customer.email}</p>
              </div>
            )}
            {rental.customer.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p>{rental.customer.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Informações do Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <RentalStatusBadge status={rental.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Data do Evento</label>
              <p className="text-lg">{formatDate(rental.event_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Período de Aluguel</label>
              <p>{formatDate(rental.rental_start_date)} até {formatDate(rental.rental_end_date)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Valor Total</label>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(rental.total_amount)}
                </p>
              </div>
              {rental.deposit_amount && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Sinal</label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(rental.deposit_amount)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Produtos do Aluguel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rental.rental_items.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Nenhum produto adicionado a este aluguel.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rental.rental_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        {(item.product.brand || item.product.size || item.product.color) && (
                          <p className="text-sm text-gray-500">
                            {[item.product.brand, item.product.size, item.product.color]
                              .filter(Boolean)
                              .join(' - ')}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={3} className="font-bold text-right">
                    Total Geral:
                  </TableCell>
                  <TableCell className="font-bold text-lg">
                    {formatCurrency(rental.total_amount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {rental.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{rental.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
