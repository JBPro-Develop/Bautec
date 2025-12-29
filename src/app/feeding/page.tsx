
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPens, getRecipes } from '@/lib/data';
import FeedingTrackerForm from './components/FeedingTrackerForm';

export default async function FeedingPage() {
  const pens = await getPens();
  const recipes = await getRecipes();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Daily Feeding Tracker</CardTitle>
          <CardDescription>
            Select a pen and recipe to record a daily feeding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedingTrackerForm pens={pens} recipes={recipes} />
        </CardContent>
      </Card>
    </div>
  );
}
