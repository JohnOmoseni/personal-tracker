import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { budgetType } from "./budgetType";
import { transactionType } from "./transactionType";
import { userType } from "./userType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [userType, categoryType, budgetType, transactionType],
};
