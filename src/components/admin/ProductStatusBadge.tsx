
import { Badge } from '@/components/ui/badge';

interface ProductStatusBadgeProps {
  status: 'available' | 'rented' | 'maintenance';
}

const statusConfig = {
  available: { label: 'Disponível', variant: 'default' as const, color: 'bg-green-500' },
  rented: { label: 'Alugado', variant: 'destructive' as const, color: 'bg-red-500' },
  maintenance: { label: 'Manutenção', variant: 'secondary' as const, color: 'bg-yellow-500' },
};

export const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
