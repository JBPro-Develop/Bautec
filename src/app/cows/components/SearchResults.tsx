'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Cow } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { differenceInMonths, differenceInYears } from 'date-fns';

type SearchResultsProps = {
    cows: (Cow & { penName: string })[];
    query: string;
}

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


export default function SearchResults({ cows, query }: SearchResultsProps) {
    if (!query) {
        return <p className="text-center text-muted-foreground pt-8">Enter an animal's tag ID to see its information.</p>
    }

    if (cows.length === 0) {
        return <p className="text-center text-muted-foreground pt-8">No animals found matching "{query}".</p>
    }
    
    return (
        <div className="mt-8">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tag ID</TableHead>
                        <TableHead>Pen</TableHead>
                        <TableHead>Weight (lbs)</TableHead>
                        <TableHead>Age</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cows.map(cow => (
                        <TableRow key={cow.id}>
                            <TableCell className="font-medium">{cow.id}</TableCell>
                            <TableCell>
                                {cow.penId ? <Badge variant="outline">{cow.penName}</Badge> : 'Unassigned'}
                            </TableCell>
                            <TableCell>{cow.weight}</TableCell>
                            <TableCell>{getAge(cow.birthDate)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
