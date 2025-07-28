import React, { useState } from 'react';
import { useRentals, useDeleteRental, useRental, useConfirmReturn, getEffectiveStatus, type RentalWithCustomer, type RentalItem } from '@/hooks/useRentals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RentalStatusBadge } from './RentalStatusBadge';
import { RentalForm } from './RentalForm';
import { Plus, Edit, Trash, Eye, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RentalDetails } from './RentalDetails';
import { AdminBackButton } from './AdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface RentalsManagementProps {
  onSectionChange: (section: string) => void;
}

export const RentalsManagement = ({ onSectionChange }: RentalsManagementProps) => {
  const isMobile = useIsMobile();
  const { data: rentals, isLoading } = useRentals();
  const deleteRental = useDeleteRental();
  const confirmReturn = useConfirmReturn();
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState<string | null>(null);
  const [viewingRental, setViewingRental] = useState<string | null>(null);
  const [contractRentalId, setContractRentalId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { toast } = useToast();
  
  // Buscar dados completos do aluguel quando for gerar contrato
  const { data: contractRental } = useRental(contractRentalId || '');

  const handleEdit = (rentalId: string) => {
    setEditingRental(rentalId);
    setFormKey(prev => prev + 1);
    setShowForm(true);
  };

  const handleDelete = (rentalId: string) => {
    deleteRental.mutate(rentalId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRental(null);
  };

  const handleGenerateContract = (rentalId: string) => {
    setContractRentalId(rentalId);
  };

  const handleConfirmReturn = (rentalId: string) => {
    confirmReturn.mutate(rentalId);
  };

  const generateContractDocument = React.useCallback((rental: RentalWithCustomer) => {
    if (!rental) return;
    
    try {
      // Gerar número do contrato baseado no ID do rental (últimos 4 dígitos)
      const contractNumber = rental.id.slice(-4).toUpperCase();
      
      // Monta HTML do contrato baseado no modelo físico
      const win = window.open('', '_blank');
      if (!win) {
        toast({
          title: "Erro",
          description: "Não foi possível abrir a janela para o contrato. Verifique se o bloqueador de pop-up está desabilitado.",
          variant: "destructive",
        });
        return;
      }
      
      // Produtos com código, quantidade, descrição, ajustes e valor (campos vazios para preenchimento manual)
      const produtosHtml = rental.rental_items?.map((item: RentalItem, idx: number) => `
        <tr>
          <td style="border:1px solid #333;padding:4px;text-align:center;width:50px;font-size:11px;">${String(idx + 1).padStart(3, '0')}</td>
          <td style="border:1px solid #333;padding:4px;text-align:center;width:50px;font-size:11px;">${item.quantity}</td>
          <td style="border:1px solid #333;padding:4px;font-size:11px;">${item.product.name}${item.product.brand ? ` - ${item.product.brand}` : ''}${item.product.size ? ` - Tam: ${item.product.size}` : ''}${item.product.color ? ` - ${item.product.color}` : ''}</td>
          <td style="border:1px solid #333;padding:4px;width:70px;text-align:center;font-size:11px;"></td>
          <td style="border:1px solid #333;padding:4px;width:80px;text-align:center;font-size:11px;"></td>
        </tr>
      `).join('') || '';
      
      // Não adicionar linhas vazias desnecessárias
      
      const html = `
        <html>
        <head>
          <title>Contrato de Aluguel - Nº ${contractNumber}</title>
          <style>
            @page { 
              margin: 15mm; 
              size: A4;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0;
              font-size: 11px;
              line-height: 1.3;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              border-bottom: 2px solid #333;
              padding-bottom: 8px;
            }
            .header-left {
              flex: 1;
            }
            .header-right {
              flex: 1;
              text-align: right;
            }
            .logo { 
              font-size: 20px; 
              font-weight: bold; 
              margin-bottom: 3px;
              color: #333;
            }
            .logo-subtitle {
              font-size: 9px;
              margin-bottom: 5px;
              line-height: 1.2;
            }
            .contact-info {
              font-size: 9px;
              background-color: #f0f0f0;
              padding: 3px;
              border-radius: 2px;
            }
            .contract-number {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .section-title {
              background-color: #333;
              color: white;
              text-align: center;
              padding: 5px;
              margin: 10px 0 8px 0;
              font-weight: bold;
              font-size: 12px;
            }
            .customer-info {
              margin-bottom: 10px;
            }
            .customer-row {
              margin-bottom: 5px;
              min-height: 16px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2px;
              display: flex;
              align-items: center;
            }
            .customer-row-flex {
              display: flex;
              gap: 15px;
              margin-bottom: 5px;
            }
            .customer-row-flex > div {
              flex: 1;
              min-height: 16px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2px;
            }
            .contracted-info {
              margin-bottom: 10px;
              padding: 8px;
              background-color: #f9f9f9;
              border: 1px solid #ddd;
              font-size: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 8px 0;
            }
            th { 
              background-color: #333;
              color: white;
              padding: 5px;
              text-align: center;
              font-weight: bold;
              border: 1px solid #333;
              font-size: 11px;
            }
            td { 
              border: 1px solid #333;
              padding: 4px;
              vertical-align: top;
            }
            .total-row {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: right;
            }
            .terms { 
              font-size: 9px; 
              margin-top: 15px;
              text-align: justify;
              line-height: 1.2;
            }
            .terms h4 {
              background-color: #333;
              color: white;
              text-align: center;
              padding: 4px;
              margin: 10px 0 8px 0;
              font-size: 11px;
            }
            .clause {
              margin-bottom: 6px;
            }
            .signatures { 
              margin-top: 20px;
              page-break-inside: avoid;
            }
            .signature-date {
              text-align: center;
              margin: 20px 0;
              font-size: 10px;
            }
            .signature-line {
              display: inline-block;
              width: 150px;
              border-bottom: 1px solid #333;
              margin: 0 8px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin: 25px 0;
            }
            .signature-box {
              text-align: center;
              width: 45%;
              font-size: 10px;
            }
            .signature-box-line {
              border-bottom: 1px solid #333;
              margin-top: 15px;
              height: 1px;
            }
            .witnesses {
              margin-top: 20px;
              font-size: 10px;
            }
            .witness-line {
              border-bottom: 1px solid #333;
              margin: 8px 0;
              height: 1px;
            }
            .return-confirmation {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <div class="logo">📋 NOIVAS CIRLENE</div>
              <div class="logo-subtitle">
                <strong>ALUGUEL DE:</strong> Vestidos de Noivas, Ternos, Pajens,<br/>
                Damas de honra, Floristas, Madrinhas, Roupas em geral.<br/>
                <strong>Nacionais e Importadas</strong>
              </div>
            </div>
            <div class="header-right">
              <div class="contract-number">Nº ${contractNumber}</div>
              <div class="contact-info">
                Tel.: (35) 3571-2422 / (35) 9 9147-9232<br/>
                Rua Barão do Rio Branco, Oito 855<br/>
                Muzambinho/MG
              </div>
            </div>
          </div>

          <div class="section-title">CONTRATANTE</div>
          <div class="customer-info">
            <div class="customer-row">
              <strong>Nome:</strong> ${rental.customer_nome || '_'.repeat(80)}
            </div>
            <div class="customer-row">
              <strong>Endereço:</strong> ${rental.customer_endereco || '_'.repeat(70)}
            </div>
            <div class="customer-row-flex">
              <div>
                <strong>Tel.:</strong> ${rental.customer_telefone || '_'.repeat(25)}
              </div>
              <div>
                <strong>Cidade:</strong> ${rental.customer_cidade || '_'.repeat(25)}
              </div>
            </div>
            <div class="customer-row-flex">
              <div>
                <strong>CPF:</strong> ${rental.customer_cpf || '_'.repeat(20)}
              </div>
              <div>
                <strong>RG:</strong> ${rental.customer_rg || '_'.repeat(20)}
              </div>
            </div>
          </div>

          <div class="section-title">CONTRATADA</div>
          <div class="contracted-info">
            Cirlene Aparecida de Araújo Vieira, Brasileira, Casada, Comerciante, portadora do CPF: 432.488.536-20<br/>
            RG M30.335.37, domiciliada na Rua Vereador Fausto Martimiano,105 - Centro - Muzambinho - MG
          </div>

          <div class="section-title">DESCRIÇÃO DO ALUGUEL</div>
          <table>
            <thead>
              <tr>
                <th style="width:50px;">Cód.</th>
                <th style="width:50px;">Quant.</th>
                <th>Descrição</th>
                <th style="width:70px;">Ajustes</th>
                <th style="width:80px;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${produtosHtml}
              <tr class="total-row">
                <td colspan="4" style="text-align:right; padding-right:8px; font-size:11px;"><strong>TOTAL: R$</strong></td>
                <td style="text-align:center; font-size:11px;"><strong>___________</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="terms">
            <h4>TERMOS E CONDIÇÕES</h4>
            <div class="clause">
              <strong>Cláusula Primeira</strong> - Os aluguéis uma vez firmado pelo(a) Contratante, só poderão ser cancelados mediante indenização referente a 50% (cinquenta por cento) sobre o valor total do aluguel. Não será devolvido o valor pago a título de sinal e não será repassado estes valores para outro aluguel.
            </div>
            <div class="clause">
              <strong>Cláusula Segunda</strong> - A devolução será feita na Segunda feira até às 12:00 horas. Caso não seja respeitado este horário, será cobrada uma indenização equivalente a 50% (cinquenta por cento) sobre o valor do aluguel contratado.
            </div>
            <div class="clause">
              <strong>Cláusula Terceira</strong> - Em caso de manchas de gordura, ou outros sinais de sujeira que dificulte a limpeza, será cobrado uma indenização equivalente a 20% (vinte por cento) sobre o valor do aluguel contratado.
            </div>
            <div class="clause">
              <strong>Cláusula Quarta</strong> - Ficará a cargo do(a) contratante qualquer dano irrecuperável dos trajes e acessórios locados, assumindo a responsabilidade de arcar com o pagamento à vista em uma única parcela o valor total de custo.
            </div>
          </div>

          <div class="signatures">
            <div class="signature-date">
              Muzambinho, <span class="signature-line"></span> de <span class="signature-line"></span> de <span class="signature-line"></span>
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div>CONTRATANTE</div>
                <div class="signature-box-line"></div>
              </div>
              <div class="signature-box">
                <div>CIRLENE AP. ARAÚJO VIEIRA (OU FUNCIONÁRIA)</div>
                <div class="signature-box-line"></div>
              </div>
            </div>

            <div class="witnesses">
              <div style="margin-bottom: 10px;"><strong>Testemunhas:</strong></div>
              <div>1. <span class="witness-line"></span></div>
              <div>2. <span class="witness-line"></span></div>
            </div>

            <div class="return-confirmation">
              <strong>Devolução Confirmada ( )</strong> &nbsp;&nbsp;&nbsp;&nbsp; 
              <strong>Ass.:</strong> <span class="signature-line"></span>
            </div>
          </div>
        </body>
        </html>
      `;
      
      win.document.write(html);
      win.document.close();
      win.focus();
      
      // Aguardar o carregamento e depois imprimir
      setTimeout(() => {
        win.print();
      }, 1000);

      toast({
        title: "Contrato gerado",
        description: "O contrato foi gerado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar o contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

   // Gerar contrato automaticamente quando os dados estiverem prontos
   React.useEffect(() => {
     if (contractRental && contractRentalId) {
       generateContractDocument(contractRental);
       setContractRentalId(null);
     }
   }, [contractRental, contractRentalId, generateContractDocument]);

   const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Carregando aluguéis...</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <RentalForm
        key={`rental-form-${formKey}`}
        rentalId={editingRental}
        onClose={handleCloseForm}
      />
    );
  }

  if (viewingRental) {
    return (
      <RentalDetails
        rentalId={viewingRental}
        onClose={() => setViewingRental(null)}
        onEdit={() => {
          setEditingRental(viewingRental);
          setViewingRental(null);
          setFormKey(prev => prev + 1);
          setShowForm(true);
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <AdminBackButton />
      
      {/* Header Section - Mobile Responsive */}
      <div className="space-y-4">
        <h1 className="text-xl md:text-3xl font-bold">
          {isMobile ? 'Aluguéis' : 'Gestão de Aluguéis'}
        </h1>
        
        {/* Mobile: Stack buttons vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end sm:items-center sm:space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onSectionChange('calendar')}
            className="w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Ver Agenda
          </Button>
          <Button 
            onClick={() => {
              setFormKey(prev => prev + 1);
              setShowForm(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Aluguel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Aluguéis Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          {!rentals || rentals.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum aluguel cadastrado ainda.
            </p>
          ) : (
            <>
              {/* Mobile: Card Layout */}
              <div className="block md:hidden space-y-3">
                {rentals.map((rental) => (
                  <Card key={rental.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-base">{rental.customer_nome}</p>
                            <p className="text-sm text-gray-600">Evento: {formatDate(rental.event_date)}</p>
                          </div>
                          <RentalStatusBadge status={getEffectiveStatus(rental)} />
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Período: {formatDate(rental.rental_start_date)} até {formatDate(rental.rental_end_date)}</p>
                        </div>
                        
                        {/* Mobile Actions - Grid Layout */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateContract(rental.id)}
                            className="text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Contrato
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingRental(rental.id)}
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(rental.id)}
                            className="text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          
                          {!['completed', 'cancelled'].includes(rental.status) ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`text-xs ${getEffectiveStatus(rental) === 'overdue' ? 'bg-red-100 border-red-400' : ''}`}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Devolver
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Devolução</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja confirmar a devolução deste aluguel?
                                    {getEffectiveStatus(rental) === 'overdue' && (
                                      <span className="block mt-2 text-red-600 font-semibold">
                                        ⚠️ Este aluguel está em atraso!
                                      </span>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleConfirmReturn(rental.id)}
                                  >
                                    Confirmar Devolução
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs text-red-600">
                                  <Trash className="w-3 h-3 mr-1" />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este aluguel? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(rental.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Desktop: Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data do Evento</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rentals.map((rental) => (
                      <TableRow key={rental.id}>
                        <TableCell className="font-medium">
                          {rental.customer_nome}
                        </TableCell>
                        <TableCell>{formatDate(rental.event_date)}</TableCell>
                        <TableCell>
                          {formatDate(rental.rental_start_date)} até{' '}
                          {formatDate(rental.rental_end_date)}
                        </TableCell>
                        <TableCell>
                          <RentalStatusBadge status={getEffectiveStatus(rental)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateContract(rental.id)}
                              title="Gerar Contrato"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingRental(rental.id)}
                              title="Ver Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(rental.id)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" title="Excluir">
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir este aluguel? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(rental.id)}
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {!['completed', 'cancelled'].includes(rental.status) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    title="Confirmar Devolução"
                                    className={getEffectiveStatus(rental) === 'overdue' ? 'bg-red-100 border-red-400' : ''}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Devolução</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja confirmar a devolução deste aluguel?
                                      {getEffectiveStatus(rental) === 'overdue' && (
                                        <span className="block mt-2 text-red-600 font-semibold">
                                          ⚠️ Este aluguel está em atraso!
                                        </span>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleConfirmReturn(rental.id)}
                                    >
                                      Confirmar Devolução
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
