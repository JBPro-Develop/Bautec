import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPenById } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Droplets, HeartPulse, Archive, ArrowLeft, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function PenDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pen = await getPenById(params.id);

  if (!pen) {
    notFound();
  }

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

      <Tabs defaultValue="feeding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
