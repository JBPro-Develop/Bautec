'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { FeedingRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type FeedingHistoryListProps = {
    records: (FeedingRecord & { penName: string, recipeName: string })[];
}

export default function FeedingHistoryList({ records }: FeedingHistoryListProps) {
    if (records.length === 0) {
        return <p className="text-center text-muted-foreground pt-8">No feeding records found.</p>
    }
    
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Pen</TableHead>
                        <TableHead>Recipe</TableHead>
                        <TableHead className="text-right">Total Weight (lbs)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map(record => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{record.penName}</Badge>
                            </TableCell>
                            <TableCell>{record.recipeName}</TableCell>
                            <TableCell className="text-right">{record.weight.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
