'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { LayoutGrid, PlusCircle, BrainCircuit, Box, LifeBuoy, Settings, Spade, User } from 'lucide-react';
import { Separator } from './ui/separator';
import { useEffect, useState } from 'react';
import type { Pen } from '@/lib/types';
import { getActivePens } from '@/lib/data';

export default function AppSidebar() {
  const pathname = usePathname();
  const [activePens, setActivePens] = useState<Pen[]>([]);

  useEffect(() => {
    async function fetchPens() {
      const pens = await getActivePens();
      setActivePens(pens);
    }
    fetchPens();
  }, []);

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, tooltip: 'Dashboard' },
    { href: '/pens/new', label: 'New Pen / Group', icon: PlusCircle, tooltip: 'New Pen' },
    { href: '/ai-insights', label: 'AI Feeding Insights', icon: BrainCircuit, tooltip: 'AI Insights' },
    { href: '/cows', label: 'Cow Lookup', icon: User, tooltip: 'Cow Lookup' },
  ];

  const isActive = (href: string) => {
    if (href === '/cows') {
      return pathname.startsWith('/cows');
    }
    return pathname === href;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
            <Spade className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline">BAU-TEC Farm</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={item.tooltip} isActive={isActive(item.href)}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel>Active Pens</SidebarGroupLabel>
          <SidebarMenu>
            {activePens.map((pen) => (
              <SidebarMenuItem key={pen.id}>
                <SidebarMenuButton asChild tooltip={pen.name} isActive={pathname.startsWith(`/pens/${pen.id}`)}>
                  <Link href={`/pens/${pen.id}`}>
                    <Box />
                    <span>{pen.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help">
              <Link href="#">
                <LifeBuoy />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
