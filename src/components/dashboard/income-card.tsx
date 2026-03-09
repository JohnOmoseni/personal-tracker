"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Wallet } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
	{ value: 400 },
	{ value: 300 },
	{ value: 500 },
	{ value: 450 },
	{ value: 600 },
	{ value: 550 },
	{ value: 700 },
];

export function IncomeCard({
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
			transition={{ duration: 0.4, ease: "easeOut" }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
		>
			<Card className="relative overflow-hidden border-none shadow-md bg-linear-to-br from-emerald-50 to-emerald-100/50">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
					<CardTitle className="text-sm font-medium text-emerald-800 flex items-center gap-2">
						<div className="p-2 bg-emerald-100 rounded-lg">
							<Wallet className="w-4 h-4 text-emerald-600" />
						</div>
						Total Income
					</CardTitle>
					<div className="flex items-center space-x-1 text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
						<ArrowUpRight className="w-3 h-3" />
						<span>
							{percentageChange > 0 ? "+" : ""}
							{percentageChange}%
						</span>
					</div>
				</CardHeader>
				<CardContent className="relative z-10">
					<div className="text-3xl font-bold text-emerald-950 dark:text-emerald-50">
						₦
						{amount.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</div>
					<p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">
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
								<linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
									<stop offset="100%" stopColor="#10b981" stopOpacity={0} />
								</linearGradient>
							</defs>
							<Area
								type="monotone"
								dataKey="value"
								stroke="#10b981"
								strokeWidth={2}
								fill="url(#incomeGradient)"
								isAnimationActive={true}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</Card>
		</motion.div>
	);
}
