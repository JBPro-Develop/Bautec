import { getCows, getHealthRecordsForCow, getPenById } from '@/lib/data';
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
import CowList from './components/CowList';

export default async function HealthPage({
  searchParams,
}: {
  searchParams?: {
    cowId?: string;
  };
}) {
  const allCows = await getCows();
  const selectedCowId = searchParams?.cowId;
  const healthRecords = selectedCowId
    ? await getHealthRecordsForCow(selectedCowId)
    : [];
  
  const selectedCow = selectedCowId ? allCows.find(c => c.id === selectedCowId) : null;
  const pen = selectedCow?.penId ? await getPenById(selectedCow.penId) : null;

  const cowsWithPenNames = await Promise.all(
    allCows.map(async (cow) => {
      if (!cow.penId) return { ...cow, penName: 'Unassigned' };
      const pen = await getPenById(cow.penId);
      return { ...cow, penName: pen?.name || 'Unknown Pen' };
    })
  );


  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
            <CardTitle>Health & Treatments</CardTitle>
            <CardDescription>Select a cow to view its health and treatment history.</CardDescription>
        </CardHeader>
        <CardContent>
            <CowList cows={cowsWithPenNames} selectedCowId={selectedCowId} />
        </CardContent>
       </Card>

      {selectedCow && (
        <Card>
          <CardHeader>
            <CardTitle>Showing Records for {selectedCow.id}</CardTitle>
            <CardDescription>
                Currently in <Badge variant="outline">{pen?.name || 'Unassigned'}</Badge>. A complete history of all health events.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead className="text-right">Reminder</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {healthRecords.map(record => (
                    <TableRow key={record.id}>
                        <TableCell className="font-medium">{formatDate(record.treatmentDate)}</TableCell>
                        <TableCell>{record.drugName}</TableCell>
                        <TableCell>{record.dosage || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                        {record.reminderDays ? <Badge variant="outline">{record.reminderDays} days</Badge> : 'None'}
                        </TableCell>
                    </TableRow>
                    ))}
                    {healthRecords.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">No health records found for this cow.</TableCell>
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
