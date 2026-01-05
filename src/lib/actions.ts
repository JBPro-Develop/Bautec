
// @ts-nocheck
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { optimizeFeedingRecipe } from '@/ai/flows/feeding-recipe-optimization';
import type { OptimizeFeedingRecipeOutput } from '@/ai/flows/feeding-recipe-optimization';
import { addCow, addRecipe, addPen, addHealthRecord } from '@/lib/data';

const NewPenSchema = z.object({
  name: z.string().min(1, 'Pen name is required.'),
  headCount: z.coerce.number().min(1, 'Number of heads must be at least 1.'),
  arrivalDate: z.string().min(1, 'Arrival date is required.'),
  expectedShipDate: z.string().min(1, 'Expected ship date is required.'),
  recipeId: z.string().min(1, 'A recipe must be selected.'),
});

export async function createPen(prevState: any, formData: FormData) {
  const validatedFields = NewPenSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newPen = await addPen(validatedFields.data);
    revalidatePath('/dashboard');
    revalidatePath('/pens/new');
    // Instead of redirecting, we return the new ID for client-side redirection
    return { success: true, newPenId: newPen.id };
  } catch (e: any) {
    return {
        errors: {},
        message: e.message || 'An unknown error occurred.',
    }
  }
}


// AI Form Action
export type AIFormState = {
  form: Record<string, string>;
  response?: OptimizeFeedingRecipeOutput;
  error?: string;
};

export async function getFeedingRecommendation(
  prevState: AIFormState,
  formData: FormData
): Promise<AIFormState> {
  const input = {
    penConditions: formData.get('penConditions') as string,
    pastFeedingData: formData.get('pastFeedingData') as string,
    ingredientAvailability: formData.get('ingredientAvailability') as string,
    currentRecipe: formData.get('currentRecipe') as string,
    targetWeightGain: formData.get('targetWeightGain') as string,
  };

  try {
    const response = await optimizeFeedingRecipe(input);
    return {
      form: input,
      response,
    };
  } catch (e: any) {
    return {
      form: input,
      error: e.message || 'An unknown error occurred.',
    };
  }
}

const AddCowSchema = z.object({
  tagId: z.string().min(1, 'Tag ID is required.'),
  weight: z.coerce.number().positive('Weight must be a positive number.'),
  birthDate: z.string().min(1, 'Birth date is required.'),
  penId: z.string().nullable(),
  photo: z.any().optional(),
});

export async function createCow(prevState: any, formData: FormData) {
    const validatedFields = AddCowSchema.safeParse({
        tagId: formData.get('tagId'),
        weight: formData.get('weight'),
        birthDate: formData.get('birthDate'),
        penId: formData.get('penId') === 'null' ? null : formData.get('penId'),
        photo: formData.get('photo')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to add cow. Please check the fields.',
        };
    }
    
    try {
        const newCow = await addCow({
            id: validatedFields.data.tagId,
            weight: validatedFields.data.weight,
            birthDate: validatedFields.data.birthDate,
            penId: validatedFields.data.penId,
        });

        revalidatePath('/cows');
        if (newCow.penId) {
            revalidatePath(`/pens/${newCow.penId}/cows`);
            revalidatePath(`/dashboard`);
        }
        return { message: `Successfully added cow ${validatedFields.data.tagId}.` };
    } catch (e: any) {
        return { message: e.message, errors: {} };
    }
}

export async function createRecipe(prevState: any, formData: FormData) {
  try {
    await addRecipe(formData);
    revalidatePath('/recipes');
    revalidatePath('/dashboard');
    revalidatePath('/pens/new');
    revalidatePath('/feeding');
    return { message: 'Recipe created successfully!' };
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return {
        errors: e.flatten().fieldErrors,
        message: 'Failed to create recipe. Please check the fields.',
      };
    }
    return { message: e.message || 'An unknown error occurred.', errors: {} };
  }
}

export async function trackFeeding(prevState: any, formData: FormData) {
    revalidatePath('/feeding');
    revalidatePath('/dashboard');
    return { message: 'Feeding recorded successfully!' };
}

const AddHealthRecordSchema = z.object({
  cowTag: z.string().min(1, 'Cow Tag is required'),
  penId: z.string().min(1, 'Internal Pen ID is required'),
  drugName: z.string().min(1, 'Drug name is required'),
  treatmentDate: z.string().min(1, 'Treatment date is required'),
  dosage: z.string().optional(),
  reminderDays: z.coerce.number().optional(),
});

export async function createHealthRecord(prevState: any, formData: FormData) {
    const validatedFields = AddHealthRecordSchema.safeParse({
        cowTag: formData.get('cowTag'),
        penId: formData.get('penId'),
        drugName: formData.get('drugName'),
        treatmentDate: formData.get('treatmentDate'),
        dosage: formData.get('dosage'),
        reminderDays: formData.get('reminderDays'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to add record. Please check the fields.',
        };
    }

    try {
        await addHealthRecord(validatedFields.data);
        revalidatePath('/health');
        revalidatePath(`/pens/${validatedFields.data.penId}/health`);
        return { message: `Successfully added treatment for cow ${validatedFields.data.cowTag}.` };
    } catch (e: any) {
        return { message: e.message, errors: {} };
    }
}
