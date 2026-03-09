"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, Receipt } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
	{ value: 300 },
	{ value: 400 },
	{ value: 350 },
	{ value: 600 },
	{ value: 500 },
	{ value: 700 },
	{ value: 650 },
];

export function ExpenseCard({
	amount = 0,
	percentageChange = 0,
}: {
	amount?: number;
	percentageChange?: number;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
		>
			<Card className="relative overflow-hidden border-none shadow-md bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/10">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
					<CardTitle className="text-sm font-medium text-rose-800 dark:text-rose-400 flex items-center gap-2">
						<div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
							<Receipt className="w-4 h-4 text-rose-600 dark:text-rose-400" />
						</div>
						Total Expenses
					</CardTitle>
					<div className="flex items-center space-x-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full">
						<ArrowDownRight className="w-3 h-3" />
						<span>
							{percentageChange > 0 ? "+" : ""}
							{percentageChange}%
						</span>
					</div>
				</CardHeader>
				<CardContent className="relative z-10">
					<div className="text-3xl font-bold text-rose-950 dark:text-rose-50">
						₦
						{amount.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</div>
					<p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1 font-medium">
						vs last month
					</p>
				</CardContent>
				<div className="absolute bottom-0 left-0 right-0 h-24 opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient
									id="expenseGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor="#e11d48" stopOpacity={0.4} />
									<stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
								</linearGradient>
							</defs>
							<Area
								type="monotone"
								dataKey="value"
								stroke="#e11d48"
								strokeWidth={2}
								fill="url(#expenseGradient)"
								isAnimationActive={true}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</Card>
		</motion.div>
	);
}
