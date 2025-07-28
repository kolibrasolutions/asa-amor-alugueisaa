import { useRental, getEffectiveStatus } from '@/hooks/useRentals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RentalStatusBadge } from './RentalStatusBadge';
import { ArrowLeft, Edit, User, Calendar, Package } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRef } from 'react';

interface RentalDetailsProps {
  rentalId: string;
  onClose: () => void;
  onEdit: () => void;
}

export const RentalDetails = ({ rentalId, onClose, onEdit }: RentalDetailsProps) => {
  const isMobile = useIsMobile();
  const { data: rental, isLoading } = useRental(rentalId);
  const handleGenerateContract = () => {
    if (!rental) return;
    
    // Gerar número do contrato baseado no ID do rental (últimos 4 dígitos)
    const contractNumber = rental.id.slice(-4).toUpperCase();
    
    // Monta HTML do contrato baseado no modelo físico
    const win = window.open('', '_blank');
    if (!win) return;
    
    // Produtos com código, quantidade, descrição, ajustes e valor (campos vazios para preenchimento manual)
    const produtosHtml = rental.rental_items?.map((item, idx) => `
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
          RG M30.335.37, domiciliada na Rua Barão do Rio Branco, Oito 855 - Muzambinho/MG
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
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Carregando detalhes do aluguel...</p>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="p-6">
        <p>Aluguel não encontrado.</p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      {/* Header responsivo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
        
        <div className="space-y-3">
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>
            Detalhes do Aluguel
          </h1>
          <Button 
            variant="default" 
            onClick={handleGenerateContract}
            className={`${isMobile ? 'w-full' : 'w-auto'}`}
          >
            Gerar Contrato
          </Button>
        </div>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-4 md:gap-6`}>
        <Card>
          <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
            <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
              <User className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6'} space-y-3`}>
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{rental.customer_nome}</p>
            </div>
            {rental.customer_telefone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className={`${isMobile ? 'text-sm' : 'text-base'}`}>{rental.customer_telefone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
            <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
              <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
              Informações do Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6'} space-y-3`}>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <RentalStatusBadge status={getEffectiveStatus(rental)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Data do Evento</label>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>{formatDate(rental.event_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Período de Aluguel</label>
              <p className={`${isMobile ? 'text-sm' : 'text-base'}`}>
                {formatDate(rental.rental_start_date)} até {formatDate(rental.rental_end_date)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
          <CardTitle className={`flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <Package className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
            Produtos do Aluguel
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6'}`}>
          {rental.rental_items.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Nenhum produto adicionado a este aluguel.
            </p>
          ) : isMobile ? (
            /* Mobile: Layout em cards */
            <div className="space-y-3">
              {rental.rental_items.map((item) => (
                <Card key={item.id} className="border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        {(item.product.brand || item.product.size || item.product.color) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {[item.product.brand, item.product.size, item.product.color]
                              .filter(Boolean)
                              .join(' - ')}
                          </p>
                        )}
                      </div>
                      <div className="ml-3 text-right">
                        <p className="text-sm font-medium">Qtd: {item.quantity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop: Layout em tabela */
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rental.rental_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        {(item.product.brand || item.product.size || item.product.color) && (
                          <p className="text-sm text-gray-500">
                            {[item.product.brand, item.product.size, item.product.color]
                              .filter(Boolean)
                              .join(' - ')}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {rental.notes && (
        <Card>
          <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>Observações</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-4 pt-0' : 'p-6'}`}>
            <p className={`whitespace-pre-wrap ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed`}>
              {rental.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
