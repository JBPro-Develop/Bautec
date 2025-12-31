import { getPenById, getRecipes } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EditPenForm from './components/EditPenForm';

export default async function PenSettingsPage({ params }: { params: { id: string } }) {
  const pen = await getPenById(params.id);
  if (!pen) notFound();
  
  const recipes = await getRecipes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pen Settings</CardTitle>
        <CardDescription>Update the details for {pen.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditPenForm pen={pen} recipes={recipes} />
      </CardContent>
    </Card>
  );
}
