import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getRecipes } from '@/lib/data';
import { Suspense } from 'react';
import RecipeList from './components/RecipeList';
import NewRecipeForm from './components/NewRecipeForm';
import { Separator } from '@/components/ui/separator';

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Recipe List</CardTitle>
            <CardDescription>
              Browse and manage your feeding recipes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Loading recipes...</p>}>
              <RecipeList recipes={recipes} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create New Recipe</CardTitle>
            <CardDescription>
              Define a new recipe with its ingredients and target weights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewRecipeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
