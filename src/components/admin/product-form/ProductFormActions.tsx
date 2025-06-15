
import { Button } from '@/components/ui/button';

interface ProductFormActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const ProductFormActions = ({ onClose, isSubmitting, isEditing }: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Salvando...'
          : isEditing ? 'Atualizar' : 'Criar'
        }
      </Button>
    </div>
  );
};
