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
  useSidebar,
} from '@/components/ui/sidebar';
import { LayoutGrid, PlusCircle, CookingPot, Box, LifeBuoy, Settings, Spade, User, Wheat, HeartPulse } from 'lucide-react';
import { Separator } from './ui/separator';
import type { Pen } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getPens } from '@/lib/data';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, tooltip: 'Dashboard' },
    { href: '/feeding', label: 'Feeding', icon: Wheat, tooltip: 'Feeding' },
    { href: '/recipes', label: 'Recipes', icon: CookingPot, tooltip: 'Recipes' },
    { href: '/cows', label: 'Cows', icon: User, tooltip: 'Cow Lookup' },
    { href: '/health', label: 'Health', icon: HeartPulse, tooltip: 'Health' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const [pens, setPens] = useState<Pen[]>([]);

  useEffect(() => {
    async function fetchPens() {
      const penData = await getPens();
      setPens(penData);
    }
    fetchPens();
  }, []);
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
            <Spade className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline">BAU-TEC Farm</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={item.tooltip} isActive={pathname.startsWith(item.href) && item.href !== '/' || pathname === item.href}>
                <Link href={item.href} onClick={handleLinkClick}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Active Pens</span>
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2">
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={"New Pen"} isActive={pathname === '/pens/new'}>
                    <Link href={'/pens/new'} onClick={handleLinkClick}>
                        <PlusCircle/>
                        <span>New Pen</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            {pens.filter(p => p.status === 'Active').map((pen) => (
              <SidebarMenuItem key={pen.id}>
                <SidebarMenuButton asChild tooltip={pen.name} isActive={pathname.startsWith(`/pens/${pen.id}`)}>
                  <Link href={`/pens/${pen.id}`} onClick={handleLinkClick}>
                    <Box />
                    <span>{pen.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        {pens.filter(p => p.status === 'Closed').length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <span>Closed Pens</span>
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2">
              {pens.filter(p => p.status === 'Closed').map((pen) => (
                <SidebarMenuItem key={pen.id}>
                  <SidebarMenuButton asChild tooltip={pen.name} isActive={pathname.startsWith(`/pens/${pen.id}`)}>
                    <Link href={`/pens/${pen.id}`} onClick={handleLinkClick}>
                      <Box />
                      <span>{pen.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help">
              <Link href="#" onClick={handleLinkClick}>
                <LifeBuoy />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#" onClick={handleLinkClick}>
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
