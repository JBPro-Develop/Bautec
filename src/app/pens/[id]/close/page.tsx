import { getPenById, getCowsByPenId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileDown, FileText } from 'lucide-react';

export default async function CloseGroupPage({ params }: { params: { id: string } }) {
  const pen = await getPenById(params.id);
  if (!pen) notFound();
  
  const cows = await getCowsByPenId(pen.id);
  const initialTotalWeight = cows.reduce((sum, cow) => sum + cow.weight, 0);

  // Dummy data for report
  const finalWeight = initialTotalWeight * 1.8;
  const totalGain = finalWeight - (initialTotalWeight);
  const feedUsed = totalGain * 2.5;
  const feedConversionRatio = feedUsed / totalGain;
  const feedCost = feedUsed * 0.15;
  const salePrice = finalWeight * 1.5;
  const profit = salePrice - feedCost;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Close Pen / Group</CardTitle>
          <CardDescription>Enter the final details for {pen.name} to close the group.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="finalWeight">Final Average Weight (lbs)</Label>
              <Input id="finalWeight" name="finalWeight" type="number" placeholder="e.g., 950" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saleDate">Sale Date</Label>
              <Input id="saleDate" name="saleDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price (per lb)</Label>
              <Input id="salePrice" name="salePrice" type="number" step="0.01" placeholder="e.g., 1.50" required />
            </div>
            <Button type="submit" className="w-full">Generate Report &amp; Close Pen</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Summary Report</CardTitle>
          <CardDescription>Auto-generated summary based on provided data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Total Gain:</p>
                <p className="font-medium">{totalGain.toLocaleString()} lbs</p>
            </div>
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Total Feed Used:</p>
                <p className="font-medium">{feedUsed.toLocaleString()} lbs</p>
            </div>
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Feed Conversion Ratio:</p>
                <p className="font-medium">{feedConversionRatio.toFixed(2)}</p>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Estimated Feed Cost:</p>
                <p className="font-medium">${feedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">Total Sale Value:</p>
                <p className="font-medium">${salePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <Separator />
            
            <div className="flex justify-between items-center font-bold text-lg">
                <p>Estimated Profit/Loss:</p>
                <p className={profit > 0 ? 'text-green-600' : 'text-destructive'}>${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" className="w-full"><FileText className="mr-2 h-4 w-4" /> Export as PDF</Button>
                <Button variant="outline" className="w-full"><FileDown className="mr-2 h-4 w-4" /> Export as CSV</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
