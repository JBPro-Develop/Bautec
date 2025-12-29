'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Cow, HealthRecord } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getHealthRecordsForCow } from '@/lib/data';
import { formatDate } from '@/lib/utils';

type CowListProps = {
    cows: (Cow & { penName: string })[];
}

export default function CowList({ cows }: CowListProps) {
  const [selectedCow, setSelectedCow] = useState<(Cow & { penName: string }) | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelect = async (cow: Cow & { penName: string }) => {
    setSelectedCow(cow);
    const records = await getHealthRecordsForCow(cow.id);
    setHealthRecords(records);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Delay clearing data to avoid visual flicker during closing animation
    setTimeout(() => {
        setSelectedCow(null);
        setHealthRecords([]);
    }, 300);
  }

  return (
    <>
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
                  <TableRow key={cow.id}>
                      <TableCell className="font-medium">{cow.id}</TableCell>
                      <TableCell>
                          {cow.penId ? <Badge variant="outline">{cow.penName}</Badge> : 'Unassigned'}
                      </TableCell>
                      <TableCell>{cow.weight}</TableCell>
                      <TableCell className="text-right">
                          <Button 
                              variant='outline'
                              size="sm"
                              onClick={() => handleSelect(cow)}
                          >
                              View Records
                          </Button>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
          </Table>
      </div>
      
      {selectedCow && (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Health Records for {selectedCow.id}</DialogTitle>
                    <DialogDescription>
                        Currently in <Badge variant="outline">{selectedCow.penName}</Badge>. A complete history of all health events.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
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
                            {healthRecords.length > 0 ? (
                                healthRecords.map(record => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{formatDate(record.treatmentDate)}</TableCell>
                                    <TableCell>{record.drugName}</TableCell>
                                    <TableCell>{record.dosage || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                    {record.reminderDays ? <Badge variant="outline">{record.reminderDays} days</Badge> : 'None'}
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No health records found for this cow.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
