
import { getCowsWithPenNames, getPens } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import CowList from './components/CowList';


export default async function HealthPage() {
  const cowsWithPenNames = await getCowsWithPenNames();
  const pens = await getPens();

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
