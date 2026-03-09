type TransactionType = "income" | "expense";

interface Category {
	_id: string;
	_type: "category";
	name: string;
	icon: string;
	type: TransactionType;
	color?: string;
	clerkUserId?: string;
	isDefault: boolean;
}

interface Budget {
	_id: string;
	_type: "budget";
	clerkUserId: string;
	category: {
		_ref: string;
		_type: "reference";
	};
	amount: number;
}

interface Transaction {
	_id: string;
	_type: "transaction";
	clerkUserId: string;
	amount: number;
	type: TransactionType;
	category?: {
		_ref: string;
		_type: "reference";
	};
	description?: string;
	date: string; // YYYY-MM-DD
}
