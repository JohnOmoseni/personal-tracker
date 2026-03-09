"use client";

import { IncomeCard } from "@/components/dashboard/income-card";
import { ExpenseCard } from "@/components/dashboard/expense-card";
import { SpendingBreakdownChart } from "@/components/charts/spending-breakdown-chart";
import { CashFlowChart } from "@/components/charts/cashflow-chart";
import { BudgetSummaryCard } from "@/components/dashboard/budget-summary-card";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { AddTransactionSheet } from "@/components/sheets/add-transaction-sheet";
import { AddCategorySheet } from "@/components/sheets/add-category-sheet";
import {
	DEFAULT_CATEGORIES,
	mockBreakdown,
	mockTransactions,
} from "@/constants/data";
import {
	useGetCategories,
	useGetTransactions,
	useGetBudgets,
} from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

const now = new Date();

const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const previousMonthEnd = new Date(
	now.getFullYear(),
	now.getMonth(),
	0,
	23,
	59,
	59,
);

export default function DashboardPage() {
	const { data: categories, isLoading: isCategoriesLoading } =
		useGetCategories();
	const { data: transactions, isLoading: isTransactionsLoading } =
		useGetTransactions();
	const { data: budgets, isLoading: isBudgetsLoading } = useGetBudgets();

	const isLoading =
		isCategoriesLoading || isTransactionsLoading || isBudgetsLoading;

	const actualCategories = categories?.length ? categories : DEFAULT_CATEGORIES;
	const actualTransactions = transactions?.length
		? transactions
		: mockTransactions;

	const currentMonthTransactions = actualTransactions.filter(
		(t: any) => new Date(t.date) >= currentMonthStart,
	);
	const currentIncome = currentMonthTransactions
		.filter((t: any) => t.type === "income")
		.reduce((sum: number, t: any) => sum + t.amount, 0);
	const currentExpense = currentMonthTransactions
		.filter((t: any) => t.type === "expense")
		.reduce((sum: number, t: any) => sum + t.amount, 0);

	const previousMonthTransactions = actualTransactions.filter((t: any) => {
		const d = new Date(t.date);
		return d >= previousMonthStart && d <= previousMonthEnd;
	});
	const previousIncome = previousMonthTransactions
		.filter((t: any) => t.type === "income")
		.reduce((sum: number, t: any) => sum + t.amount, 0);
	const previousExpense = previousMonthTransactions
		.filter((t: any) => t.type === "expense")
		.reduce((sum: number, t: any) => sum + t.amount, 0);

	const incomeChange =
		previousIncome === 0
			? currentIncome > 0
				? 100
				: 0
			: ((currentIncome - previousIncome) / previousIncome) * 100;

	const expenseChange =
		previousExpense === 0
			? currentExpense > 0
				? 100
				: 0
			: ((currentExpense - previousExpense) / previousExpense) * 100;

	const totalIncome = actualTransactions
		.filter((t: any) => t.type === "income")
		.reduce((sum: number, t: any) => sum + t.amount, 0);

	const totalExpense = actualTransactions
		.filter((t: any) => t.type === "expense")
		.reduce((sum: number, t: any) => sum + t.amount, 0);

	const expensesByCategory = actualTransactions
		.filter((t: any) => t.type === "expense")
		.reduce(
			(acc: any, t: any) => {
				const cat = actualCategories.find(
					(c: any) => c.id === t.category?._ref,
				);

				const catName = cat?.name || "Uncategorized";
				const catColor = cat?.color || "#94a3b8";
				if (!acc[catName]) {
					acc[catName] = { name: catName, value: 0, color: catColor };
				}
				acc[catName].value += t.amount;
				return acc;
			},
			{} as Record<string, { name: string; value: number; color: string }>,
		);

	const breakdownData = Object.values(expensesByCategory).length
		? Object.values(expensesByCategory)
		: mockBreakdown;

	const getLocalDateStr = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(now);
		d.setDate(d.getDate() - (6 - i));
		return getLocalDateStr(d);
	});

	const incomeChartData = last7Days.map((dateStr) => {
		const total = actualTransactions
			.filter(
				(t: any) =>
					t.type === "income" && getLocalDateStr(new Date(t.date)) === dateStr,
			)
			.reduce((sum: number, t: any) => sum + t.amount, 0);
		return { value: total };
	});

	const expenseChartData = last7Days.map((dateStr) => {
		const total = actualTransactions
			.filter(
				(t: any) =>
					t.type === "expense" && getLocalDateStr(new Date(t.date)) === dateStr,
			)
			.reduce((sum: number, t: any) => sum + t.amount, 0);
		return { value: total };
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">
						Overview
					</h1>
					<p className="text-sm text-slate-500">
						Your financial summary for this month.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<AddCategorySheet />
					<AddTransactionSheet categories={actualCategories} />
				</div>
			</div>

			{isLoading ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
						<Skeleton className="h-[140px] w-full rounded-xl" />
						<Skeleton className="h-[140px] w-full rounded-xl" />
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
						<Skeleton className="h-[400px] w-full rounded-xl" />
						<Skeleton className="h-[400px] w-full rounded-xl" />
					</div>
				</>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
						<IncomeCard
							amount={currentIncome || totalIncome || 0}
							percentageChange={Math.round(incomeChange)}
							chartData={incomeChartData}
						/>
						<ExpenseCard
							amount={currentExpense || totalExpense || 0}
							percentageChange={Math.round(expenseChange)}
							chartData={expenseChartData}
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
						<SpendingBreakdownChart data={breakdownData as any} />
						<BudgetSummaryCard
							budgets={budgets || []}
							actualTransactions={actualTransactions}
						/>
					</div>

					<div className="grid grid-cols-1">
						<CashFlowChart transactions={actualTransactions} />
					</div>

					<div className="grid grid-cols-1 gap-4 lg:gap-6">
						<TransactionList
							transactions={actualTransactions as any}
							categories={actualCategories}
							isDashboard
						/>
					</div>
				</>
			)}
		</div>
	);
}
