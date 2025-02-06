import React from 'react';
import { Plus, Book, Settings } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface DashboardProps {
  onNewNotebook?: () => void;
}

export function Dashboard({ onNewNotebook }: DashboardProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notebooks</h1>
        <Button onClick={onNewNotebook} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Notebook
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empty state card */}
        <Card className="border-2 border-dashed border-muted hover:border-primary/50 cursor-pointer transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-48">
            <Book className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">Create your first notebook</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
