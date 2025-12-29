import { getPens, getRecipeById } from '@/lib/data';
import PenCard from './components/PenCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function Dashboard() {
  const pens = await getPens();

  const pensWithRecipes = await Promise.all(
    pens.map(async (pen) => {
      const recipe = await getRecipeById(pen.recipeId);
      return { ...pen, recipeName: recipe?.name || 'N/A' };
    })
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pensWithRecipes.map((pen) => (
          <PenCard key={pen.id} pen={pen} />
        ))}
      </div>
    </div>
  );
}
