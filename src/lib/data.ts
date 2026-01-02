
import type { Pen, Recipe, FeedingRecord, HealthRecord, Cow, Ingredient } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { z } from 'zod';

export let recipes: Recipe[] = [
  { id: 'rec1', name: 'Recipe A', ingredients: [{ name: 'Corn', targetWeight: 50 }, { name: 'Soybean Meal', targetWeight: 25 }, { name: 'Hay', targetWeight: 25 }] },
  { id: 'rec2', name: 'Recipe B', ingredients: [{ name: 'Barley', targetWeight: 60 }, { name: 'Corn Gluten', targetWeight: 20 }, { name: 'Molasses', targetWeight: 20 }] },
  { id: 'rec3', name: 'Recipe C', ingredients: [{ name: 'Grass Hay', targetWeight: 70 }, { name: 'Alfalfa', targetWeight: 20 }, { name: 'Mineral Salt', targetWeight: 10 }] },
];

export let pens: Pen[] = [
  { 
    id: 'pen1', name: 'North Field Pen', headCount: 50, arrivalDate: '2023-10-01', expectedShipDate: '2024-06-01', 
    recipeId: 'rec1', photoUrl: PlaceHolderImages[0].imageUrl, photoHint: PlaceHolderImages[0].imageHint, status: 'Active' 
  },
  { 
    id: 'pen2', name: 'East Valley Group', headCount: 75, arrivalDate: '2023-11-15', expectedShipDate: '2024-07-15', 
    recipeId: 'rec2', photoUrl: PlaceHolderImages[1].imageUrl, photoHint: PlaceHolderImages[1].imageHint, status: 'Active' 
  },
  { 
    id: 'pen3', name: 'South Hill Pasture', headCount: 40, arrivalDate: '2023-09-01', expectedShipDate: '2024-03-01', 
    recipeId: 'rec3', photoUrl: PlaceHolderImages[2].imageUrl, photoHint: PlaceHolderImages[2].imageHint, status: 'Closed' 
  },
  { 
    id: 'pen4', name: 'West Creek Corral', headCount: 60, arrivalDate: '2024-01-10', expectedShipDate: '2024-09-10', 
    recipeId: 'rec1', photoUrl: PlaceHolderImages[3].imageUrl, photoHint: PlaceHolderImages[3].imageHint, status: 'Active' 
  },
];

export let cows: Cow[] = [
    ...Array.from({ length: 50 }, (_, i) => ({ id: `A${100 + i}`, penId: 'pen1', weight: 450 + i * 2, birthDate: '2023-04-01', photoUrl: PlaceHolderImages[i % 5].imageUrl, photoHint: PlaceHolderImages[i % 5].imageHint })),
    ...Array.from({ length: 75 }, (_, i) => ({ id: `B${200 + i}`, penId: 'pen2', weight: 420 + i * 1.5, birthDate: '2023-05-15', photoUrl: PlaceHolderImages[i % 5].imageUrl, photoHint: PlaceHolderImages[i % 5].imageHint })),
    ...Array.from({ length: 60 }, (_, i) => ({ id: `D${400 + i}`, penId: 'pen4', weight: 430 + i * 2.5, birthDate: '2023-08-10', photoUrl: PlaceHolderImages[i % 5].imageUrl, photoHint: PlaceHolderImages[i % 5].imageHint })),
];


export const feedingRecords: FeedingRecord[] = [
  { id: 'feed1', penId: 'pen1', recipeId: 'rec1', date: '2024-05-20', ingredients: [{ name: 'Corn', actualWeight: 52 }, { name: 'Soybean Meal', actualWeight: 26 }, { name: 'Hay', actualWeight: 25 }], weight: 103 },
  { id: 'feed2', penId: 'pen2', recipeId: 'rec2', date: '2024-05-20', ingredients: [{ name: 'Barley', actualWeight: 60 }, { name: 'Corn Gluten', actualWeight: 21 }, { name: 'Molasses', actualWeight: 20 }], weight: 101 },
  { id: 'feed3', penId: 'pen4', recipeId: 'rec1', date: '2024-05-19', ingredients: [{ name: 'Corn', actualWeight: 48 }, { name: 'Soybean Meal', actualWeight: 24 }, { name: 'Hay', actualWeight: 25 }], weight: 97 },
  { id: 'feed4', penId: 'pen1', recipeId: 'rec1', date: '2024-05-19', ingredients: [{ name: 'Corn', actualWeight: 50 }, { name: 'Soybean Meal', actualWeight: 25 }, { name: 'Hay', actualWeight: 25 }], weight: 100 },
];

export const healthRecords: HealthRecord[] = [
  { id: 'health1', penId: 'pen1', cowTag: 'A101', treatmentDate: '2024-04-15', drugName: 'Ivermectin', dosage: '10ml', reminderDays: 60 },
  { id: 'health2', penId: 'pen2', cowTag: 'B205', treatmentDate: '2024-05-01', drugName: 'Penicillin', dosage: '5ml', reminderDays: 90 },
  { id: 'health3', penId: 'pen1', cowTag: 'A101', treatmentDate: '2024-02-10', drugName: 'Multimin', dosage: '8ml' },
];

// Data access functions
export async function getPens() {
  return pens;
}

export async function getPensWithRecipes() {
    const allPens = await getPens();
    const allRecipes = await getRecipes();
    const recipeMap = new Map(allRecipes.map(r => [r.id, r.name]));

    // Pre-calculate aggregated data
    const feedingMap = new Map<string, string>();
    // Sort records to find the latest one per pen
    const sortedFeedingRecords = [...feedingRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const record of sortedFeedingRecords) {
        if (!feedingMap.has(record.penId)) {
            feedingMap.set(record.penId, record.date);
        }
    }

    const cowStatsMap = new Map<string, { totalWeight: number, headCount: number }>();
    for (const cow of cows) {
        if (cow.penId) {
            const stats = cowStatsMap.get(cow.penId) || { totalWeight: 0, headCount: 0 };
            stats.totalWeight += cow.weight;
            stats.headCount++;
            cowStatsMap.set(cow.penId, stats);
        }
    }
    
    return allPens.map(pen => {
        const stats = cowStatsMap.get(pen.id) || { totalWeight: 0, headCount: 0 };
        const averageWeight = stats.headCount > 0 ? Math.round(stats.totalWeight / stats.headCount) : 0;
        
        return {
            ...pen,
            recipeName: recipeMap.get(pen.recipeId) || 'N/A',
            lastFed: feedingMap.get(pen.id) || 'N/A',
            // Ensure headCount from pen data is used if no cows are found for that pen yet
            headCount: stats.headCount || pen.headCount, 
            averageWeight,
        };
    });
}

export async function getPenById(id: string) {
  return pens.find(pen => pen.id === id);
}

export async function getRecipeById(id: string) {
  return recipes.find(recipe => recipe.id === id);
}

export async function getRecipes() {
    return recipes;
}

export async function addPen(penData: Omit<Pen, 'id' | 'photoUrl' | 'photoHint' | 'status'>) {
  const newId = `pen${pens.length + 1}`;
  const nextImageIndex = pens.length % PlaceHolderImages.length;
  const newPen: Pen = {
      id: newId,
      ...penData,
      photoUrl: PlaceHolderImages[nextImageIndex].imageUrl,
      photoHint: PlaceHolderImages[nextImageIndex].imageHint,
      status: 'Active',
  };
  pens.unshift(newPen);
  return newPen;
}


export async function addRecipe(formData: FormData): Promise<Recipe> {
    const RecipeSchema = z.object({
        recipeName: z.string().min(1, 'Recipe name is required.'),
        ingredients: z.array(z.object({
            name: z.string().min(1, 'Ingredient name is required.'),
            targetWeight: z.coerce.number().positive('Weight must be positive.'),
        })).min(1, 'At least one ingredient is required.'),
    });

    const ingredients: { name: string; targetWeight: number }[] = [];
    let i = 0;
    while (formData.has(`ingredientName-${i}`)) {
        const name = formData.get(`ingredientName-${i}`) as string;
        const targetWeight = formData.get(`ingredientWeight-${i}`) as string;
        if (name || targetWeight) {
            ingredients.push({ name, targetWeight: parseFloat(targetWeight) });
        }
        i++;
    }

    const validatedData = RecipeSchema.safeParse({
        recipeName: formData.get('recipeName'),
        ingredients,
    });

    if (!validatedData.success) {
        throw validatedData.error;
    }
    
    const newRecipe: Recipe = {
        id: `rec${recipes.length + 1}`,
        name: validatedData.data.recipeName,
        ingredients: validatedData.data.ingredients,
    };

    recipes.push(newRecipe);
    return newRecipe;
}

export async function getFeedingRecordsForPen(penId: string) {
  return feedingRecords.filter(record => record.penId === penId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getHealthRecordsForPen(penId: string) {
    return healthRecords.filter(record => record.penId === penId).sort((a, b) => new Date(b.treatmentDate).getTime() - new Date(a.treatmentDate).getTime());
}

export async function getHealthRecordsForCow(cowId: string) {
    return healthRecords.filter(record => record.cowTag === cowId).sort((a, b) => new Date(b.treatmentDate).getTime() - new Date(a.treatmentDate).getTime());
}

export async function getCowById(id: string): Promise<Cow | undefined> {
    return cows.find(cow => cow.id.toLowerCase() === id.toLowerCase());
}

export async function getCows(query?: string): Promise<Cow[]> {
    if (!query) {
        return cows;
    }
    return cows.filter(cow => cow.id.toLowerCase().includes(query.toLowerCase()));
}

export async function getCowsWithPenNames(query?: string) {
    const filteredCows = await getCows(query);
    const allPens = await getPens();
    const penMap = new Map(allPens.map(p => [p.id, p.name]));

    return filteredCows.map(cow => ({
        ...cow,
        penName: cow.penId ? penMap.get(cow.penId) || 'Unknown Pen' : 'Unassigned',
    }));
}


export async function getCowsByPenId(penId: string): Promise<Cow[]> {
    return cows.filter(cow => cow.penId === penId);
}


export async function addCow(cow: Omit<Cow, 'photoUrl' | 'photoHint'>): Promise<Cow> {
    // Check if cow with same ID already exists
    if (cows.find(c => c.id.toLowerCase() === cow.id.toLowerCase())) {
        throw new Error('A cow with this Tag ID already exists.');
    }
    
    // Assign a placeholder image for now
    const nextImageIndex = cows.length % PlaceHolderImages.length;
    const newCow: Cow = {
        ...cow,
        photoUrl: PlaceHolderImages[nextImageIndex].imageUrl,
        photoHint: PlaceHolderImages[nextImageIndex].imageHint,
    }

    cows.unshift(newCow);

    // If a pen is assigned, update headCount
    if (newCow.penId) {
        const penIndex = pens.findIndex(p => p.id === newCow.penId);
        if (penIndex !== -1) {
            pens[penIndex].headCount++;
        }
    }
    return newCow;
}

export async function addHealthRecord(data: Omit<HealthRecord, 'id'>) {
    const newRecord: HealthRecord = {
        id: `health${healthRecords.length + 1}`,
        ...data,
    };
    healthRecords.unshift(newRecord);
    return newRecord;
}
