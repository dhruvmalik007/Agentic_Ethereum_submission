"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@repo/ui';

export default function DashboardPage() {
  const router = useRouter();

  const handleNewNotebook = () => {
    router.push('/notebook/new');
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <Dashboard onNewNotebook={handleNewNotebook} />
    </main>
  );
}
