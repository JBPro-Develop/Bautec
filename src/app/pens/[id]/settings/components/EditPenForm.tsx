'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import type { Pen, Recipe } from '@/lib/types';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
    </Button>
  );
}

export default function EditPenForm({ pen, recipes }: { pen: Pen, recipes: Recipe[] }) {

  return (
    <form className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Pen Name / ID</Label>
        <Input id="name" name="name" defaultValue={pen.name} required />
      </div>
      
       <div className="space-y-2">
          <Label htmlFor="recipeId">Assigned Recipe</Label>
          <Select name="recipeId" defaultValue={pen.recipeId} required>
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
      
      <div className="space-y-2">
        <Label htmlFor="photo">Change Photo</Label>
        <Input id="photo" name="photo" type="file" />
        <p className="text-xs text-muted-foreground">This is for display only and won't be uploaded.</p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <SubmitButton />
      </div>
    </form>
  );
}
