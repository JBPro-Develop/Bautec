'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getPenById } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Droplets, HeartPulse, ArrowLeft, Beef, Settings, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Pen } from '@/lib/types';


export default function PenDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params.id as string;
  const [pen, setPen] = useState<Pen | null | undefined>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (id) {
      getPenById(id).then(setPen);
    }
  }, [id]);

  if (pen === null) {
    // Loading state
    return <div>Loading pen details...</div>;
  }
  
  if (pen === undefined) {
    notFound();
  }

  const pathSegments = pathname.split('/');
  const currentTab = pathSegments[3] || 'cows';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">{pen.name}</h1>
            <Badge variant={pen.status === 'Active' ? 'default' : 'destructive'} className={pen.status === 'Active' ? 'bg-green-600' : ''}>
              {pen.status}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground mt-1">{pen.headCount} heads</p>
      </div>

      <Tabs value={currentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cows" asChild>
            <Link href={`/pens/${pen.id}/cows`}>
              <Beef className="mr-2 h-4 w-4" /> Cows
            </Link>
          </TabsTrigger>
          <TabsTrigger value="feeding" asChild>
            <Link href={`/pens/${pen.id}/feeding`}>
              <Droplets className="mr-2 h-4 w-4" /> Feeding
            </Link>
          </TabsTrigger>
          <TabsTrigger value="health" asChild>
            <Link href={`/pens/${pen.id}/health`}>
              <HeartPulse className="mr-2 h-4 w-4" /> Health
            </Link>
          </TabsTrigger>
           <TabsTrigger value="settings" asChild>
            <Link href={`/pens/${pen.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </TabsTrigger>
          <TabsTrigger value="close" asChild>
            <Link href={`/pens/${pen.id}/close`}>
              <Archive className="mr-2 h-4 w-4" /> Close
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div>{children}</div>
    </div>
  );
}
