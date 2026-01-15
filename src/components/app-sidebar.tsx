"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Users,
    UserPlus,
    MessageSquare,
    Clock,
    FileText,
    Settings,
    GraduationCap,
    Shield,
    Star,
    LogOut,
    ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    useSidebar,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"


// We need to access the AuthContext. Since it's defined in admin/layout, 
// checking if it's exported or if we need to refactor. 
// Ideally, AppSidebar receives user/logout as props or uses a hook.
// The previous layout exported `useAuth`.


interface NavItem {
    href: string;
    icon: React.ElementType;
    label: string;
    exact?: boolean;
}

interface NavGroup {
    label?: string;
    items: NavItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    navGroups: NavGroup[];
    user?: { name: string; email: string } | null;
    title?: string;
}

export function AppSidebar({ navGroups, user, title = "Zero to Hero", ...props }: AppSidebarProps) {
    const pathname = usePathname()

    const isActive = (href: string, exact = false) => {
        if (exact) return pathname === href
        return pathname.startsWith(href)
    }

    return (
        <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader className="h-16 items-center justify-center">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sky-500 text-sidebar-primary-foreground">
                                    <GraduationCap className="size-4 text-white" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{title}</span>
                                    <span className="truncate text-xs">Portal</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="gap-3">
                {navGroups.map((group, index) => (
                    <SidebarGroup key={group.label || index} className="py-0">
                        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(item.href, item.exact)}
                                            tooltip={item.label}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
