import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';
import { useColors, useCreateColor, useUpdateColor, useDeleteColor, Color, CreateColorData } from '@/hooks/useColors';
import { useToast } from '@/components/ui/use-toast';

const ColorsManagement = () => {
  const { data: colors, isLoading } = useColors();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [formData, setFormData] = useState<CreateColorData>({
    name: '',
    value: '',
    hex_code: '#FFFFFF'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      hex_code: '#FFFFFF'
    });
    setEditingColor(null);
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
      if (editingColor) {
        await updateColor.mutateAsync({
          id: editingColor.id,
          ...formData
        });
      } else {
        await createColor.mutateAsync(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cor:', error);
    }
  };

  const handleEdit = (color: Color) => {
    if (color.is_default) {
      toast({
        title: "Ação não permitida",
        description: "Cores padrão não podem ser editadas.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingColor(color);
    setFormData({
      name: color.name,
      value: color.value,
      hex_code: color.hex_code
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (color: Color) => {
    if (color.is_default) {
      toast({
        title: "Ação não permitida",
        description: "Cores padrão não podem ser removidas.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteColor.mutateAsync(color.id);
    } catch (error) {
      console.error('Erro ao deletar cor:', error);
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
        <p>Carregando cores...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-asa-dark" />
          <h1 className="text-2xl font-serif text-asa-dark">Gerenciar Cores</h1>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-asa-blush hover:bg-asa-blush/90 text-asa-dark">
              <Plus className="h-4 w-4 mr-2" />
              Nova Cor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingColor ? 'Editar Cor' : 'Nova Cor'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Cor</Label>
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
                  placeholder="Ex: Rosa Claro"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="value">Valor (ID único)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Ex: rosa-claro"
                  pattern="[a-z0-9-]+"
                  title="Apenas letras minúsculas, números e hífens"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Apenas letras minúsculas, números e hífens. Será gerado automaticamente.
                </p>
              </div>
              
              <div>
                <Label htmlFor="hex_code">Código da Cor</Label>
                <div className="flex gap-2">
                  <Input
                    id="hex_code"
                    type="color"
                    value={formData.hex_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                    className="w-20 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={formData.hex_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                    placeholder="#FFFFFF"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createColor.isPending || updateColor.isPending}>
                  {editingColor ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {colors?.map((color) => (
          <Card key={color.id} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  <CardTitle className="text-sm font-medium">{color.name}</CardTitle>
                </div>
                {color.is_default && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Padrão
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-xs text-gray-600">
                <p><strong>Valor:</strong> {color.value}</p>
                <p><strong>Código:</strong> {color.hex_code}</p>
              </div>
              
              {!color.is_default && (
                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(color)}
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
                          Tem certeza que deseja remover a cor "{color.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(color)}>
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

export default ColorsManagement; 