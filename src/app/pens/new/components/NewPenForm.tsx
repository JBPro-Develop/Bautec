'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPen } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import type { Recipe } from '@/lib/types';

type NewPenFormProps = {
  recipes: Recipe[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : 'Create Pen'}
    </Button>
  );
}

export default function NewPenForm({ recipes }: NewPenFormProps) {
  const initialState = { errors: {} };
  const [state, dispatch] = useActionState(createPen, initialState);

  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [shipDate, setShipDate] = useState<Date>();

  return (
    <form action={dispatch} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Pen Name / ID</Label>
          <Input id="name" name="name" placeholder="e.g., Pen A" required />
          {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="headCount">Number of Head</Label>
          <Input id="headCount" name="headCount" type="number" placeholder="50" required />
          {state.errors?.headCount && <p className="text-sm text-destructive">{state.errors.headCount[0]}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Input type="hidden" name="arrivalDate" value={arrivalDate?.toISOString()} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-full justify-start text-left font-normal', !arrivalDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {arrivalDate ? formatDate(arrivalDate) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={arrivalDate} onSelect={setArrivalDate} initialFocus />
            </PopoverContent>
          </Popover>
          {state.errors?.arrivalDate && <p className="text-sm text-destructive">{state.errors.arrivalDate[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label>Expected Ship Date</Label>
            <Input type="hidden" name="expectedShipDate" value={shipDate?.toISOString()} />
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !shipDate && 'text-muted-foreground')}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shipDate ? formatDate(shipDate) : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={shipDate} onSelect={setShipDate} initialFocus />
                </PopoverContent>
            </Popover>
            {state.errors?.expectedShipDate && <p className="text-sm text-destructive">{state.errors.expectedShipDate[0]}</p>}
        </div>
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
           {state.errors?.recipeId && <p className="text-sm text-destructive">{state.errors.recipeId[0]}</p>}
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
