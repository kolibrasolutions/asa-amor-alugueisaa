import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';

export const PWASettingsTest = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            PWA Test Component
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Este é um componente de teste para verificar se a aba PWA aparece em produção.</p>
          <p>Environment: {import.meta.env.DEV ? 'Development' : 'Production'}</p>
          <p>Mode: {import.meta.env.MODE}</p>
          <p>Base URL: {import.meta.env.BASE_URL}</p>
        </CardContent>
      </Card>
    </div>
  );
};