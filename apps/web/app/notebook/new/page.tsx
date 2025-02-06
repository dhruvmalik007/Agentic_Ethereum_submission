"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { NotebookCreator } from '@repo/ui';

interface Resource {
  id: string;
  name: string;
  type: string;
}

export default function NewNotebookPage() {
  const router = useRouter();

  const handleSave = (resources: Resource[]) => {
    // Here you would typically save the resources to your backend
    console.log('Saving resources:', resources);
    
    // For now, we'll just redirect to a new notebook page
    // In a real app, you'd create the notebook first and get its ID
    const dummyNotebookId = 'demo-' + Math.random().toString(36).substr(2, 9);
    router.push(`/notebook/${dummyNotebookId}`);
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <NotebookCreator onSave={handleSave} />
    </main>
  );
}
