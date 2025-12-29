import { getPenById, getCowsByPenId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { differenceInMonths, differenceInYears } from 'date-fns';
import Image from 'next/image';

function getAge(birthDate: string): string {
    const now = new Date();
    const dob = new Date(birthDate);
    const years = differenceInYears(now, dob);
    const months = differenceInMonths(now, dob) % 12;

    if (years > 0) {
        return `${years} ${years > 1 ? 'yrs' : 'yr'}, ${months} ${months > 1 ? 'mos' : 'mo'}`;
    }
    return `${months} ${months > 1 ? 'mos' : 'mo'}`;
}

export default async function PenCowsPage({ params }: { params: { id: string } }) {
  const pen = await getPenById(params.id);
  if (!pen) notFound();

  const cows = await getCowsByPenId(pen.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cows in {pen.name}</CardTitle>
        <CardDescription>A list of all animals currently assigned to this pen.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Photo</TableHead>
              <TableHead>Tag ID</TableHead>
              <TableHead>Weight (lbs)</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cows.map(cow => (
              <TableRow key={cow.id}>
                <TableCell>
                  {cow.photoUrl && (
                    <Image 
                        src={cow.photoUrl} 
                        alt={`Photo of ${cow.id}`} 
                        width={64} 
                        height={64} 
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint={cow.photoHint}
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{cow.id}</TableCell>
                <TableCell>{cow.weight}</TableCell>
                <TableCell>{getAge(cow.birthDate)}</TableCell>
              </TableRow>
            ))}
            {cows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No cows found in this pen.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
