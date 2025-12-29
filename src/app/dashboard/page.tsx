import { getPens, getRecipeById } from '@/lib/data';
import PenCard from './components/PenCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function Dashboard() {
  const pens = await getPens();

  const pensWithRecipes = await Promise.all(
    pens.map(async (pen) => {
      const recipe = await getRecipeById(pen.recipeId);
      return { ...pen, recipeName: recipe?.name || 'N/A' };
    })
  );

  const activePens = pensWithRecipes.filter((pen) => pen.status === 'Active');
  const closedPens = pensWithRecipes.filter((pen) => pen.status === 'Closed');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pens Overview</h1>
        <Button asChild>
          <Link href="/pens/new">
            <PlusCircle />
            New Pen / Group
          </Link>
        </Button>
      </div>

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
