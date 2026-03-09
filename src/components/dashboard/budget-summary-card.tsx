import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BudgetSummaryCard({ budgets, categories, actualTransactions }: { budgets: any[], categories: any[], actualTransactions: any[] }) {
	const totalAllocated = budgets?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;
	
	const budgetedCategoryIds = new Set(
budgets?.map(b => b.category?._ref || b.category?._id).filter(Boolean)
	);

	const currentlySpent = actualTransactions
		?.filter(t => t.type === "expense")
		.filter(t => {
			const catRef = t.category?._ref || t.category?._id;
			return budgetedCategoryIds.has(catRef);
		})
		.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

	const remaining = Math.max(0, totalAllocated - currentlySpent);
	const percentageSpent = totalAllocated > 0 ? (currentlySpent / totalAllocated) * 100 : 0;
	
	let statusColor = "bg-emerald-500";
	if (percentageSpent > 90) statusColor = "bg-rose-500";
	else if (percentageSpent > 75) statusColor = "bg-amber-500";

	return (
<Card className="col-span-1 border-none shadow-md">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
					Budget Overview
					<Link href="/budget">
						<Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700">
							View All
						</Button>
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 pt-2">
					<div className="flex justify-between items-end">
						<div>
							<p className="text-sm font-medium text-slate-500 mb-1">Total Budget</p>
							<h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
								₦{totalAllocated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</h3>
						</div>
						<div className="text-right">
							<p className="text-sm font-medium text-slate-500 mb-1">Remaining</p>
							<p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
								₦{remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</p>
						</div>
					</div>

					<div className="space-y-2 mt-6">
						<div className="flex justify-between text-sm">
							<span className="font-medium text-slate-500">Spent ₦{currentlySpent.toLocaleString()}</span>
							<span className="font-medium text-slate-700">{percentageSpent.toFixed(1)}%</span>
						</div>
						<Progress value={percentageSpent} indicatorColor={statusColor} className="h-2.5 bg-slate-100" />
					</div>
					
					<div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
						<p className="text-xs text-slate-500 text-center">
							{budgets?.length || 0} active categories configured
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
