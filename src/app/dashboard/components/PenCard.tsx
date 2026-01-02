import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Droplets, HeartPulse, Archive, Weight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Pen } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

type PenCardProps = {
  pen: Pen & { recipeName: string, lastFed: string, averageWeight: number };
};

export default async function PenCard({ pen }: PenCardProps) {
  const lastFedDisplay = pen.lastFed === 'N/A' ? 'N/A' : formatDate(pen.lastFed);

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex-row items-start gap-4 p-4">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-lg">{pen.name}</CardTitle>
          <CardDescription>{pen.headCount} heads</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/pens/${pen.id}/feeding`}>
                <Droplets className="mr-2 h-4 w-4" /> Daily Feeding
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/pens/${pen.id}/health`}>
                <HeartPulse className="mr-2 h-4 w-4" /> Health/Treatments
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/pens/${pen.id}/close`}>
                <Archive className="mr-2 h-4 w-4" /> Close Group
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <div className="relative aspect-[3/2]">
        <Image
          src={pen.photoUrl}
          alt={`Image of ${pen.name}`}
          fill
          className="object-cover"
          data-ai-hint={pen.photoHint}
        />
      </div>
      <CardContent className="p-4 flex-1 space-y-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Recipe:</span>
          <span className="font-medium text-foreground">{pen.recipeName}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                <span>Avg. Weight:</span>
            </div>
          <span className="font-medium text-foreground">{pen.averageWeight.toLocaleString()} lbs</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/50 flex justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Last Fed</span>
          <span className="font-semibold">{lastFedDisplay}</span>
        </div>
        <Badge variant={pen.status === 'Active' ? 'default' : 'destructive'} className={pen.status === 'Active' ? 'bg-green-600' : ''}>
          {pen.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
