"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/sanity/lib/client";
import {
	USER_ALL_TRANSACTIONS_QUERY,
	USER_CATEGORIES_QUERY,
	USER_BUDGETS_QUERY,
} from "@/lib/sanity.queries";

export const useGetCategories = () => {
	const { user } = useUser();

	return useQuery({
		queryKey: ["categories", user?.id],
		queryFn: () =>
			client.fetch(USER_CATEGORIES_QUERY, { clerkUserId: user?.id }),
		enabled: !!user?.id,
	});
};

export const useGetTransactions = (search: string = "") => {
	const { user } = useUser();

	return useQuery({
		queryKey: ["transactions", user?.id, search],
		queryFn: () =>
			client.fetch(USER_ALL_TRANSACTIONS_QUERY, {
				clerkUserId: user?.id,
				search,
			}),
		enabled: !!user?.id,
	});
};

export const useGetBudgets = () => {
	const { user } = useUser();

	return useQuery({
		queryKey: ["budgets", user?.id],
		queryFn: () => client.fetch(USER_BUDGETS_QUERY, { clerkUserId: user?.id }),
		enabled: !!user?.id,
	});
};
