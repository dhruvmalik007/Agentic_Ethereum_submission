"use client";

import React, { useEffect, useState } from 'react';
import { NotebookInterface } from '@repo/ui';

interface NotebookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NotebookPage({ params }: NotebookPageProps) {
  const [notebookId, setNotebookId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setNotebookId(resolvedParams.id);
    });
  }, [params]);

  const handleQuerySubmit = (query: string) => {
    // Here you would typically send the query to your backend
    console.log('Submitting query for notebook', notebookId, ':', query);
  };

  if (!notebookId) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Notebook</h1>
          <p className="text-muted-foreground">ID: {notebookId}</p>
        </div>
        <NotebookInterface onQuerySubmit={handleQuerySubmit} />
      </div>
    </main>
  );
}
