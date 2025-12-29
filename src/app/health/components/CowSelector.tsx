
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Cow } from '@/lib/types';

export default function CowSelector({ cows }: { cows: Cow[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const selectedCowId = searchParams.get('cowId') || '';

  const handleSelect = (cowId: string) => {
    const params = new URLSearchParams(searchParams);
    if (cowId) {
      params.set('cowId', cowId);
    } else {
      params.delete('cowId');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-xs">
        <Select onValueChange={handleSelect} value={selectedCowId}>
        <SelectTrigger>
            <SelectValue placeholder="Select a cow..." />
        </SelectTrigger>
        <SelectContent>
            {cows.map((cow) => (
            <SelectItem key={cow.id} value={cow.id}>
                {cow.id}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>
    </div>
  );
}
