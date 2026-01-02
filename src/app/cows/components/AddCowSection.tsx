'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createCow } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Pen } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : <><PlusCircle/> Add Cow</>}
    </Button>
  );
}

export default function AddCowSection({ pens }: { pens: Pen[] }) {
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCow, initialState);
  const [birthDate, setBirthDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({ title: "Success!", description: state.message });
      setBirthDate(undefined);
      // Ideally reset the whole form here
    } else if (state?.message && state.errors) {
      toast({ variant: 'destructive', title: "Error", description: state.message });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tagId">Tag ID</Label>
        <Input id="tagId" name="tagId" placeholder="A151" required />
        {state.errors?.tagId && <p className="text-sm text-destructive">{state.errors.tagId[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input id="weight" name="weight" type="number" placeholder="450" required />
          {state.errors?.weight && <p className="text-sm text-destructive">{state.errors.weight[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label>Birth Date</Label>
             <Input type="hidden" name="birthDate" value={birthDate?.toISOString() || ''} />
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !birthDate && 'text-muted-foreground')}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? formatDate(birthDate) : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={birthDate} 
                  onSelect={setBirthDate} 
                  toDate={new Date()}
                />
                </PopoverContent>
            </Popover>
            {state.errors?.birthDate && <p className="text-sm text-destructive">{state.errors.birthDate[0]}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="penId">Assign to Pen</Label>
        <Select name="penId">
          <SelectTrigger>
            <SelectValue placeholder="Select a pen (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">Unassigned</SelectItem>
            {pens.filter(p => p.status === 'Active').map(pen => (
              <SelectItem key={pen.id} value={pen.id}>{pen.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.penId && <p className="text-sm text-destructive">{state.errors.penId[0]}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="photo">Upload Photo</Label>
        <Input id="photo" name="photo" type="file" />
        <p className="text-xs text-muted-foreground">This is for display only and won't be uploaded.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
