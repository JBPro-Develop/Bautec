'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Cow, HealthRecord, Pen } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getHealthRecordsForCow } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import AddTreatmentForm from './AddTreatmentForm';
import { PlusCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


type CowListProps = {
    cows: (Cow & { penName: string })[];
    pens: Pen[];
}

export default function CowList({ cows, pens }: CowListProps) {
  const [selectedCow, setSelectedCow] = useState<(Cow & { penName: string }) | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleSelect = async (cow: Cow & { penName: string }) => {
    setSelectedCow(cow);
    const records = await getHealthRecordsForCow(cow.id);
    setHealthRecords(records);
    setIsDialogOpen(true);
    setIsAddFormOpen(false); // Close form when opening dialog
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Delay clearing data to avoid visual flicker during closing animation
    setTimeout(() => {
        setSelectedCow(null);
        setHealthRecords([]);
    }, 300);
  }

  // Function to refresh records after adding a new one
  const refreshHealthRecords = async (cowId: string) => {
    const records = await getHealthRecordsForCow(cowId);
    setHealthRecords(records);
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
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Health Records for {selectedCow.id}</DialogTitle>
                    <DialogDescription asChild>
                      <div className="text-sm text-muted-foreground pt-1">
                        Currently in <Badge variant="outline">{selectedCow.penName}</Badge>. A complete history of all health events.
                      </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
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
                 <Separator />
                 <Collapsible open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                    <CollapsibleTrigger asChild>
                         <Button variant="ghost" className="w-full justify-start gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add New Treatment Record
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="pt-4">
                            <AddTreatmentForm 
                                cow={selectedCow} 
                                pens={pens} 
                                onTreatmentAdded={() => {
                                    refreshHealthRecords(selectedCow.id);
                                    setIsAddFormOpen(false); // Close form after submission
                                }} 
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
