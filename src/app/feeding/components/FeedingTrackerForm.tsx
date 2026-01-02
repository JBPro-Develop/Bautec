'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { trackFeeding } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, Wheat } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Pen, Recipe } from '@/lib/types';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : <><Wheat className="mr-2 h-4 w-4" /> Record Feeding</>}
    </Button>
  );
}

export default function FeedingTrackerForm({ pens, recipes }: { pens: Pen[], recipes: Recipe[] }) {
  const initialState = { message: null };
  const [state, formAction] = useActionState(trackFeeding, initialState);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({ title: "Success!", description: state.message });
      // Reset form if needed
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="penId">Select Pen</Label>
            <Select name="penId" required>
            <SelectTrigger>
                <SelectValue placeholder="Choose a pen" />
            </SelectTrigger>
            <SelectContent>
                {pens.filter(p => p.status === 'Active').map(pen => (
                <SelectItem key={pen.id} value={pen.id}>{pen.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="recipeId">Select Recipe</Label>
            <Select name="recipeId" required>
            <SelectTrigger>
                <SelectValue placeholder="Choose a recipe" />
            </SelectTrigger>
            <SelectContent>
                {recipes.map(recipe => (
                <SelectItem key={recipe.id} value={recipe.id}>{recipe.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="weight">Total Weight (lbs)</Label>
            <Input id="weight" name="weight" type="number" placeholder="500" required />
        </div>
        <div className="space-y-2">
            <Label>Feeding Date</Label>
            <Input type="hidden" name="date" value={date?.toISOString()} />
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : <span>Select feeding date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate} 
                  toDate={new Date()}
                />
                </PopoverContent>
            </Popover>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
