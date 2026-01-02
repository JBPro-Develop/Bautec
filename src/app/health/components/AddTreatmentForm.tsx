'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createHealthRecord } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Cow, Pen } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Treatment</>}
    </Button>
  );
}

type AddTreatmentFormProps = {
    cow: Cow & { penName: string };
    pens: Pen[];
    onTreatmentAdded: () => void;
}

export default function AddTreatmentForm({ cow, pens, onTreatmentAdded }: AddTreatmentFormProps) {
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createHealthRecord, initialState);
  const [treatmentDate, setTreatmentDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({ title: "Success!", description: state.message });
      formRef.current?.reset();
      setTreatmentDate(new Date());
      onTreatmentAdded(); // Callback to refresh the list
    } else if (state?.message && state.errors) {
      const errorMessages = Object.values(state.errors).flat().join(' ');
      toast({ variant: 'destructive', title: "Error", description: errorMessages || state.message });
    }
  }, [state, toast, onTreatmentAdded]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-lg border bg-card p-4">
      {/* Hidden inputs for cow and pen IDs */}
      <input type="hidden" name="cowTag" value={cow.id} />
      <input type="hidden" name="penId" value={cow.penId || ''} />

      <div className="space-y-2">
        <Label htmlFor="drugName">Drug Name</Label>
        <Input id="drugName" name="drugName" placeholder="e.g., Ivermectin" required />
        {state.errors?.drugName && <p className="text-sm text-destructive">{state.errors.drugName[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" name="dosage" placeholder="e.g., 10ml" />
            {state.errors?.dosage && <p className="text-sm text-destructive">{state.errors.dosage[0]}</p>}
        </div>
         <div className="space-y-2">
          <Label>Treatment Date</Label>
          <Input type="hidden" name="treatmentDate" value={treatmentDate?.toISOString()} />
           <Popover>
              <PopoverTrigger asChild>
              <Button
                  variant={'outline'}
                  className={cn('w-full justify-start text-left font-normal', !treatmentDate && 'text-muted-foreground')}
              >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {treatmentDate ? formatDate(treatmentDate) : <span>Select treatment date</span>}
              </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
              <Calendar 
                mode="single" 
                selected={treatmentDate} 
                onSelect={setTreatmentDate} 
                toDate={new Date()}
              />
              </PopoverContent>
          </Popover>
          {state.errors?.treatmentDate && <p className="text-sm text-destructive">{state.errors.treatmentDate[0]}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reminderDays">Set Reminder</Label>
         <Select name="reminderDays">
            <SelectTrigger>
              <SelectValue placeholder="No reminder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">No reminder</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="75">75 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.reminderDays && <p className="text-sm text-destructive">{state.errors.reminderDays[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
