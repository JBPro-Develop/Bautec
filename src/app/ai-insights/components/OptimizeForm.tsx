'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getFeedingRecommendation, type AIFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const initialState: AIFormState = {
  form: {
    penConditions: 'Temperature: 75°F, Humidity: 60%, Animals are healthy and active.',
    pastFeedingData: 'Past 7 days: Average intake of 22 lbs per head per day of Starter Growth Mix. Consistent weight gain of 2.5 lbs/day.',
    ingredientAvailability: 'Corn: $0.12/lb, ample supply. Soybean Meal: $0.25/lb, supply is limited. Barley: $0.10/lb, readily available.',
    currentRecipe: 'Starter Growth Mix: 50% Corn, 25% Soybean Meal, 25% Hay.',
    targetWeightGain: 'Targeting a weight gain of 2.8 lbs per head per day.',
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <BrainCircuit className="mr-2 h-4 w-4" /> Generate Recommendations
        </>
      )}
    </Button>
  );
}

export default function OptimizeForm() {
  const [state, formAction] = useFormState(getFeedingRecommendation, initialState);

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="penConditions">Current Pen Conditions</Label>
            <Textarea
              id="penConditions"
              name="penConditions"
              placeholder="e.g., Temperature, humidity, animal health..."
              defaultValue={state.form.penConditions}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pastFeedingData">Past Feeding Data</Label>
            <Textarea
              id="pastFeedingData"
              name="pastFeedingData"
              placeholder="e.g., Dates, ingredients, weights, performance..."
              defaultValue={state.form.pastFeedingData}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ingredientAvailability">Ingredient Availability</Label>
            <Textarea
              id="ingredientAvailability"
              name="ingredientAvailability"
              placeholder="e.g., Ingredient, price, quantity..."
              defaultValue={state.form.ingredientAvailability}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentRecipe">Current Recipe</Label>
            <Textarea
              id="currentRecipe"
              name="currentRecipe"
              placeholder="e.g., List of ingredients and their percentages/weights."
              defaultValue={state.form.currentRecipe}
              rows={4}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetWeightGain">Target Weight Gain</Label>
          <Textarea
            id="targetWeightGain"
            name="targetWeightGain"
            placeholder="e.g., 2.8 lbs per day per head"
            defaultValue={state.form.targetWeightGain}
            rows={2}
          />
        </div>
        <SubmitButton />
      </form>

      {state.error &amp;&amp; (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.response &amp;&amp; (
        <Card className="bg-accent/50 animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="text-primary" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
              <p>{state.response.recommendations}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
