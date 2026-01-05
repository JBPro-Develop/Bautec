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
import RecipeSearch from './components/RecipeSearch';

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const allRecipes = await getRecipes();
  const query = searchParams?.query || '';

  const filteredRecipes = query
    ? allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      )
    : allRecipes;

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
            <RecipeSearch />
            <Suspense fallback={<p>Loading recipes...</p>}>
              <RecipeList recipes={filteredRecipes} query={query} />
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
