import { getCows, getPenById } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import CowList from './components/CowList';

export default async function HealthPage() {
  const allCows = await getCows();
  
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
            <CardTitle>Health & Treatments</CardTitle>
            <CardDescription>Select a cow to view its health and treatment history.</CardDescription>
        </CardHeader>
        <CardContent>
            <CowList cows={cowsWithPenNames} />
        </CardContent>
       </Card>
    </div>
  );
}
