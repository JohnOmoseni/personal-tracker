"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { createCategory } from "@/lib/actions/sanity.actions";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InputField } from "@/components/ui/customs/fields";
import { useState } from "react";
import { toast } from "sonner";
import { typeOptions } from "@/constants/data";
import { Label } from "../ui/label";
import { Form } from "@/components/ui/form";
import SelectField from "../ui/customs/custom_select";

const categorySchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.nonempty("Name is required"),
	type: z.enum(["income", "expense"]),
	color: z.string().min(4, "Please enter a valid hex color"),
	icon: z.string().min(1, "Please enter an icon name (e.g., Home)"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function AddCategorySheet() {
	const [open, setOpen] = useState(false);
	const { user } = useUser();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: CategoryFormValues) => {
			if (!user?.id) throw new Error("Not authenticated");
			return createCategory({
				...data,
				clerkUserId: user.id,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success("Category created successfully!");
			setOpen(false);
			form.reset();
		},
		onError: () => {
			toast.error("Failed to create category");
		},
	});

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			type: "expense",
			color: "#3B82F6",
			icon: "Circle",
		},
	});

	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = form;

	const onSubmit = (data: CategoryFormValues) => {
		try {
			if (!user) {
				toast.error("You must be logged in to create a category.");
				return;
			}
			mutation.mutate(data);
		} catch (error) {
			toast.error("Failed to create category");
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					title="add-category"
					variant="outline"
					className="gap-1 bg-white"
				>
					<Plus className="h-4 w-4" />
					<span className="hidden sm:inline">Add Category</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
				<SheetHeader className="mb-5">
					<SheetTitle className="text-xl">Create New Category</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex-1 flex flex-col h-[calc(100vh-100px)]"
					>
						<div className="space-y-5 px-4 overflow-y-auto flex-1 pb-6">
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<div>
										<InputField
											label="Category Name"
											name={field.name}
											value={field.value}
											onChange={field.onChange}
											placeholder="e.g. Subscriptions"
										/>
										{errors.name?.message && (
											<p className="error-msg">{errors.name?.message}</p>
										)}
									</div>
								)}
							/>
							<Controller
								control={control}
								name="type"
								render={({ field }) => (
									<div>
										<SelectField
											label="Type"
											name={field.name}
											value={field.value}
											onChange={field.onChange}
											triggerText="Select Type"
											content={typeOptions}
										/>
										{errors.type?.message && (
											<p className="error-msg">{errors.type?.message}</p>
										)}
									</div>
								)}
							/>
							<Controller
								control={control}
								name="icon"
								render={({ field }) => (
									<div>
										<InputField
											label="Lucide Icon Name"
											name={field.name}
											value={field.value}
											onChange={field.onChange}
											placeholder="e.g. Home, Gamepad2"
										/>
										{errors.icon?.message && (
											<p className="error-msg">{errors.icon?.message}</p>
										)}
									</div>
								)}
							/>
							<Controller
								control={control}
								name="color"
								render={({ field }) => (
									<div>
										<div className="flex flex-col gap-3">
											<Label className="">Color (Hex)</Label>
											<div className="flex gap-4 items-center">
												<input
													type="color"
													className="w-12 h-12 rounded cursor-pointer"
													value={field.value}
													onChange={field.onChange}
												/>
												<InputField
													className="flex-1"
													name={field.name}
													value={field.value}
													onChange={field.onChange}
													placeholder="#3B82F6"
												/>
											</div>
										</div>
										{errors.color?.message && (
											<p className="error-msg">{errors.color?.message}</p>
										)}
									</div>
								)}
							/>
						</div>

						<SheetFooter className="mt-auto border-t">
							<Button
								size={"lg"}
								type="submit"
								disabled={mutation.isPending}
								className="w-full shadow-sm"
							>
								{mutation.isPending ? "Saving..." : "Save Category"}
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
