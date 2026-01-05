'use server';

import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Spade,
} from 'lucide-react';
import { getPens } from '@/lib/data';
import SidebarNav from './SidebarNav';
import type { Pen } from '@/lib/types';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    iconName: 'LayoutGrid',
    tooltip: 'Dashboard',
  },
  { href: '/feeding', label: 'Feeding', iconName: 'Wheat', tooltip: 'Feeding' },
  { href: '/recipes', label: 'Recipes', iconName: 'CookingPot', tooltip: 'Recipes' },
  { href: '/cows', label: 'Cows', iconName: 'User', tooltip: 'Cow Lookup' },
  { href: '/health', label: 'Health', iconName: 'HeartPulse', tooltip: 'Health' },
];

const footerMenuItems = [
    { href: '/settings', label: 'Settings', iconName: 'Settings', tooltip: 'Settings' },
];

export default async function AppSidebar() {
  const pens: Pen[] = await getPens();
  const activePens = pens.filter((p) => p.status === 'Active');
  const closedPens = pens.filter((p) => p.status === 'Closed');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Spade className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-xl font-bold">BAU-TEC Farm</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav
          menuItems={menuItems}
          activePens={activePens}
          closedPens={closedPens}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNav menuItems={footerMenuItems} isFooter={true} />
      </SidebarFooter>
    </Sidebar>
  );
}
