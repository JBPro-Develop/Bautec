import { getPenById, getRecipeById, getFeedingRecordsForPen } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default async function FeedingPage({ params }: { params: { id: string } }) {
  const pen = await getPenById(params.id);
  if (!pen) notFound();
  
  const recipe = await getRecipeById(pen.recipeId);
  if (!recipe) notFound();

  const feedingRecords = await getFeedingRecordsForPen(pen.id);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Record Daily Feeding</CardTitle>
          <CardDescription>Adjust and save today's feeding weights for {pen.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Last actual weights shown for reference.</p>
              <div className="space-y-4">
                {recipe.ingredients.map((ing, index) => {
                  const lastWeight = feedingRecords[0]?.ingredients.find(i => i.name === ing.name)?.actualWeight || ing.targetWeight;
                  return (
                    <div key={index} className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`ingredient-${index}`} className="col-span-1">{ing.name}</Label>
                      <Input id={`ingredient-${index}`} name={`ingredient-${index}`} type="number" defaultValue={lastWeight} className="col-span-1" />
                      <span className="text-sm text-muted-foreground">Target: {ing.targetWeight} lbs</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />
            
            <div>
                <Label className="font-semibold">Adjustment Type</Label>
                <RadioGroup defaultValue="same" className="mt-2 flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="same" id="same" />
                        <Label htmlFor="same">Same as Last</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="plus5" id="plus5" />
                        <Label htmlFor="plus5">+5%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minus5" id="minus5" />
                        <Label htmlFor="minus5">-5%</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom</Label>
                    </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full">Save Feeding Record</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feeding History</CardTitle>
          <CardDescription>Last 5 feeding records for this pen.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Ingredient</TableHead>
                <TableHead className="text-right">Actual Weight (lbs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedingRecords.slice(0, 5).map(record => (
                record.ingredients.map((ing, index) => (
                  <TableRow key={`${record.id}-${index}`}>
                    {index === 0 && <TableCell rowSpan={record.ingredients.length} className="align-top font-medium">{formatDate(record.date)}</TableCell>}
                    <TableCell>{ing.name}</TableCell>
                    <TableCell className="text-right">{ing.actualWeight}</TableCell>
                  </TableRow>
                ))
              ))}
              {feedingRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No feeding records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
