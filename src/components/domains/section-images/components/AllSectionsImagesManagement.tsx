import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionImagesManagement } from './SectionImagesManagement';
import { SECTION_CONFIGS } from '../types';

export const AllSectionsImagesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('client_gallery');

  const sectionEntries = Object.entries(SECTION_CONFIGS);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Imagens por Seção</h3>
        <p className="text-sm text-gray-600">
          Gerencie as imagens de cada seção do site com proporções específicas
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {sectionEntries.map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="text-sm">
              {config.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {sectionEntries.map(([key, config]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <SectionImagesManagement sectionId={key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}; 