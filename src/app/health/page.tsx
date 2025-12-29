
import { getCows, getHealthRecordsForCow } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import CowSelector from './components/CowSelector';

export default async function HealthPage({
  searchParams,
}: {
  searchParams?: {
    cowId?: string;
  };
}) {
  const cows = await getCows();
  const selectedCowId = searchParams?.cowId;
  const healthRecords = selectedCowId
    ? await getHealthRecordsForCow(selectedCowId)
    : [];
  
  const selectedCow = selectedCowId ? cows.find(c => c.id === selectedCowId) : null;

  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
            <CardTitle>Health & Treatments</CardTitle>
            <CardDescription>Select a cow to view its health and treatment history.</CardDescription>
        </CardHeader>
        <CardContent>
            <CowSelector cows={cows} />
        </CardContent>
       </Card>

      {selectedCowId && (
        <Card>
          <CardHeader>
            <CardTitle>Showing Records for {selectedCow?.id}</CardTitle>
            <CardDescription>A complete history of all health events and treatments for this animal.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pen</TableHead>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead className="text-right">Reminder</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {healthRecords.map(record => (
                    <TableRow key={record.id}>
                        <TableCell className="font-medium">{formatDate(record.treatmentDate)}</TableCell>
                        <TableCell>{record.penId}</TableCell>
                        <TableCell>{record.drugName}</TableCell>
                        <TableCell>{record.dosage || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                        {record.reminderDays ? <Badge variant="outline">{record.reminderDays} days</Badge> : 'None'}
                        </TableCell>
                    </TableRow>
                    ))}
                    {healthRecords.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">No health records found for this cow.</TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
