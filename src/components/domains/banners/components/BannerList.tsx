import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { BannerListProps, Banner } from '../types';

export const BannerList = ({ banners, onEdit, onDelete, onReorder }: BannerListProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="banners">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {banners.map((banner, index) => (
              <Draggable key={banner.id} draggableId={banner.id} index={index}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="bg-white"
                  >
                    <CardContent className="flex items-center p-4">
                      <div {...provided.dragHandleProps} className="mr-4">
                        <GripVertical className="text-gray-400" />
                      </div>
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-32 h-16 object-cover rounded mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{banner.title}</h3>
                        <p className="text-sm text-gray-500">{banner.subtitle}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(banner)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(banner.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}; 