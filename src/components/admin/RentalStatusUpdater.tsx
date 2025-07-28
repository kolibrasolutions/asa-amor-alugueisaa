
import * as React from 'react';
import { useState } from 'react';
import { useUpdateRental, type RentalWithCustomer, type Rental } from '@/hooks/useRentals';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface RentalStatusUpdaterProps {
  rental: RentalWithCustomer;
  children: React.ReactNode;
}

const statusOptions: Array<Rental['status']> = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
];

const statusTranslation: Record<Rental['status'], string> = {
    pending: 'Reservado',
    confirmed: 'Confirmado',
    'in_progress': 'Em andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    overdue: 'Em Atraso'
};

export const RentalStatusUpdater = ({ rental, children }: RentalStatusUpdaterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Rental['status']>(rental.status);
  const { mutate: updateRental, isPending } = useUpdateRental();

  const handleUpdate = () => {
    updateRental(
      { id: rental.id, status: selectedStatus },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Alterar Status</h4>
            <p className="text-sm text-muted-foreground">
              Selecione o novo status para o aluguel.
            </p>
          </div>
          <div className="grid gap-2">
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as Rental['status'])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {statusTranslation[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleUpdate} disabled={isPending || selectedStatus === rental.status}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
