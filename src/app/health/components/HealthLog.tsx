'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { HealthRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type HealthLogProps = {
    records: (HealthRecord & { penName: string })[];
}

export default function HealthLog({ records }: HealthLogProps) {
    if (records.length === 0) {
        return <p className="text-center text-muted-foreground pt-8">No health records found.</p>
    }
    
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Cow Tag</TableHead>
                        <TableHead>Pen</TableHead>
                        <TableHead>Drug Name</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead className="text-right">Reminder</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map(record => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{formatDate(record.treatmentDate)}</TableCell>
                            <TableCell>{record.cowTag || 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{record.penName}</Badge>
                            </TableCell>
                            <TableCell>{record.drugName}</TableCell>
                            <TableCell>{record.dosage || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                                {record.reminderDays ? <Badge variant="secondary">{record.reminderDays} days</Badge> : 'None'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
