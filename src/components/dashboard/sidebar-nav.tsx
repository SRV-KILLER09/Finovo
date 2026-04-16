
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Sparkles, FileText, CreditCard, Settings, Gem, Building2, ShieldAlert, Calculator, Scale, Bitcoin, AreaChart, FileSignature, Target, Lightbulb, Code } from "lucide-react";
import { useParentalLock } from "@/contexts/parental-lock-context";

const allNavItems = [
    { id: 'dashboard', href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: 'pay', href: "/dashboard/pay", icon: CreditCard, label: "Pay" },
    { id: 'bill-splitter', href: "/dashboard/bill-splitter", icon: Calculator, label: "Bill Splitter" },
    { id: 'reports', href: "/dashboard/reports", icon: FileText, label: "Reports" },
    { id: 'itr-filing', href: "/dashboard/itr-filing", icon: FileSignature, label: "ITR Filing" },
    { id: 'digigold', href: "/dashboard/digigold", icon: Gem, label: "DigiGold" },
    { id: 'digibitcoin', href: "/dashboard/digibitcoin", icon: Bitcoin, label: "DigiBitcoin" },
    { id: 'digistock', href: "/dashboard/digistock", icon: AreaChart, label: "DigiStock" },
    { id: 'bank-simulator', href: "/dashboard/bank-simulator", icon: Building2, label: "Bank Simulator" },
    { id: 'scam-hunter', href: "/dashboard/scam-hunter", icon: ShieldAlert, label: "Scam Hunter" },
    { id: 'policy-challenges', href: "/dashboard/policy-challenges", icon: Scale, label: "Policy Challenges" },
    { id: 'developer', href: "/dashboard/developer", icon: Code, label: "Developer Page" },
    { id: 'settings', href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function SidebarNav() {
    const pathname = usePathname();
    const { enabledFeatures } = useParentalLock();

    const navItems = allNavItems.filter(item => enabledFeatures[item.id]);

    return (
        <nav className="flex flex-col items-start gap-2 px-2 text-sm font-medium lg:px-4">
            {navItems.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary dark:hover:text-primary-foreground dark:text-muted-foreground",
                        pathname === item.href && "bg-secondary text-primary dark:text-primary-foreground font-semibold"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}
