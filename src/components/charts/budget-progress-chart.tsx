"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "@/lib/actions/sanity.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BudgetData {
	id: string;
	categoryName: string;
	spent: number;
	limit: number;
	color: string;
}

export function BudgetProgressChart({ data }: { data: BudgetData[] }) {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await deleteDocument(id);
			if (!res.success) throw new Error("Failed to delete budget");
			return res;
		},
		onSuccess: () => {
			toast.success("Budget deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["budgets"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
		},
		onError: () => {
			toast.error("Failed to delete budget");
		},
	});

	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center py-8 text-slate-500 text-sm">
				No budget data available.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{data.map((item, index) => {
				const percentage = Math.min((item.spent / item.limit) * 100, 100);

				let statusColor = "bg-emerald-500";
				if (percentage >= 100) statusColor = "bg-rose-500";
				else if (percentage >= 90) statusColor = "bg-orange-500";
				else if (percentage >= 70) statusColor = "bg-amber-500";

				return (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
						className="space-y-2 group"
					>
						<div className="flex justify-between items-end">
							<div>
								<span className="font-semibold text-sm text-slate-900  flex items-center gap-2">
									<div
										className="w-3 h-3 rounded-full shadow-sm"
										style={{ backgroundColor: item.color }}
									/>
									{item.categoryName}
								</span>
								<span className="text-xs text-slate-500 mt-1 block">
									₦{item.spent.toLocaleString()} spent out of ₦
									{item.limit.toLocaleString()}
								</span>
							</div>
							<div className="flex flex-col items-end gap-1">
								<span
									className={cn(
										"text-sm font-bold",
										Math.round(percentage) >= 100
											? "text-rose-500"
											: "text-slate-700",
									)}
								>
									{percentage.toFixed(0)}%
								</span>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										if (
											window.confirm(
												"Are you sure you want to delete this budget?",
											)
										) {
											deleteMutation.mutate(item.id);
										}
									}}
									disabled={deleteMutation.isPending}
									className="text-rose-500 hover:text-rose-700 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
									title="Delete budget"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</button>
							</div>
						</div>
						<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden ring-1 ring-inset ring-slate-200/50">
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${percentage}%` }}
								transition={{
									duration: 1,
									ease: "easeOut",
									delay: index * 0.1 + 0.2,
								}}
								className={cn(
									"h-full rounded-full transition-all",
									statusColor,
								)}
								style={{
									backgroundColor: percentage < 70 ? item.color : undefined,
								}}
							/>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
