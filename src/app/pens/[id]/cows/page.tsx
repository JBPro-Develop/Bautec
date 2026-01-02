import { getPenById, getCowsByPenId, getPens } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { differenceInMonths, differenceInYears } from 'date-fns';
import Image from 'next/image';
import PenCowsSearchSection from './components/PenCowsSearchSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RefreshCw, ArrowRightLeft, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from '@/components/ui/dropdown-menu';


function getAge(birthDate: string): string {
    const now = new Date();
    const dob = new Date(birthDate);
    const years = differenceInYears(now, dob);
    const months = differenceInMonths(now, dob) % 12;

    if (years > 0) {
        return `${years} ${years > 1 ? 'yrs' : 'yr'}, ${months} ${months > 1 ? 'mos' : 'mo'}`;
    }
    return `${months} ${months > 1 ? 'mos' : 'mo'}`;
}

export default async function PenCowsPage({ 
    params,
    searchParams
}: { 
    params: { id: string },
    searchParams?: { query?: string }
}) {
  const pen = await getPenById(params.id);
  if (!pen) notFound();

  const allPens = await getPens();
  const otherPens = allPens.filter(p => p.id !== pen.id && p.status === 'Active');

  const query = searchParams?.query || '';
  const allCows = await getCowsByPenId(pen.id);
  
  const filteredCows = query 
    ? allCows.filter(cow => cow.id.toLowerCase().includes(query.toLowerCase()))
    : allCows;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Cows in {pen.name}</CardTitle>
            <CardDescription>A list of all animals currently assigned to this pen.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <PenCowsSearchSection />
            <Button variant="outline" size="icon" asChild>
                <Link href={`/pens/${params.id}/cows`}>
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Refresh</span>
                </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Photo</TableHead>
              <TableHead>Tag ID</TableHead>
              <TableHead>Weight (lbs)</TableHead>
              <TableHead>Age</TableHead>
              <TableHead className="text-right w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCows.map(cow => (
              <TableRow key={cow.id}>
                <TableCell>
                  {cow.photoUrl && (
                    <Image 
                        src={cow.photoUrl} 
                        alt={`Photo of ${cow.id}`} 
                        width={64} 
                        height={64} 
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint={cow.photoHint}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{cow.id}</TableCell>
                <TableCell>{cow.weight}</TableCell>
                <TableCell>{getAge(cow.birthDate)}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                             <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <ArrowRightLeft className="mr-2 h-4 w-4"/>
                                    <span>Transfer</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        {otherPens.map(p => (
                                            <DropdownMenuItem key={p.id}>{p.name}</DropdownMenuItem>
                                        ))}
                                        {otherPens.length === 0 && <DropdownMenuItem disabled>No other active pens</DropdownMenuItem>}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>
                                <span>Remove from Pen</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredCows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                    {query ? `No cows found for "${query}".` : 'No cows found in this pen.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
