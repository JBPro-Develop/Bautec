import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { getPens } from '@/lib/data';

export default async function CowsPage() {
  const pens = await getPens();
  const allTags = pens.flatMap(pen => pen.animalTags);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Cow Lookup</CardTitle>
          <CardDescription>
            Search for an individual animal by their tag ID to view their details, weight, age, and health history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2 mx-auto mb-8">
            <Input type="text" placeholder="Enter Tag ID (e.g., A101)" />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>

          <div className="text-center text-muted-foreground">
            <p>Enter an animal's tag ID to see its information.</p>
            <p className="text-xs mt-2">Total of {allTags.length} animals across {pens.length} pens.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
