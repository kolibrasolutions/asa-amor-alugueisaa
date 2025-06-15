
import { Filter } from 'lucide-react';

const NoProductsFound = () => {
  return (
    <div className="text-center py-12">
      <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum produto encontrado
      </h3>
      <p className="text-gray-500">
        Tente ajustar os filtros para encontrar o que procura.
      </p>
    </div>
  );
};

export default NoProductsFound;
