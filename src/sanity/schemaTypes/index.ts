import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { budgetType } from "./budgetType";
import { transactionType } from "./transactionType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [categoryType, budgetType, transactionType],
};
