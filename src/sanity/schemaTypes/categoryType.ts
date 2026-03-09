import { defineField, defineType } from "sanity";

export const categoryType = defineType({
	name: "category",
	title: "Category",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "icon",
			title: "Icon (Lucide Component Name)",
			type: "string",
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
			name: "color",
			title: "Color",
			type: "string",
		}),
		defineField({
			name: "clerkUserId",
			title: "Clerk User ID",
			type: "string",
			description: "Leave empty for default categories",
		}),
		defineField({
			name: "isDefault",
			title: "Is Default Category",
			type: "boolean",
			initialValue: false,
		}),
	],
});
