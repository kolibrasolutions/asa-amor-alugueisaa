import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Ruler } from 'lucide-react';
import { useSizes, useCreateSize, useUpdateSize, useDeleteSize, Size, CreateSizeData } from '@/hooks/useSizes';
import { useToast } from '@/components/ui/use-toast';

const SizesManagement = () => {
  const { data: sizes, isLoading } = useSizes();
  const createSize = useCreateSize();
  const updateSize = useUpdateSize();
  const deleteSize = useDeleteSize();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [formData, setFormData] = useState<CreateSizeData>({
    name: '',
    value: '',
    sort_order: 0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      sort_order: 0
    });
    setEditingSize(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se o valor não contém espaços ou caracteres especiais
    const valueRegex = /^[a-z0-9-]+$/;
    if (!valueRegex.test(formData.value)) {
      toast({
        title: "Valor inválido",
        description: "O valor deve conter apenas letras minúsculas, números e hífens.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSize) {
        await updateSize.mutateAsync({
          id: editingSize.id,
          ...formData
        });
      } else {
        await createSize.mutateAsync(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar tamanho:', error);
    }
  };

  const handleEdit = (size: Size) => {
    if (size.is_default) {
      toast({
        title: "Ação não permitida",
        description: "Tamanhos padrão não podem ser editados.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingSize(size);
    setFormData({
      name: size.name,
      value: size.value,
      sort_order: size.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (size: Size) => {
    if (size.is_default) {
      toast({
        title: "Ação não permitida",
        description: "Tamanhos padrão não podem ser removidos.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteSize.mutateAsync(size.id);
    } catch (error) {
      console.error('Erro ao deletar tamanho:', error);
    }
  };

  const generateValueFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Carregando tamanhos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Ruler className="h-6 w-6 text-asa-dark" />
          <h1 className="text-2xl font-serif text-asa-dark">Gerenciar Tamanhos</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-asa-blush hover:bg-asa-blush/90 text-asa-dark">
              <Plus className="h-4 w-4 mr-2" />
              Novo Tamanho
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSize ? 'Editar Tamanho' : 'Novo Tamanho'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Tamanho</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      value: generateValueFromName(name)
                    }));
                  }}
                  placeholder="Ex: GG"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="value">Valor (ID único)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Ex: gg"
                  pattern="[a-z0-9-]+"
                  title="Apenas letras minúsculas, números e hífens"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Apenas letras minúsculas, números e hífens. Será gerado automaticamente.
                </p>
              </div>
              
              <div>
                <Label htmlFor="sort_order">Ordem de Exibição</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ordem em que o tamanho será exibido (menor número aparece primeiro).
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createSize.isPending || updateSize.isPending}>
                  {editingSize ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sizes?.map((size) => (
          <Card key={size.id} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-asa-blush/20 rounded-lg flex items-center justify-center">
                    <span className="text-asa-dark font-semibold text-sm">{size.name}</span>
                  </div>
                  <CardTitle className="text-sm font-medium">{size.name}</CardTitle>
                </div>
                {size.is_default && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Padrão
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Valor:</strong> {size.value}</p>
                <p><strong>Ordem:</strong> {size.sort_order}</p>
              </div>
              
              {!size.is_default && (
                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(size)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover o tamanho "{size.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(size)}>
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SizesManagement; 