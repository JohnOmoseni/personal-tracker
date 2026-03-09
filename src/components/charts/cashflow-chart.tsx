"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useMemo, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	format,
	subMonths,
	startOfMonth,
	endOfMonth,
	isWithinInterval,
	startOfYear,
} from "date-fns";
import { formatAmount } from "@/lib/utils";

export function CashFlowChart({ transactions = [] }: { transactions: any[] }) {
	const [timeRange, setTimeRange] = useState("6m");

	const { data, totalBalance, percentageChange } = useMemo(() => {
		const now = new Date();
		let startDate = new Date();

		if (timeRange === "6m") {
			startDate = subMonths(now, 5);
			startDate = startOfMonth(startDate);
		} else if (timeRange === "1y") {
			startDate = subMonths(now, 11);
			startDate = startOfMonth(startDate);
		} else if (timeRange === "ytd") {
			startDate = startOfYear(now);
		}

		const allIncome = transactions
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);
		const allExpense = transactions
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);
		const totalBalance = allIncome - allExpense;

		const currentPeriodData = transactions.filter((t) =>
			isWithinInterval(new Date(t.date), {
				start: startOfMonth(now),
				end: endOfMonth(now),
			}),
		);
		const previousPeriodData = transactions.filter((t) =>
			isWithinInterval(new Date(t.date), {
				start: startOfMonth(subMonths(now, 1)),
				end: endOfMonth(subMonths(now, 1)),
			}),
		);

		const currentBalance = currentPeriodData.reduce(
			(sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
			0,
		);
		const previousBalance = previousPeriodData.reduce(
			(sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
			0,
		);

		let percentageChange = 0;
		if (previousBalance !== 0) {
			percentageChange =
				((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100;
		} else if (currentBalance > 0) {
			percentageChange = 100;
		}

		const filteredTransactions = transactions.filter(
			(t: any) => new Date(t.date) >= startDate,
		);
		const groupedData = filteredTransactions.reduce((acc: any, t: any) => {
			const date = new Date(t.date);
			const monthKey = format(date, "MMM yyyy");
			const displayMonth = format(date, "MMM");

			if (!acc[monthKey]) {
				acc[monthKey] = {
					name: displayMonth,
					sortDate: date,
					income: 0,
					expense: 0,
				};
			}

			if (t.type === "income") acc[monthKey].income += t.amount;
			if (t.type === "expense") acc[monthKey].expense += t.amount;

			return acc;
		}, {});

		let currentMonthIt = new Date(startDate);
		while (currentMonthIt <= now) {
			const monthKey = format(currentMonthIt, "MMM yyyy");
			if (!groupedData[monthKey]) {
				groupedData[monthKey] = {
					name: format(currentMonthIt, "MMM"),
					sortDate: new Date(currentMonthIt),
					income: 0,
					expense: 0,
				};
			}
			currentMonthIt.setMonth(currentMonthIt.getMonth() + 1);
		}

		const chartData = Object.values(groupedData).sort(
			(a: any, b: any) => a.sortDate.getTime() - b.sortDate.getTime(),
		);

		return { data: chartData, totalBalance, percentageChange };
	}, [transactions, timeRange]);

	const isPositiveChange = percentageChange >= 0;

	return (
		<Card className="col-span-1 border-none shadow-md">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 gap-4">
				<div>
					<CardTitle className="text-xl font-bold text-slate-900  flex items-center justify-between">
						Cashflow
					</CardTitle>
					<div className="mt-2 text-sm text-slate-500">Total Balance</div>
					<div className="flex items-center gap-3 mt-1">
						<h2 className="text-3xl font-bold text-slate-90 ">
							{formatAmount(totalBalance)}
						</h2>
						<div
							className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${isPositiveChange ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
						>
							{isPositiveChange ? "↑" : "↓"}{" "}
							{Math.abs(percentageChange).toFixed(1)}%
						</div>
					</div>
				</div>
				<div className="flex items-center gap-4 w-full sm:w-auto self-end sm:self-auto">
					<div className="flex items-center gap-4 text-sm scale-90 sm:scale-100 origin-right">
						<div className="flex items-center gap-2">
							<div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
							<span className="text-slate-500">Expense</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
							<span className="text-slate-500">Income</span>
						</div>
					</div>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-[135px] [&_span]:truncate h-9 bg-white/50 rounded-full border-slate-200  focus:ring-1">
							<SelectValue placeholder="Time Range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="6m">Last 6 Months</SelectItem>
							<SelectItem value="1y">Last Year</SelectItem>
							<SelectItem value="ytd">Year to Date</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[240px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
									<stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
								</linearGradient>
								<linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
									<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#94a3b8", fontSize: 12 }}
								dy={10}
							/>
							<Tooltip
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										return (
											<div className="bg-slate-900 text-white shadow-xl rounded-lg p-3 border border-slate-800">
												<p className="font-semibold text-sm mb-2 opacity-90">
													{label}
												</p>
												<div className="space-y-1.5 flex flex-col">
													{payload.map((entry, index) => (
														<div
															// biome-ignore lint/suspicious/noArrayIndexKey: any
															key={`item-${index}`}
															className="flex items-center gap-2 text-sm"
														>
															<div
																className="w-2 h-2 rounded-full"
																style={{ backgroundColor: entry.color }}
															/>
															<span className="opacity-80 capitalize">
																{entry.name}:
															</span>
															<span className="font-semibold px-2 py-0.5 rounded-md bg-white/10">
																₦
																{Number(entry.value).toLocaleString(undefined, {
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																})}
															</span>
														</div>
													))}
												</div>
											</div>
										);
									}
									return null;
								}}
							/>
							<Area
								type="monotone"
								dataKey="income"
								name="Income"
								stroke="#fbbf24"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#colorIncome)"
							/>
							<Area
								type="monotone"
								dataKey="expense"
								name="Expense"
								stroke="#3b82f6"
								strokeWidth={2}
								fillOpacity={1}
								fill="url(#colorExpense)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
