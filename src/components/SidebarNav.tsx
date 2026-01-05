'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  PlusCircle,
  Box,
  LayoutGrid,
  Wheat,
  CookingPot,
  User,
  HeartPulse,
  Settings,
} from 'lucide-react';
import { Separator } from './ui/separator';
import type { Pen } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
    LayoutGrid,
    Wheat,
    CookingPot,
    User,
    HeartPulse,
    Settings,
};


type MenuItem = {
    href: string;
    label: string;
    iconName: string;
    tooltip: string;
}

type SidebarNavProps = {
    menuItems?: MenuItem[];
    activePens?: Pen[];
    closedPens?: Pen[];
    isFooter?: boolean;
}

export default function SidebarNav({ menuItems, activePens, closedPens, isFooter }: SidebarNavProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
        const Icon = iconMap[item.iconName];
        const isActive = (item.href !== '/dashboard' && pathname.startsWith(item.href)) || pathname === item.href;
        return (
        <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
            asChild
            tooltip={item.tooltip}
            isActive={isActive}
            >
            <Link href={item.href} onClick={handleLinkClick}>
                {Icon && <Icon />}
                <span>{item.label}</span>
            </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
        )
    });
  }

  if (isFooter && menuItems) {
    return (
       <SidebarMenu className="mt-auto">
          {renderMenuItems(menuItems)}
        </SidebarMenu>
    )
  }

  return (
    <>
      {menuItems && <SidebarMenu>{renderMenuItems(menuItems)}</SidebarMenu>}
      
      {!isFooter && (
        <>
            <Separator className="my-4" />
            <SidebarGroup>
                <SidebarGroupLabel>
                <span>Active Pens</span>
                </SidebarGroupLabel>
                <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    tooltip={'New Pen'}
                    isActive={pathname === '/pens/new'}
                    >
                    <Link href={'/pens/new'} onClick={handleLinkClick}>
                        <PlusCircle />
                        <span>New Pen</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {activePens && activePens.map((pen) => (
                    <SidebarMenuItem key={pen.id}>
                    <SidebarMenuButton
                        asChild
                        tooltip={pen.name}
                        isActive={pathname.startsWith(`/pens/${pen.id}`)}
                    >
                        <Link href={`/pens/${pen.id}`} onClick={handleLinkClick}>
                        <Box />
                        <span>{pen.name}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>

            {closedPens && closedPens.length > 0 && (
                <SidebarGroup>
                <SidebarGroupLabel>
                    <span>Closed Pens</span>
                </SidebarGroupLabel>
                <SidebarMenu className="mt-2">
                    {closedPens.map((pen) => (
                    <SidebarMenuItem key={pen.id}>
                        <SidebarMenuButton
                        asChild
                        tooltip={pen.name}
                        isActive={pathname.startsWith(`/pens/${pen.id}`)}
                        >
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
        </>
      )}
    </>
  );
}
