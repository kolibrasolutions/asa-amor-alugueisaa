
-- Atualizar o role do usuário existente para admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'kolibrasolutions@gmail.com'
);
