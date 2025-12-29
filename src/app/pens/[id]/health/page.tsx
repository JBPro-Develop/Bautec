import { getPenById, getHealthRecordsForPen } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default async function HealthPage({ params }: { params: { id: string } }) {
  const pen = await getPenById(params.id);
  if (!pen) notFound();

  const healthRecords = await getHealthRecordsForPen(pen.id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Health &amp; Treatments</CardTitle>
          <CardDescription>View and manage health records for {pen.name}.</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Treatment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Treatment Record</DialogTitle>
              <DialogDescription>Fill in the details for the new health treatment.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cowTag">Cow Tag (Optional)</Label>
                <Input id="cowTag" name="cowTag" placeholder="e.g., A101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drugName">Drug Name</Label>
                <Input id="drugName" name="drugName" placeholder="e.g., Ivermectin" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="treatmentDate">Treatment Date</Label>
                <Input id="treatmentDate" name="treatmentDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" name="dosage" placeholder="e.g., 10ml" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminder">Set Reminder</Label>
                 <Select name="reminder">
                    <SelectTrigger>
                      <SelectValue placeholder="No reminder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="75">75 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <Button type="submit" className="w-full">Save Treatment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Cow Tag</TableHead>
              <TableHead>Drug Name</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead className="text-right">Reminder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {healthRecords.map(record => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{formatDate(record.treatmentDate)}</TableCell>
                <TableCell>{record.cowTag || 'N/A'}</TableCell>
                <TableCell>{record.drugName}</TableCell>
                <TableCell>{record.dosage || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  {record.reminderDays ? <Badge variant="outline">{record.reminderDays} days</Badge> : 'None'}
                </TableCell>
              </TableRow>
            ))}
            {healthRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No health records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
