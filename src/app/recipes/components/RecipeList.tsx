'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Recipe } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

type RecipeListProps = {
    recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
    if (recipes.length === 0) {
        return <p className="text-center text-muted-foreground pt-8">No recipes found. Create one to get started.</p>
    }
    
    return (
        <div className="mt-8">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Recipe Name</TableHead>
                        <TableHead>Ingredients</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recipes.map(recipe => (
                        <TableRow key={recipe.id}>
                            <TableCell className="font-medium">{recipe.name}</TableCell>
                            <TableCell className="flex flex-wrap gap-1">
                                {recipe.ingredients.map(ing => (
                                    <Badge key={ing.name} variant="secondary">{ing.name} ({ing.targetWeight} lbs)</Badge>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
