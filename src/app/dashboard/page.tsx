
import { getPensWithRecipes, getTotalCows, getLatestFeeding, getLatestHealthRecord } from '@/lib/data';
import PenCard from './components/PenCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, User, Wheat, HeartPulse } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import StatCard from './components/StatCard';
import { formatDate } from '@/lib/utils';


export default async function Dashboard() {
  const pensWithRecipes = await getPensWithRecipes();
  const totalCows = await getTotalCows();
  const latestFeeding = await getLatestFeeding();
  const latestHealthRecord = await getLatestHealthRecord();


  const activePens = pensWithRecipes.filter((pen) => pen.status === 'Active');
  const closedPens = pensWithRecipes.filter((pen) => pen.status === 'Closed');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link href="/pens/new">
              <PlusCircle />
              New Pen / Group
            </Link>
          </Button>
        </div>
         <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Total Cows"
            value={totalCows.toString()}
            icon={User}
            description="Across all active and unassigned."
          />
          <StatCard 
            title="Latest Feeding"
            value={latestFeeding ? latestFeeding.penName : 'N/A'}
            icon={Wheat}
            description={latestFeeding ? `On ${formatDate(latestFeeding.date)}` : 'No feeding records found'}
          />
           <StatCard 
            title="Latest Health Event"
            value={latestHealthRecord ? latestHealthRecord.cowTag : 'N/A'}
            icon={HeartPulse}
            description={latestHealthRecord ? `${latestHealthRecord.drugName} on ${formatDate(latestHealthRecord.treatmentDate)}` : 'No health records found'}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Active Pens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activePens.map((pen) => (
            <PenCard key={pen.id} pen={pen} />
          ))}
        </div>
        {activePens.length === 0 && (
            <p className="text-muted-foreground">No active pens found.</p>
        )}
      </div>

      {closedPens.length > 0 && (
        <div>
            <Separator className="my-8" />
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-muted-foreground">Closed Pens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {closedPens.map((pen) => (
                <PenCard key={pen.id} pen={pen} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
