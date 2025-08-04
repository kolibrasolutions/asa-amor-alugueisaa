import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingSync: boolean;
  syncError: string | null;
}

interface UseDataSyncReturn extends SyncStatus {
  performSync: () => Promise<void>;
  markPendingSync: () => void;
  clearSyncError: () => void;
}

export const useDataSync = (): UseDataSyncReturn => {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingSync, setPendingSync] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Queries que devem ser invalidadas durante a sincronização
  const SYNC_QUERIES = [
    'rentals',
    'products', 
    'categories',
    'customers',
    'dashboard',
    'notifications',
    'banners',
    'hero-images'
  ];

  const performSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    setSyncError(null);
    
    try {
      // Invalida todas as queries principais para forçar refetch
      await Promise.all(
        SYNC_QUERIES.map(queryKey => 
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        )
      );
      
      // Aguarda um pouco para as queries serem recarregadas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSyncTime(new Date());
      setPendingSync(false);
      
      console.log('✅ Sincronização concluída com sucesso');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      setSyncError('Falha na sincronização. Tentando novamente...');
      setPendingSync(true);
      
      // Retry automático após 5 segundos
      setTimeout(() => {
        if (navigator.onLine) {
          performSync();
        }
      }, 5000);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, queryClient]);

  const markPendingSync = useCallback(() => {
    setPendingSync(true);
  }, []);

  const clearSyncError = useCallback(() => {
    setSyncError(null);
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      
      // Auto-sync quando reconecta se há dados pendentes ou última sync foi há mais de 30s
      if (pendingSync || lastSyncTime === null || Date.now() - lastSyncTime.getTime() > 30000) {
        // Aguarda um pouco para garantir que a conexão está estável
        setTimeout(() => {
          performSync();
        }, 1000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      markPendingSync();
    };

    // Sync periódico quando online (a cada 5 minutos)
    const syncInterval = setInterval(() => {
      if (isOnline && !isSyncing) {
        performSync();
      }
    }, 5 * 60 * 1000); // 5 minutos

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync inicial se online
    if (isOnline && lastSyncTime === null) {
      setTimeout(() => performSync(), 2000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [isOnline, isSyncing, pendingSync, lastSyncTime, performSync, markPendingSync]);

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    pendingSync,
    syncError,
    performSync,
    markPendingSync,
    clearSyncError
  };
};