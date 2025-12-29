'use server';

/**
 * @fileOverview An AI agent for optimizing feeding recipes based on pen conditions, past feeding data, and ingredient availability.
 *
 * - optimizeFeedingRecipe - A function that generates optimized feeding recipe recommendations.
 * - OptimizeFeedingRecipeInput - The input type for the optimizeFeedingRecipe function.
 * - OptimizeFeedingRecipeOutput - The return type for the optimizeFeedingRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeFeedingRecipeInputSchema = z.object({
  penConditions: z
    .string()
    .describe('Description of the current pen conditions (e.g., temperature, humidity, animal health).'),
  pastFeedingData: z
    .string()
    .describe('Summary of past feeding data, including dates, ingredients, and weights.'),
  ingredientAvailability: z
    .string()
    .describe('Information about available feed ingredients, including price and quantity.'),
  currentRecipe: z
    .string()
    .describe('The current feeding recipe being used for the pen.'),
  targetWeightGain: z
    .string()
    .describe('The target weight gain for the animals in the pen.'),
});
export type OptimizeFeedingRecipeInput = z.infer<typeof OptimizeFeedingRecipeInputSchema>;

const OptimizeFeedingRecipeOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'Optimized feeding recipe recommendations, including adjustments to ingredients and weights, with reasoning.
'    ),
});
export type OptimizeFeedingRecipeOutput = z.infer<typeof OptimizeFeedingRecipeOutputSchema>;

export async function optimizeFeedingRecipe(input: OptimizeFeedingRecipeInput): Promise<OptimizeFeedingRecipeOutput> {
  return optimizeFeedingRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeFeedingRecipePrompt',
  input: {schema: OptimizeFeedingRecipeInputSchema},
  output: {schema: OptimizeFeedingRecipeOutputSchema},
  prompt: `You are an expert farm manager specializing in optimizing feeding recipes for livestock.

You will analyze the current pen conditions, past feeding data, and ingredient availability to generate optimized feeding recipe recommendations.

Consider the target weight gain for the animals and provide reasoning for your recommendations.

Current Pen Conditions: {{{penConditions}}}
Past Feeding Data: {{{pastFeedingData}}}
Ingredient Availability: {{{ingredientAvailability}}}
Current Recipe: {{{currentRecipe}}}
Target Weight Gain: {{{targetWeightGain}}}

Provide specific recommendations for adjusting the feeding recipe to improve animal growth and reduce feed costs.
`, // Changed the prompt to be more descriptive
});

const optimizeFeedingRecipeFlow = ai.defineFlow(
  {
    name: 'optimizeFeedingRecipeFlow',
    inputSchema: OptimizeFeedingRecipeInputSchema,
    outputSchema: OptimizeFeedingRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
