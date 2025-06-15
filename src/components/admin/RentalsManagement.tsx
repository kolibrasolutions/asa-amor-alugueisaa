
import { useState } from 'react';
import { useRentals, useDeleteRental } from '@/hooks/useRentals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RentalStatusBadge } from './RentalStatusBadge';
import { RentalForm } from './RentalForm';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RentalDetails } from './RentalDetails';

export const RentalsManagement = () => {
  const { data: rentals, isLoading } = useRentals();
  const deleteRental = useDeleteRental();
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState<string | null>(null);
  const [viewingRental, setViewingRental] = useState<string | null>(null);

  const handleEdit = (rentalId: string) => {
    setEditingRental(rentalId);
    setShowForm(true);
  };

  const handleDelete = (rentalId: string) => {
    deleteRental.mutate(rentalId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRental(null);
  };

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
        <p>Carregando aluguéis...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <RentalForm
        rentalId={editingRental}
        onClose={handleCloseForm}
      />
    );
  }

  if (viewingRental) {
    return (
      <RentalDetails
        rentalId={viewingRental}
        onClose={() => setViewingRental(null)}
        onEdit={() => {
          setEditingRental(viewingRental);
          setViewingRental(null);
          setShowForm(true);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Aluguéis</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Aluguel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aluguéis Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {!rentals || rentals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum aluguel cadastrado ainda.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data do Evento</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">
                      {rental.customer.full_name}
                    </TableCell>
                    <TableCell>{formatDate(rental.event_date)}</TableCell>
                    <TableCell>
                      {formatDate(rental.rental_start_date)} até{' '}
                      {formatDate(rental.rental_end_date)}
                    </TableCell>
                    <TableCell>{formatCurrency(rental.total_amount)}</TableCell>
                    <TableCell>
                      <RentalStatusBadge status={rental.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingRental(rental.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(rental.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este aluguel? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(rental.id)}
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
