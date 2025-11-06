'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Film, ListTree, Users, DollarSign, BarChart } from "lucide-react"

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/videos", label: "Videos", icon: Film },
    { href: "/admin/categories", label: "Categories", icon: ListTree },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
]

export default function AdminNav() {
    const pathname = usePathname()

    return (
        <nav className="flex flex-col gap-2 p-4">
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
