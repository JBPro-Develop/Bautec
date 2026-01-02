'use client';

import { useActionState, useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createRecipe } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="animate-spin" /> : <><PlusCircle/> Create Recipe</>}
    </Button>
  );
}

export default function NewRecipeForm() {
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createRecipe, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [ingredients, setIngredients] = useState([{ name: '', targetWeight: '' }]);

  const handleIngredientChange = (index: number, field: 'name' | 'targetWeight', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', targetWeight: '' }]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };
  
  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({ title: "Success!", description: state.message });
      setIngredients([{ name: '', targetWeight: '' }]);
      formRef.current?.reset();
    } else if (state?.message && state.errors) {
        const errorMessages = Object.values(state.errors).flat().join(' ');
        toast({ variant: 'destructive', title: "Error", description: errorMessages || state.message });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="recipeName">Recipe Name</Label>
        <Input id="recipeName" name="recipeName" placeholder="e.g., Finisher Recipe" required />
        {state.errors?.recipeName && <p className="text-sm text-destructive">{state.errors.recipeName[0]}</p>}
      </div>

      <div>
        <Label>Ingredients</Label>
        <div className="space-y-2 pt-2">
        {ingredients.map((ing, index) => (
            <div key={index} className="flex items-center gap-2">
                <Input 
                    name={`ingredientName-${index}`}
                    placeholder="Ingredient Name" 
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                />
                <Input 
                    name={`ingredientWeight-${index}`}
                    type="number" 
                    placeholder="Lbs" 
                    value={ing.targetWeight}
                    onChange={(e) => handleIngredientChange(index, 'targetWeight', e.target.value)}
                    required
                    className="w-24"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} disabled={ingredients.length <= 1}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
        ))}
         {state.errors?.ingredients && <p className="text-sm text-destructive">{state.errors.ingredients[0]}</p>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
        </Button>
      </div>

      <SubmitButton />
    </form>
  );
}
