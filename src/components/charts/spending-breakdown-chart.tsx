"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";

interface BreakdownData {
	name: string;
	value: number;
	color: string;
}

export function SpendingBreakdownChart({ data }: { data: BreakdownData[] }) {
	const total = data.reduce((acc, curr) => acc + curr.value, 0);

	return (
		<Card className="col-span-1 border-none shadow-md">
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
					Spending Breakdown
				</CardTitle>
			</CardHeader>
			<CardContent className="h-[300px]">
				{data.length === 0 ? (
					<div className="flex items-center justify-center h-full text-slate-500 text-sm">
						No spending data available.
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								paddingAngle={5}
								dataKey="value"
							>
								{data.map((entry, index: number) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<text
								x="50%"
								y="45%"
								textAnchor="middle"
								dominantBaseline="middle"
								className="fill-slate-900 dark:fill-white text-xl font-bold"
							>
								₦{total.toLocaleString()}
							</text>
							<text
								x="50%"
								y="55%"
								textAnchor="middle"
								dominantBaseline="middle"
								className="fill-slate-500 text-xs font-medium"
							>
								Total Spent
							</text>
							<Tooltip
								formatter={(value: number) =>
									`₦${value.toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}`
								}
								contentStyle={{
									borderRadius: "8px",
									border: "none",
									boxShadow:
										"0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
								}}
							/>
							<Legend
								verticalAlign="bottom"
								height={36}
								formatter={(value, entry: any) => (
									<span className="text-slate-600 dark:text-slate-400 font-medium text-sm ml-1">
										{value}
									</span>
								)}
							/>
						</PieChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
}
