"use client";

import { useState } from "react";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { AddTransactionSheet } from "@/components/sheets/add-transaction-sheet";
import { DEFAULT_CATEGORIES, mockTransactions } from "@/constants/data";
import { useGetCategories, useGetTransactions } from "@/lib/queries";

export default function TransactionsPage() {
	const [search, setSearch] = useState("");
	const { data: categories } = useGetCategories();
	const { data: transactions } = useGetTransactions(search);

	const actualCategories = categories?.length ? categories : DEFAULT_CATEGORIES;
	const actualTransactions = transactions?.length
		? transactions
		: mockTransactions;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">
						Transactions
					</h1>
					<p className="text-sm text-slate-500">
						Manage your income and expenses.
					</p>
				</div>
				<AddTransactionSheet categories={actualCategories} />
			</div>

			<div className="grid grid-cols-1 gap-4 lg:gap-6">
				<TransactionList
					transactions={actualTransactions as any}
					categories={actualCategories}
					isDashboard={false}
					search={search}
					onSearchChange={setSearch}
				/>
			</div>
		</div>
	);
}
