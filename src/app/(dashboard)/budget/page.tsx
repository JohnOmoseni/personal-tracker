"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/sanity/lib/client";
import {
	USER_BUDGETS_QUERY,
	USER_ALL_TRANSACTIONS_QUERY,
	USER_CATEGORIES_QUERY,
} from "@/lib/sanity.queries";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { DEFAULT_CATEGORIES } from "@/constants/data";
import { Progress } from "@/components/ui/progress";

const mockBudgets = [
	{
		id: "1",
		categoryName: "Housing",
		spent: 1200,
		limit: 1500,
		color: "#3B82F6",
	},
	{
		id: "2",
		categoryName: "Food & Dining",
		spent: 450,
		limit: 500,
		color: "#F59E0B",
	},
	{
		id: "3",
		categoryName: "Transportation",
		spent: 300,
		limit: 250,
		color: "#8B5CF6",
	},
	{
		id: "4",
		categoryName: "Utilities",
		spent: 150,
		limit: 200,
		color: "#10B981",
	},
];

export default function BudgetPage() {
	const { user } = useUser();

	const { data: categories } = useQuery({
		queryKey: ["categories", user?.id],
		queryFn: () =>
			client.fetch(USER_CATEGORIES_QUERY, { clerkUserId: user?.id }),
		enabled: !!user?.id,
	});

	const { data: budgets } = useQuery({
		queryKey: ["budgets", user?.id],
		queryFn: () => client.fetch(USER_BUDGETS_QUERY, { clerkUserId: user?.id }),
		enabled: !!user?.id,
	});

	const { data: transactions } = useQuery({
		queryKey: ["transactions", user?.id],
		queryFn: () =>
			client.fetch(USER_ALL_TRANSACTIONS_QUERY, { clerkUserId: user?.id }),
		enabled: !!user?.id,
	});

	const actualCategories = categories?.length ? categories : DEFAULT_CATEGORIES;
	const isDataLoaded = budgets && transactions;

	let budgetData = mockBudgets;
	let allLimits = 2450;
	let allSpending = 2100;
	let isHealthy = true;

	if (isDataLoaded && budgets.length > 0) {
		const expenses = transactions.filter((t: any) => t.type === "expense");

		budgetData = budgets.map((b: any) => {
			const bSpent = expenses
				.filter((t: any) => t.category?._id === b.category?._id)
				.reduce((sum: number, t: any) => sum + t.amount, 0);

			return {
				id: b._id,
				categoryName: b.category?.name || "Unknown",
				spent: bSpent,
				limit: b.amount,
				color: b.category?.color || "#94a3b8",
			};
		});

		allLimits = budgetData.reduce((sum, b) => sum + b.limit, 0);
		allSpending = budgetData.reduce((sum, b) => sum + b.spent, 0);
		isHealthy = allSpending <= allLimits * 0.9;
	}

	const percentageSpent = allLimits > 0 ? (allSpending / allLimits) * 100 : 0;
	let statusText = "Safe";
	let statusColor = "bg-emerald-500";
	let textColor = "text-emerald-500";

	if (percentageSpent > 90) {
		statusText = "Exceeded";
		statusColor = "bg-rose-500";
		textColor = "text-rose-500";
	} else if (percentageSpent > 75) {
		statusText = "Approaching Limit";
		statusColor = "bg-amber-500";
		textColor = "text-amber-500";
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900 ">
						Budget Simulator
					</h1>
					<p className="text-sm text-slate-500">
						Track your spending limits per category.
					</p>
				</div>
			</div>

			{isDataLoaded && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
						<p className="text-sm font-medium text-slate-500">
							Total Allocated
						</p>
						<div className="mt-2">
							<h2 className="text-3xl font-bold text-slate-900">
								₦
								{allLimits.toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</h2>
							<div className="w-full h-1.5 bg-blue-500 mt-4 rounded-full"></div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-slate-500">
								Actual Spending
							</p>
						</div>
						<div className="mt-2">
							<div className="flex items-center gap-2 mb-4">
								<h2 className="text-3xl font-bold text-slate-900">
									₦
									{allSpending.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</h2>
								<span
									className={`text-xs font-medium px-2 py-0.5 rounded-full ${textColor} bg-slate-100 `}
								>
									{statusText}
								</span>
							</div>
							<Progress
								value={percentageSpent}
								indicatorColor={statusColor}
								className="h-1.5 bg-slate-100"
							/>
						</div>
					</div>

					<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-slate-500">
								Remaining Balance
							</p>
						</div>
						<div className="mt-2">
							<div className="flex items-center gap-2 mb-4">
								<h2 className="text-3xl font-bold text-slate-900">
									₦
									{Math.max(0, allLimits - allSpending).toLocaleString(
										undefined,
										{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
									)}
								</h2>
							</div>
							<div className="flex gap-1 mt-4">
								<div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
								<div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
								<div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
								<div className="h-1.5 flex-[0.5] bg-slate-100  rounded-full"></div>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<BudgetOverview data={budgetData} categories={actualCategories} />
				</div>
				<div className="lg:col-span-1 space-y-6">
					<div
						className={`p-6 rounded-xl border shadow-sm ${
							isHealthy
								? "bg-emerald-50 border-emerald-100 "
								: "bg-rose-50  border-rose-100 "
						}`}
					>
						<h3
							className={`font-semibold mb-2 ${
								isHealthy ? "text-emerald-800" : "text-rose-800 "
							}`}
						>
							Budget Health
						</h3>
						<p
							className={`text-sm ${
								isHealthy ? "text-emerald-600 " : "text-rose-600"
							}`}
						>
							{isHealthy
								? "You are on track this month! Keep managing your expenses closely."
								: "Warning! Your overall spending is approaching or exceeding your allocated limits."}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
