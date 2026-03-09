"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Receipt, Wallet, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Sidebar() {
	const pathname = usePathname();
	const routes = [
		{
			href: "/",
			label: "Dashboard",
			icon: LayoutDashboard,
			active: pathname === "/",
		},
		{
			href: "/transactions",
			label: "Transactions",
			icon: Receipt,
			active: pathname === "/transactions",
		},
		{
			href: "/budget",
			label: "Budget",
			icon: Wallet,
			active: pathname === "/budget",
		},
	];

	const NavLinks = ({ onClick }: { onClick?: () => void }) => (
		<nav className="flex-1 py-6 px-4 space-y-2">
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					onClick={onClick}
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
						route.active
							? "bg-primary/10 text-primary"
							: "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-50 dark:hover:bg-slate-800",
					)}
				>
					<route.icon className="h-5 w-5" />
					{route.label}
				</Link>
			))}
		</nav>
	);

	return (
		<aside className="hidden md:flex flex-col w-64 border-r bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
			<div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
				<h1 className="font-bold text-xl tracking-tight text-primary">
					Tracker
				</h1>
			</div>
			<NavLinks />
		</aside>
	);
}

export function MobileSidebar() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
				>
					<Menu className="h-6 w-6" />
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="w-64 p-0">
				<div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
					<h1 className="font-bold text-xl tracking-tight text-primary">
						Tracker
					</h1>
				</div>
				<SidebarContent onClick={() => setOpen(false)} />
			</SheetContent>
		</Sheet>
	);
}

// Extract content to reuse
function SidebarContent({ onClick }: { onClick?: () => void }) {
	const pathname = usePathname();
	const routes = [
		{
			href: "/",
			label: "Dashboard",
			icon: LayoutDashboard,
			active: pathname === "/",
		},
		{
			href: "/transactions",
			label: "Transactions",
			icon: Receipt,
			active: pathname === "/transactions",
		},
		{
			href: "/budget",
			label: "Budget",
			icon: Wallet,
			active: pathname === "/budget",
		},
	];

	return (
		<nav className="flex-1 py-6 px-4 space-y-2">
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					onClick={onClick}
					className={cn(
						"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
						route.active
							? "bg-primary/10 text-primary"
							: "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-slate-50 dark:hover:bg-slate-800",
					)}
				>
					<route.icon className="h-5 w-5" />
					{route.label}
				</Link>
			))}
		</nav>
	);
}
