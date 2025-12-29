'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Cow } from '@/lib/types';
import { cn } from '@/lib/utils';

type CowListProps = {
    cows: (Cow & { penName: string })[];
    selectedCowId?: string | null;
}

export default function CowList({ cows, selectedCowId }: CowListProps) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (cowId: string) => {
    const params = new URLSearchParams();
    params.set('cowId', cowId);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border rounded-md">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tag ID</TableHead>
                    <TableHead>Pen</TableHead>
                    <TableHead>Weight (lbs)</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cows.map((cow) => (
                <TableRow key={cow.id} className={cn(cow.id === selectedCowId && 'bg-muted/50')}>
                    <TableCell className="font-medium">{cow.id}</TableCell>
                    <TableCell>
                        {cow.penId ? <Badge variant="outline">{cow.penName}</Badge> : 'Unassigned'}
                    </TableCell>
                    <TableCell>{cow.weight}</TableCell>
                    <TableCell className="text-right">
                        <Button 
                            variant={cow.id === selectedCowId ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSelect(cow.id)}
                        >
                            View Records
                        </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
