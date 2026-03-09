"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { createTransaction } from "@/lib/actions/sanity.actions";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InputField, AmountInputField } from "@/components/ui/customs/fields";
import { DatePickerField } from "@/components/ui/customs/date_picker_field";
import { useState } from "react";
import { toast } from "sonner";
import { typeOptions } from "@/constants/data";
import { SelectFormField } from "@/components/ui/customs/custom_select";

const transactionSchema = z.object({
	amount: z.coerce.number().positive("Amount must be positive"),
	type: z.enum(["income", "expense"]),
	categoryId: z.string().min(1, "Please select a category"),
	description: z.string().optional(),
	date: z.date(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function AddTransactionSheet({
	categories = [],
}: {
	categories?: any[];
}) {
	const { user } = useUser();
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ categoryId, ...data }: TransactionFormValues) => {
			if (!user?.id) throw new Error("Not authenticated");
			return createTransaction({
				...data,
				clerkUserId: user.id,
				date: data.date.toISOString(),
				category: {
					_type: "reference",
					_ref: categoryId,
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.success("Transaction added successfully!");
			setOpen(false);
			form.reset();
		},
		onError: () => {
			toast.error("Failed to add transaction");
		},
	});

	const form = useForm({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			type: "expense",
			description: "",
			date: new Date(),
		},
	});

	const categoryOptions = categories.map((c) => ({
		label: c.name,
		value: c._id || c.id,
	}));

	const onSubmit = (data: TransactionFormValues) => {
		if (!user) {
			toast.error("You must be logged in to add a transaction.");
			return;
		}
		mutation.mutate(data);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					title="add-transaction"
					className="gap-2 shadow-sm rounded-full sm:rounded-none fixed bottom-6 right-6 sm:static h-14 w-14 sm:h-10 sm:w-auto p-0 sm:px-4 sm:py-2 z-50"
				>
					<Plus className="size-8 sm:h-4 sm:w-4" />
					<span className="hidden sm:inline">Add Transaction</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
				<SheetHeader className="mb-5">
					<SheetTitle className="text-xl">Add New Transaction</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex-1 flex flex-col h-[calc(100vh-100px)]"
					>
						<div className="space-y-5 px-4 overflow-y-auto flex-1 pb-6">
							<SelectFormField
								control={form.control}
								name="type"
								label="Transaction Type"
								options={typeOptions}
							/>
							<Controller
								control={form.control}
								name="amount"
								render={({ field }) => (
									<AmountInputField
										label="Amount"
										name={field.name}
										value={field.value as number}
										onChange={field.onChange}
										unit="₦"
									/>
								)}
							/>
							<SelectFormField
								control={form.control}
								name="categoryId"
								label="Category"
								placeholder="Select a category"
								options={categoryOptions}
							/>
							<DatePickerField
								control={form.control}
								name="date"
								label="Date"
							/>
							<Controller
								control={form.control}
								name="description"
								render={({ field }) => (
									<InputField
										label="Description (Optional)"
										name={field.name}
										value={field.value}
										onChange={field.onChange}
										placeholder="e.g. Groceries at Whole Foods"
									/>
								)}
							/>
						</div>
						<SheetFooter className="mt-auto border-t">
							<Button
								type="submit"
								disabled={mutation.isPending}
								className="w-full shadow-sm"
							>
								{mutation.isPending ? "Saving..." : "Save Transaction"}
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
