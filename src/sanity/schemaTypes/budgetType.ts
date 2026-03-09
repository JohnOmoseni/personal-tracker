import { defineField, defineType } from "sanity";

export const budgetType = defineType({
	name: "budget",
	title: "Budget",
	type: "document",
	fields: [
		defineField({
			name: "clerkUserId",
			title: "Clerk User ID",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "user",
			title: "User",
			type: "reference",
			to: [{ type: "user" }],
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "reference",
			to: [{ type: "category" }],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "amount",
			title: "Monthly Budget Amount",
			type: "number",
			validation: (rule) => rule.required().positive(),
		}),
	],
	preview: {
		select: {
			title: "category.name",
			subtitle: "amount",
		},
		prepare({ title, subtitle }) {
			return {
				title: title ? `Budget for ${title}` : "Untitled Budget",
				subtitle: subtitle ? `₦${subtitle}` : "No amount set",
			};
		},
	},
});
