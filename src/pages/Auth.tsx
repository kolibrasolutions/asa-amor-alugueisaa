
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Auth page - Current user:', user);
    if (user) {
      console.log('User is logged in, redirecting to admin');
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Attempting login with email:', email);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro de autenticação",
          description: error.message || "Email ou senha incorretos.",
          variant: "destructive",
        });
      } else {
        console.log('Login successful');
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o painel administrativo...",
        });
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado durante o login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-asa-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif text-asa-dark">
            Acesso Administrativo
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Área restrita para administradores
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-asa-blush hover:bg-asa-blush/90 text-asa-dark"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:underline"
              disabled={loading}
            >
              Voltar ao site
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
