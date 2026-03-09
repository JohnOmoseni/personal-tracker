import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import {
	format,
	subDays,
	isWithinInterval,
	startOfDay,
	endOfDay,
} from "date-fns";

export function WeeklyTrends({ transactions = [] }: { transactions: any[] }) {
	const data = useMemo(() => {
		const now = new Date();
		const days = Array.from({ length: 7 }).map((_, i) => subDays(now, 6 - i));

		const expenses = transactions.filter((t) => t.type === "expense");

		return days.map((day) => {
			const dayExpenses = expenses.filter((t: any) =>
				isWithinInterval(new Date(t.date), {
					start: startOfDay(day),
					end: endOfDay(day),
				}),
			);

			const total = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
			const isToday = format(day, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

			return {
				day: isToday ? "Today" : format(day, "EEE"), // Mon, Tue, etc.
				fullDate: format(day, "MMM d"),
				total,
				isToday,
			};
		});
	}, [transactions]);

	const maxAmount = Math.max(...data.map((d) => d.total), 1); // Avoid division by zero

	return (
		<Card className="col-span-1 border-none shadow-md h-full flex flex-col">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
					Weekly Trends
				</CardTitle>
				<p className="text-sm text-slate-500">
					Your spending over the last 7 days
				</p>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col justify-end pt-4">
				<div className="flex items-end justify-between gap-1 sm:gap-2 h-[120px] mb-2 relative">
					{/* Background grid lines */}
					<div className="absolute inset-x-0 bottom-0 border-b border-dashed border-slate-200 dark:border-slate-800" />
					<div className="absolute inset-x-0 bottom-1/2 border-b border-dashed border-slate-200 dark:border-slate-800" />
					<div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200 dark:border-slate-800" />

					{/* Bars */}
					{data.map((item, idx) => {
						const heightPercentage = (item.total / maxAmount) * 100;

						return (
							<div
								key={item.day + idx}
								className="flex flex-col items-center flex-1 z-10 group"
							>
								<div className="relative w-full flex justify-center h-full items-end pb-1">
									{/* Tooltip on hover */}
									<div className="absolute -top-8 bg-slate-900 text-white text-[10px] sm:text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
										₦{item.total.toLocaleString()}
									</div>
									<div
										className={`w-full max-w-[32px] rounded-sm transition-all duration-500 ${item.isToday ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"}`}
										style={{ height: `${Math.max(heightPercentage, 2)}%` }}
									/>
								</div>
								<span
									className={`text-[10px] sm:text-xs mt-2 ${item.isToday ? "font-bold text-slate-900 dark:text-slate-100" : "text-slate-500"}`}
								>
									{item.day}
								</span>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
