'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchSection() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="Search by Tag ID..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <Button type="submit" onClick={() => handleSearch(searchParams.get('query') || '')}>
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
    </div>
  );
}
