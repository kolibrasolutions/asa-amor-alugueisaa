import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProductAvailabilityCheck } from '@/hooks/useProductAvailabilityCheck';
import { Search, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProductAvailabilitySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { mutate: checkAvailability, data: result, isPending, isIdle, isError } = useProductAvailabilityCheck();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      checkAvailability(searchTerm.trim());
    }
  };

  const renderResult = () => {
    if (isPending) {
      return (
        <div className="flex items-center text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Verificando...</span>
        </div>
      );
    }

    if (isIdle) {
      return (
        <div className="flex items-center text-gray-500">
          <Info className="mr-2 h-4 w-4" />
          <span>Insira um ID ou SKU do produto para consultar a disponibilidade.</span>
        </div>
      );
    }
    
    if (isError) {
        return (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              <span>Ocorreu um erro na consulta. Verifique o ID/SKU e tente novamente.</span>
            </div>
        );
    }

    if (!result || !result.product) {
      return (
        <div className="flex items-center text-orange-600">
          <Info className="mr-2 h-4 w-4" />
          <span>Nenhum produto encontrado com o ID ou SKU fornecido.</span>
        </div>
      );
    }

    const { product, rental, isAvailable } = result;

    if (isAvailable) {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center text-green-700">
            <CheckCircle className="mr-2 h-5 w-5" />
            <h4 className="font-semibold text-lg">Produto Disponível</h4>
          </div>
          <p className="text-gray-700 mt-2">O produto <strong>{product.name}</strong> (SKU: {product.sku}) está disponível para aluguel.</p>
        </div>
      );
    }

    if (rental) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center text-red-700">
            <XCircle className="mr-2 h-5 w-5" />
            <h4 className="font-semibold text-lg">Produto Indisponível</h4>
          </div>
          <div className="text-gray-700 mt-2 space-y-1">
             <p>O produto <strong>{product.name}</strong> (SKU: {product.sku}) está atualmente alugado.</p>
             <p><strong>Cliente:</strong> {rental.customers?.nome ?? 'Não informado'}</p>
             <p>
                <strong>Devolução Prevista:</strong> 
                <span className="font-semibold text-red-800 ml-1">
                    {format(new Date(rental.rental_end_date), "dd/MM/yyyy", { locale: ptBR })}
                </span>
             </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta Rápida de Produto</CardTitle>
        <CardDescription>Verifique a disponibilidade de um item usando seu ID ou SKU.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
          <Input 
            placeholder="Digite o ID ou SKU do produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isPending || !searchTerm.trim()}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="hidden sm:inline ml-2">Buscar</span>
          </Button>
        </form>
        <div className="mt-4 pt-4 border-t">
          {renderResult()}
        </div>
      </CardContent>
    </Card>
  );
};
