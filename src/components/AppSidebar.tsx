import Link from 'next/link';
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
import { LayoutGrid, PlusCircle, BrainCircuit, Box, LifeBuoy, Settings, Spade } from 'lucide-react';
import { getActivePens } from '@/lib/data';
import { Separator } from './ui/separator';

export default async function AppSidebar() {
  const activePens = await getActivePens();

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
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <Link href="/dashboard">
                <LayoutGrid />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="New Pen">
              <Link href="/pens/new">
                <PlusCircle />
                <span>New Pen / Group</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="AI Insights">
              <Link href="/ai-insights">
                <BrainCircuit />
                <span>AI Feeding Insights</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel>Active Pens</SidebarGroupLabel>
          <SidebarMenu>
            {activePens.map((pen) => (
              <SidebarMenuItem key={pen.id}>
                <SidebarMenuButton asChild tooltip={pen.name}>
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
