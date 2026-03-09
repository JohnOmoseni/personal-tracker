import { defineField, defineType } from "sanity";

export const userType = defineType({
	name: "user",
	title: "User",
	type: "document",
	fields: [
		defineField({
			name: "clerkId",
			title: "Clerk ID",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "email",
			title: "Email",
			type: "string",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "firstName",
			title: "First Name",
			type: "string",
		}),
		defineField({
			name: "lastName",
			title: "Last Name",
			type: "string",
		}),
		defineField({
			name: "imageUrl",
			title: "Image URL",
			type: "url",
		}),
		defineField({
			name: "createdAt",
			title: "Created At",
			type: "datetime",
		}),
	],
	preview: {
		select: {
			title: "firstName",
			subtitle: "email",
			imageUrl: "imageUrl",
		},
		prepare({ title, subtitle, imageUrl }) {
			return {
				title: title || "Unknown User",
				subtitle,
			};
		},
	},
});
