import { getRecipes } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import NewPenForm from './components/NewPenForm';

export default async function NewPenPage() {
  const recipes = await getRecipes();
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Pen / Group</CardTitle>
          <CardDescription>Fill out the details below to add a new pen to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewPenForm recipes={recipes} />
        </CardContent>
      </Card>
    </div>
  );
}
