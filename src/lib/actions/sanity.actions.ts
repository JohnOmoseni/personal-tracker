"use server";

import { writeClient } from "@/sanity/lib/write-client";

export async function syncUserToSanity(user: {
	id: string;
	email: string;
	firstName?: string | null;
	lastName?: string | null;
	imageUrl?: string;
}) {
	try {
		const doc = {
			_type: "user",
			_id: `user-${user.id}`,
			clerkId: user.id,
			email: user.email,
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			imageUrl: user.imageUrl || "",
			createdAt: new Date().toISOString(),
		};

		// Create or update the user document
		const result = await writeClient.createIfNotExists(doc);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error syncing user to Sanity:", error);
		return { success: false, error };
	}
}

export async function createCategory(data: any) {
	try {
		const doc = {
			_type: "category",
			...data,
			...(data.clerkUserId
				? { user: { _type: "reference", _ref: `user-${data.clerkUserId}` } }
				: {}),
		};
		const result = await writeClient.create(doc);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error creating category:", error);
		return { success: false, error };
	}
}

export async function createTransaction(data: any) {
	try {
		const doc = {
			_type: "transaction",
			...data,
			...(data.clerkUserId
				? { user: { _type: "reference", _ref: `user-${data.clerkUserId}` } }
				: {}),
		};
		const result = await writeClient.create(doc);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error creating transaction:", error);
		return { success: false, error };
	}
}

export async function createBudget(data: any) {
	try {
		const doc = {
			_type: "budget",
			...data,
			...(data.clerkUserId
				? { user: { _type: "reference", _ref: `user-${data.clerkUserId}` } }
				: {}),
		};
		const result = await writeClient.create(doc);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error creating budget:", error);
		return { success: false, error };
	}
}

export async function deleteDocument(id: string) {
	try {
		const result = await writeClient.delete(id);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error deleting document:", error);
		return { success: false, error };
	}
}
