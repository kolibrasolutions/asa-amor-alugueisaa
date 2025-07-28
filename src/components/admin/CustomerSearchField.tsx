import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User, X } from 'lucide-react';
import { useCustomers, type Customer } from '@/hooks/useCustomers';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomerSearchFieldProps {
  value?: string;
  onChange: (customerId: string) => void;
  placeholder?: string;
  className?: string;
}

export const CustomerSearchField = ({
  value,
  onChange,
  placeholder = "Buscar cliente por nome ou CPF...",
  className = ""
}: CustomerSearchFieldProps) => {
  const isMobile = useIsMobile();
  const { data: customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Atualizar cliente selecionado quando o value mudar externamente
  useEffect(() => {
    if (value && customers) {
      const customer = customers.find(c => c.id === value);
      setSelectedCustomer(customer || null);
      if (customer) {
        setSearchTerm(customer.nome);
      }
    } else {
      setSelectedCustomer(null);
      setSearchTerm('');
    }
  }, [value, customers]);

  // Filtrar clientes conforme o usuário digita
  useEffect(() => {
    if (!searchTerm.trim() || !customers) {
      setFilteredCustomers([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = customers.filter(customer => {
      const nameMatch = customer.nome.toLowerCase().includes(searchLower);
      const cpfMatch = customer.cpf?.replace(/\D/g, '').includes(searchLower.replace(/\D/g, ''));
      return nameMatch || cpfMatch;
    });

    setFilteredCustomers(filtered.slice(0, 10)); // Limitar a 10 resultados
    setShowSuggestions(filtered.length > 0 && searchTerm.length > 1);
  }, [searchTerm, customers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Se limpar o campo, resetar seleção
    if (!term.trim()) {
      setSelectedCustomer(null);
      onChange('');
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.nome);
    setShowSuggestions(false);
    onChange(customer.id);
  };

  const handleClearSelection = () => {
    setSelectedCustomer(null);
    setSearchTerm('');
    setShowSuggestions(false);
    onChange('');
  };

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`pl-10 ${selectedCustomer ? 'pr-10' : ''}`}
          onFocus={() => {
            if (filteredCustomers.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay para permitir clique nos resultados
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        {selectedCustomer && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClearSelection}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Cliente selecionado */}
      {selectedCustomer && (
        <Card className="mt-2 border-green-200 bg-green-50">
          <CardContent className={`${isMobile ? 'p-2' : 'p-3'}`}>
            <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
              <div className="flex-shrink-0">
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-green-100 rounded-full flex items-center justify-center`}>
                  <User className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-600`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-green-900`}>
                  {selectedCustomer.nome}
                </p>
                <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-green-700 space-y-1`}>
                  {selectedCustomer.cpf && (
                    <p>CPF: {formatCPF(selectedCustomer.cpf)}</p>
                  )}
                  {selectedCustomer.telefone && (
                    <p>Tel: {formatPhone(selectedCustomer.telefone)}</p>
                  )}
                  {selectedCustomer.cidade && (
                    <p>Cidade: {selectedCustomer.cidade}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de sugestões */}
      {showSuggestions && filteredCustomers.length > 0 && (
        <Card className={`absolute top-full left-0 right-0 z-50 mt-1 ${isMobile ? 'max-h-60' : 'max-h-80'} overflow-y-auto border shadow-lg`}>
          <CardContent className="p-0">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className={`w-full text-left ${isMobile ? 'p-2' : 'p-3'} hover:bg-muted border-b last:border-b-0 transition-colors touch-manipulation`}
                onClick={() => handleCustomerSelect(customer)}
              >
                <div className={`flex items-start ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                  <div className="flex-shrink-0">
                    <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-blue-100 rounded-full flex items-center justify-center`}>
                      <User className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-600`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-900`}>
                      {customer.nome}
                    </p>
                    <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 ${isMobile ? 'space-y-0' : 'space-y-1'}`}>
                      {customer.cpf && (
                        <p>CPF: {formatCPF(customer.cpf)}</p>
                      )}
                      {!isMobile && customer.telefone && (
                        <p>Tel: {formatPhone(customer.telefone)}</p>
                      )}
                      {customer.cidade && (
                        <p>Cidade: {customer.cidade}</p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não encontrar resultados */}
      {showSuggestions && filteredCustomers.length === 0 && searchTerm.length > 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 border shadow-lg">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'} text-center ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            Nenhum cliente encontrado com "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 