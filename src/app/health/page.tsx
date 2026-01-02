
import { getCowsWithPenNames, getPens, getAllHealthRecords } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CowList from './components/CowList';
import HealthLog from './components/HealthLog';
import { Suspense } from 'react';

export default async function HealthPage() {
  const cowsWithPenNames = await getCowsWithPenNames();
  const pens = await getPens();
  const allHealthRecords = await getAllHealthRecords();

  return (
    <Tabs defaultValue="records" className="w-full">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Health &amp; Treatments</CardTitle>
              <CardDescription>
                Manage individual cow records or view the complete health log.
              </CardDescription>
            </div>
            <TabsList>
              <TabsTrigger value="records">Individual Records</TabsTrigger>
              <TabsTrigger value="log">Health Log</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="records">
            <CowList cows={cowsWithPenNames} pens={pens} />
          </TabsContent>
          <TabsContent value="log">
            <Suspense fallback={<p>Loading health log...</p>}>
                <HealthLog records={allHealthRecords} />
            </Suspense>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
