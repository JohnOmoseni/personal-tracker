import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const writeClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false, // Must be false for mutations
	token: process.env.SANITY_API_WRITE_TOKEN,
});

if (!writeClient.config().token) {
	console.error("Write token not found.");
}
