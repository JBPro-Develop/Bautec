import { getCows, getPenById } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import CowList from './components/CowList';
import { getPens } from '@/lib/data';

export default async function HealthPage() {
  const allCows = await getCows();
  const pens = await getPens();

  const cowsWithPenNames = await Promise.all(
    allCows.map(async (cow) => {
      if (!cow.penId) return { ...cow, penName: 'Unassigned' };
      const pen = await getPenById(cow.penId);
      return { ...cow, penName: pen?.name || 'Unknown Pen' };
    })
  );

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Health &amp; Treatments</CardTitle>
            <CardDescription>
              Select a cow to view its history or add a new treatment record.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <CowList cows={cowsWithPenNames} pens={pens} />
        </CardContent>
      </Card>
    </div>
  );
}
