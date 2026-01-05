
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

async function CowList({ query }: { query: string }) {
  const cowsWithPenNames = await getCowsWithPenNames(query);
  return <SearchResults cows={cowsWithPenNames} query={query} />;
}

export default async function CowsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const pens = await getPens();
  const query = searchParams?.query || '';

  return (
    <Tabs defaultValue="search">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Cow Management</CardTitle>
              <CardDescription>
                Search for existing animals or add a new one to the herd.
              </CardDescription>
            </div>
            <TabsList>
              <TabsTrigger value="search">Search Cows</TabsTrigger>
              <TabsTrigger value="add">Add Cow</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="search">
            <SearchSection />
            <Suspense fallback={<p className="pt-8 text-center text-muted-foreground">Loading results...</p>}>
              <CowList query={query} />
            </Suspense>
          </TabsContent>
          <TabsContent value="add">
            <div className="max-w-2xl mx-auto">
              <AddCowSection pens={pens} />
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
