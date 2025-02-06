import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';

interface Resource {
  id: string;
  name: string;
  type: string;
}

interface NotebookCreatorProps {
  onSave?: (resources: Resource[]) => void;
}

export function NotebookCreator({ onSave }: NotebookCreatorProps) {
  const [resources, setResources] = React.useState<Resource[]>([]);

  const addResource = () => {
    const newResource = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      type: ''
    };
    setResources([...resources, newResource]);
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id: string, field: keyof Resource, value: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Notebook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Define Resources</h3>
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="flex gap-4 items-start">
                    <Input
                      placeholder="Resource name"
                      value={resource.name}
                      onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Resource type"
                      value={resource.type}
                      onChange={(e) => updateResource(resource.id, 'type', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResource(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addResource}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => onSave?.(resources)}
              disabled={resources.length === 0}
            >
              Create Notebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
