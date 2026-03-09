import { defineField, defineType } from "sanity";

export const transactionType = defineType({
	name: "transaction",
	title: "Transaction",
	type: "document",
	fields: [
		defineField({
			name: "clerkUserId",
			title: "Clerk User ID",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "amount",
			title: "Amount",
			type: "number",
			validation: (rule) => rule.required().positive(),
		}),
		defineField({
			name: "type",
			title: "Type",
			type: "string",
			options: {
				list: [
					{ title: "Income", value: "income" },
					{ title: "Expense", value: "expense" },
				],
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "reference",
			to: [{ type: "category" }],
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 4,
		}),
		defineField({
			name: "date",
			title: "Date",
			type: "date",
			options: {
				dateFormat: "YYYY-MM-DD",
			},
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {
			title: "description",
			amount: "amount",
			type: "type",
			categoryName: "category.name",
		},
		prepare({ title, amount, type, categoryName }) {
			const sign = type === "income" ? "+" : "-";
			return {
				title: title || "Untitled Transaction",
				subtitle: `${sign}₦${amount} • ${categoryName || "No category"}`,
			};
		},
	},
});
