
import { Badge } from '@/components/ui/badge';

interface RentalStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
}

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const },
  confirmed: { label: 'Confirmado', variant: 'default' as const },
  in_progress: { label: 'Em Andamento', variant: 'outline' as const },
  completed: { label: 'Finalizado', variant: 'destructive' as const },
  cancelled: { label: 'Cancelado', variant: 'secondary' as const },
  overdue: { label: 'EM ATRASO', variant: 'destructive' as const },
};

export const RentalStatusBadge = ({ status }: RentalStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={status === 'overdue' ? 'bg-red-600 text-white font-bold animate-pulse' : ''}>
      {config.label}
    </Badge>
  );
};
