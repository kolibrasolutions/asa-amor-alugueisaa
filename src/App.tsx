import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Catalog from "./pages/Catalog";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

const queryClient = new QueryClient();

function App() {
  const isDevelopment = import.meta.env.DEV;
  const isAdminPath = isDevelopment ? '/admin-local' : '/admin';
  const isAdminSubdomain = window.location.hostname.startsWith('admin.') || 
    (isDevelopment && window.location.pathname.startsWith('/admin-local'));

  // Função para ajustar o caminho administrativo baseado no ambiente
  const getAdminPath = (path: string) => {
    return isDevelopment ? path.replace('/admin/', '/admin-local/') : path;
  };

  if (isDevelopment && window.location.pathname.startsWith('/admin/')) {
    return <Navigate to={getAdminPath(window.location.pathname)} replace />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {isAdminSubdomain ? (
              <>
                <Route path="/" element={<Auth />} />
                <Route path={`${isAdminPath}/*`} element={<Admin />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
