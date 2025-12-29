import { getCows, getPenById } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import CowList from './components/CowList';

export default async function HealthPage() {
  const allCows = await getCows();

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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Health &amp; Treatments</CardTitle>
            <CardDescription>
              Select a cow to view its history or add a new treatment record.
            </CardDescription>
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
                  <Label htmlFor="cowTag">Cow Tag</Label>
                  <Input id="cowTag" name="cowTag" placeholder="e.g., A101" required />
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
          <CowList cows={cowsWithPenNames} />
        </CardContent>
      </Card>
    </div>
  );
}
