
-- Primeiro, vamos remover a política problemática que está causando recursão infinita
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Criar uma função SECURITY DEFINER para verificar o role do usuário de forma segura
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recriar a política usando a função segura para evitar recursão
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.get_current_user_role() = 'admin');

-- Política para usuários verem seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
