-- Corrigir view rental_with_customer para usar nomes de campos consistentes
CREATE OR REPLACE VIEW rental_with_customer AS
SELECT
  r.id,
  r.customer_id,
  r.rental_start_date,
  r.rental_end_date,
  r.event_date,
  r.total_amount,
  r.deposit_amount,
  r.status,
  r.notes,
  r.created_at,
  r.updated_at,
  c.full_name AS customer_nome,
  c.address AS customer_endereco,
  c.phone AS customer_telefone,
  c.document_number AS customer_cpf,
  c.email AS customer_email
FROM rentals r
JOIN customers c ON r.customer_id = c.id; 