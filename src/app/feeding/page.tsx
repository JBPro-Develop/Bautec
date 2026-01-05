
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
    <div className="flex flex-col gap-8">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Daily Feeding Tracker</CardTitle>
            <CardDescription>
              Select a pen and recipe to record a daily feeding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-2xl mx-auto">
              <FeedingTrackerForm pens={pens} recipes={recipes} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
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
