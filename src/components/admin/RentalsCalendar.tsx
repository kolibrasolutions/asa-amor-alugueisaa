import * as React from 'react';
import { useState, useMemo } from 'react';
import { useRentals, RentalWithDetails } from '@/hooks/useRentals';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RentalStatusBadge } from './RentalStatusBadge';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RentalStatusUpdater } from './RentalStatusUpdater';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

const parseDate = (dateString: string): Date => {
  const parts = dateString.split('-').map(Number);
  // Note: months are 0-indexed in JS Date
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const getStatusColor = (status: RentalWithDetails['status']) => {
  switch (status) {
    case 'pending': return '#FBBF24';
    case 'confirmed': return '#60A5FA';
    case 'in_progress': return '#4ADE80';
    case 'completed': return '#9CA3AF';
    case 'cancelled': return '#F87171';
    default: return '#D1D5DB';
  }
};

const statusStyles: Record<string, React.CSSProperties> = {
  pendente: { backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '0.375rem' },
  confirmado: { backgroundColor: '#DBEAFE', border: '1px solid #93C5FD', borderRadius: '0.375rem' },
  'em andamento': { backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '0.375rem' },
  concluído: { backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '0.375rem' },
  cancelado: { backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '0.375rem' },
};

const statusTranslation: Record<string, string> = {
    pending: 'pendente',
    confirmed: 'confirmado',
    in_progress: 'em andamento',
    completed: 'concluído',
    cancelled: 'cancelado'
}

interface RentalsCalendarProps {
  onSectionChange: (section: string) => void;
}

export const RentalsCalendar = ({ onSectionChange }: RentalsCalendarProps) => {
  const { data: rentals, isLoading } = useRentals();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const modifiers = useMemo(() => {
    if (!rentals) return {};
    const mods: Record<string, Date[]> = {};
    rentals.forEach(rental => {
      const translatedStatus = statusTranslation[rental.status] || rental.status;
      if (!mods[translatedStatus]) {
        mods[translatedStatus] = [];
      }
      mods[translatedStatus].push(parseDate(rental.event_date));
    });
    return mods;
  }, [rentals]);

  const selectedRentals = useMemo(() => {
    if (!selectedDate || !rentals) return [];
    return rentals.filter(rental => isSameDay(parseDate(rental.event_date), selectedDate));
  }, [selectedDate, rentals]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agenda de Aluguéis</h1>
        <Button variant="outline" onClick={() => onSectionChange('rentals')}>
          <ClipboardList className="w-4 h-4 mr-2" />
          Ver Lista de Aluguéis
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="p-3 w-full"
            locale={ptBR}
            modifiers={modifiers}
            modifiersStyles={statusStyles}
          />
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : 'Selecione uma data'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRentals.length > 0 ? (
                <ul className="space-y-4">
                  {selectedRentals.map(rental => (
                    <RentalStatusUpdater key={rental.id} rental={rental}>
                      <li className="border-l-4 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" style={{ borderColor: getStatusColor(rental.status) }}>
                        <p className="font-semibold">{rental.customer.full_name}</p>
                        <div className="text-sm text-muted-foreground">
                          <RentalStatusBadge status={rental.status} />
                        </div>
                      </li>
                    </RentalStatusUpdater>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedDate ? 'Nenhum aluguel para esta data.' : 'Selecione um dia no calendário para ver os detalhes.'}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legenda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(statusStyles).map(([status, style]) => (
                <div key={status} className="flex items-center text-sm">
                  <div className="w-4 h-4 mr-2" style={{ ...style, borderRadius: '9999px' }} />
                  <span className="capitalize">{status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
