"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetProgressChart } from "@/components/charts/budget-progress-chart";
import { AddBudgetSheet } from "@/components/sheets/add-budget-sheet";

export function BudgetOverview({
	data,
	categories = [],
}: {
	data: any[];
	categories?: any[];
}) {
	return (
		<Card className="col-span-1 border-none shadow-md">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-lg font-semibold text-slate-900">
					Budget Overview
				</CardTitle>
				<AddBudgetSheet categories={categories} />
			</CardHeader>
			<CardContent>
				<BudgetProgressChart data={data} />
			</CardContent>
		</Card>
	);
}
