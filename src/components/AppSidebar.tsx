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
import { LayoutGrid, PlusCircle, CookingPot, Box, LifeBuoy, Settings, Spade, User, Wheat } from 'lucide-react';
import { Separator } from './ui/separator';
import { useEffect, useState, useMemo } from 'react';
import type { Pen } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

export default function AppSidebar({ pens }: { pens: Pen[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  
  const activePens = useMemo(() => pens.filter(p => p.status === 'Active'), [pens]);
  const closedPens = useMemo(() => pens.filter(p => p.status === 'Closed'), [pens]);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, tooltip: 'Dashboard' },
    { href: '/feeding', label: 'Feeding', icon: Wheat, tooltip: 'Feeding' },
    { href: '/recipes', label: 'Recipes', icon: CookingPot, tooltip: 'Recipes' },
    { href: '/pens/new', label: 'New Pen / Group', icon: PlusCircle, tooltip: 'New Pen' },
    { href: '/cows', label: 'Cow Lookup', icon: User, tooltip: 'Cow Lookup' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
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
              <SidebarMenuButton asChild tooltip={item.tooltip} isActive={isActive(item.href)}>
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
          <Collapsible defaultOpen>
            <div className="group-data-[state=closed]/collapsible:group w-full">
              <CollapsibleTrigger className="w-full">
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer w-full group-data-[collapsible=icon]:hidden">
                  <span>Active Pens</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <SidebarMenu className="mt-2">
                  {activePens.map((pen) => (
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
              </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        
        {closedPens.length > 0 && (
          <SidebarGroup>
            <Collapsible>
                <div className="group-data-[state=closed]/collapsible:group w-full">
                  <CollapsibleTrigger className="w-full">
                      <SidebarGroupLabel className="flex items-center justify-between cursor-pointer w-full group-data-[collapsible=icon]:hidden">
                          <span>Closed Pens</span>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </SidebarGroupLabel>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <SidebarMenu className="mt-2">
                        {closedPens.map((pen) => (
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
                </CollapsibleContent>
            </Collapsible>
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
