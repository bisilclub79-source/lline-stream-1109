'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
    LayoutDashboard, 
    Film, 
    ListTree, 
    Users, 
    DollarSign, 
    BarChart,
    Tv,
    Cog,
    FileClock,
    UserPlus,
    Receipt
} from "lucide-react"

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/videos", label: "Video Management", icon: Film },
    { href: "/admin/categories", label: "Category Management", icon: ListTree },
    { href: "/admin/user-signup-info", label: "User Signup Info", icon: UserPlus },
    { href: "/admin/user-video-pricing", label: "Payment History", icon: Receipt },
    { href: "/admin/user-subscription-info", label: "Subscription Info", icon: Users },
    { href: "/admin/pricing", label: "Pricing Policy", icon: DollarSign },
    { href: "/admin/backend-total", label: "Total Watch History", icon: FileClock },
    { href: "/admin/settings", label: "App Settings", icon: Cog },
]

export default function AdminNav() {
    const pathname = usePathname()

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            isActive && "bg-muted text-primary"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
