"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	ArrowDownRight,
	ArrowUpRight,
	HelpCircle,
	Search,
	ChevronDown,
	Trash2,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDocument } from "@/lib/actions/sanity.actions";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TransactionListProps {
	transactions: Transaction[];
	categories: any[];
	isDashboard?: boolean;
}

const INITIAL_LOAD_COUNT = 10;

export function TransactionList({
	transactions = [],
	categories = [],
	isDashboard = false,
}: TransactionListProps) {
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortOrder, setSortOrder] = useState("newest");
	const [amountFilter, setAmountFilter] = useState("all");
	const [displayedCount, setDisplayedCount] = useState(INITIAL_LOAD_COUNT);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await deleteDocument(id);
			if (!res.success) throw new Error("Failed to delete transaction");
			return res;
		},
		onSuccess: () => {
			toast.success("Transaction deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
		},
		onError: () => {
			toast.error("Failed to delete transaction");
		},
	});

	const getCategory = (ref?: string) =>
		categories.find((c) => c._id === ref || c.id === ref);

	const getIcon = (iconName: string) => {
		// @ts-ignore
		const Icon = LucideIcons[iconName] || HelpCircle;
		return Icon;
	};

	const filteredAndSorted = useMemo(() => {
		let result = [...transactions];

		const categoryFinder = (ref?: string) =>
			categories.find((c) => c._id === ref || c.id === ref);

		if (search) {
			result = result.filter(
				(t) =>
					t.description?.toLowerCase().includes(search.toLowerCase()) ||
					categoryFinder(t.category?._ref)
						?.name.toLowerCase()
						.includes(search.toLowerCase()),
			);
		}

		if (selectedCategory !== "all") {
			result = result.filter((t) => t.category?._ref === selectedCategory);
		}

		if (amountFilter !== "all") {
			if (amountFilter === "under50")
				result = result.filter((t) => t.amount < 50);
			if (amountFilter === "50to200")
				result = result.filter((t) => t.amount >= 50 && t.amount <= 200);
			if (amountFilter === "over200")
				result = result.filter((t) => t.amount > 200);
		}

		result.sort((a, b) => {
			if (sortOrder === "newest")
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			if (sortOrder === "oldest")
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			if (sortOrder === "highest") return b.amount - a.amount;
			if (sortOrder === "lowest") return a.amount - b.amount;
			return 0;
		});

		return result;
	}, [
		transactions,
		search,
		selectedCategory,
		sortOrder,
		amountFilter,
		categories,
	]);

	const displayedTransactions = isDashboard
		? filteredAndSorted.slice(0, 5)
		: filteredAndSorted.slice(0, displayedCount);

	const hasMore =
		!isDashboard && displayedTransactions.length < filteredAndSorted.length;

	const groupedTransactions = useMemo(() => {
		if (isDashboard) return { Recent: displayedTransactions };

		const formatGroupDate = (dateString: string) => {
			const date = new Date(dateString);
			const today = new Date();
			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);

			if (date.toDateString() === today.toDateString()) return "Today";
			if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

			const showYear = date.getFullYear() !== today.getFullYear();
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: showYear ? "numeric" : undefined,
			});
		};

		return displayedTransactions.reduce(
			(acc, t) => {
				const group = formatGroupDate(t.date);
				if (!acc[group]) acc[group] = [];
				acc[group].push(t);
				return acc;
			},
			{} as Record<string, Transaction[]>,
		);
	}, [displayedTransactions, isDashboard]);

	return (
		<Card className="col-span-1 border-none shadow-md flex flex-col h-full">
			<CardHeader className="flex flex-col space-y-4 pb-4">
				<CardTitle className="text-lg w-full flex items-center justify-between gap-3 font-semibold text-slate-900">
					{isDashboard ? "Recent Transactions" : "All Transactions"}
					{isDashboard && (
						<Link href="/transactions">
							<Button
								variant="ghost"
								size="sm"
								className="h-8 text-xs text-blue-600 hover:text-blue-700"
							>
								View All
							</Button>
						</Link>
					)}
				</CardTitle>

				{!isDashboard && (
					<div className="flex items-start justify-between w-full gap-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
							<Input
								placeholder="Search..."
								className="pl-9 h-10 border-slate-200 dark:border-slate-800"
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setDisplayedCount(INITIAL_LOAD_COUNT);
								}}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							<Select
								value={selectedCategory}
								onValueChange={(val) => {
									setSelectedCategory(val);
									setDisplayedCount(INITIAL_LOAD_COUNT);
								}}
							>
								<SelectTrigger className="h-10 border-slate-200 dark:border-slate-800">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									{categories.map((c) => (
										<SelectItem key={c._id || c.id} value={c._id || c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={amountFilter}
								onValueChange={(val) => {
									setAmountFilter(val);
									setDisplayedCount(INITIAL_LOAD_COUNT);
								}}
							>
								<SelectTrigger className="h-10 border-slate-200 dark:border-slate-800">
									<SelectValue placeholder="Amount Filter" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Any Amount</SelectItem>
									<SelectItem value="under50">Under ₦50</SelectItem>
									<SelectItem value="50to200">₦50 - ₦200</SelectItem>
									<SelectItem value="over200">Over ₦200</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={sortOrder}
								onValueChange={(val) => {
									setSortOrder(val);
									setDisplayedCount(INITIAL_LOAD_COUNT);
								}}
							>
								<SelectTrigger className="h-10 border-slate-200 dark:border-slate-800">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="newest">Newest First</SelectItem>
									<SelectItem value="oldest">Oldest First</SelectItem>
									<SelectItem value="highest">Highest Amount</SelectItem>
									<SelectItem value="lowest">Lowest Amount</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				)}
			</CardHeader>
			<CardContent className="flex-1 flex flex-col">
				<div className="space-y-6 flex-1">
					{Object.entries(groupedTransactions).map(([group, trans]) => (
						<div key={group} className="space-y-3">
							{!isDashboard && (
								<h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
									{group}
								</h4>
							)}
							{trans.map((t, i) => {
								const cat = getCategory(
									t.category?._ref || (t.category as any)?._id,
								);
								const Icon = cat ? getIcon(cat.icon) : HelpCircle;
								const isIncome = t.type === "income";

								return (
									<motion.div
										key={t._id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3, delay: i * 0.05 }}
										className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group"
									>
										<div className="flex items-center gap-4">
											<div
												className="p-3 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
												style={{
													backgroundColor: cat ? `${cat.color}20` : "#e2e8f0",
													color: cat ? cat.color : "#64748b",
												}}
											>
												<Icon className="w-5 h-5" />
											</div>
											<div>
												<p className="font-semibold text-sm text-slate-900">
													{t.description || cat?.name || "Unknown"}
												</p>
												<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
													{new Date(t.date).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</p>
											</div>
										</div>
										<div className="flex flex-col items-end gap-1">
											<div
												className={`flex items-center gap-1 font-semibold ${
													isIncome ? "text-emerald-600" : "text-slate-900"
												}`}
											>
												{isIncome ? (
													<ArrowUpRight className="w-4 h-4" />
												) : (
													<ArrowDownRight className="w-4 h-4 text-rose-500" />
												)}
												₦
												{t.amount.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2,
												})}
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													if (
														window.confirm(
															"Are you sure you want to delete this transaction?",
														)
													) {
														deleteMutation.mutate(t._id);
													}
												}}
												disabled={deleteMutation.isPending}
											>
												<Trash2 className="w-3 h-3 mr-1" /> Delete
											</Button>
										</div>
									</motion.div>
								);
							})}
						</div>
					))}

					{displayedTransactions.length === 0 && (
						<div className="text-center py-12 text-slate-500 text-sm">
							No transactions found matching your criteria.
						</div>
					)}
				</div>

				{!isDashboard && hasMore && (
					<div className="flex justify-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
						<Button
							variant="outline"
							className="w-full sm:w-auto"
							onClick={() =>
								setDisplayedCount((prev: number) => prev + INITIAL_LOAD_COUNT)
							}
						>
							Load More Transactions
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
