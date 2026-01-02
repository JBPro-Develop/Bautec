
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getPens, getCowsWithPenNames } from '@/lib/data';
import { Suspense } from 'react';
import SearchSection from './components/SearchSection';
import AddCowSection from './components/AddCowSection';
import SearchResults from './components/SearchResults';
import { Separator } from '@/components/ui/separator';

export default async function CowsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const pens = await getPens();
  const query = searchParams?.query || '';
  const cowsWithPenNames = await getCowsWithPenNames(query);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Cow Search</CardTitle>
            <CardDescription>
              Search for an individual animal by their tag ID or browse all animals below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchSection />
             <Suspense fallback={<p>Loading results...</p>}>
                <SearchResults cows={cowsWithPenNames} query={query} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Add New Cow</CardTitle>
            <CardDescription>
              Enter the details for a new animal to add it to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddCowSection pens={pens} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
