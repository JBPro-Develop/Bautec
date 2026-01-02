
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getPens, getRecipes, getFeedingHistory } from '@/lib/data';
import FeedingTrackerForm from './components/FeedingTrackerForm';
import { Separator } from '@/components/ui/separator';
import FeedingHistoryList from './components/FeedingHistoryList';
import { Suspense } from 'react';

export default async function FeedingPage() {
  const pens = await getPens();
  const recipes = await getRecipes();
  const feedingHistory = await getFeedingHistory();

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
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
      <div className="lg:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle>Feeding History</CardTitle>
                <CardDescription>
                    A complete log of all feeding records.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<p>Loading history...</p>}>
                    <FeedingHistoryList records={feedingHistory} />
                </Suspense>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
