export const DEFAULT_CATEGORIES = [
	{
		id: "housing",
		name: "Housing",
		icon: "Home",
		color: "#3B82F6", // blue-500
		type: "expense",
		isDefault: true,
	},
	{
		id: "food",
		name: "Food & Dining",
		icon: "UtensilsCrossed",
		color: "#F59E0B", // amber-500
		type: "expense",
		isDefault: true,
	},
	{
		id: "transport",
		name: "Transportation",
		icon: "Car",
		color: "#8B5CF6", // violet-500
		type: "expense",
		isDefault: true,
	},
	{
		id: "entertainment",
		name: "Entertainment",
		icon: "Gamepad2",
		color: "#EC4899", // pink-500
		type: "expense",
		isDefault: true,
	},
	{
		id: "utilities",
		name: "Utilities",
		color: "#10B981", // emerald-500
		icon: "Zap",
		type: "expense",
		isDefault: true,
	},
];

export const typeOptions = [
	{ label: "Expense", value: "expense" },
	{ label: "Income", value: "income" },
];

export const mockTransactions = [
	{
		_id: "1",
		amount: 1200,
		type: "income",
		description: "Salary",
		date: new Date().toISOString(),
		category: { _ref: "housing" },
	},
	{
		_id: "2",
		amount: 80,
		type: "expense",
		description: "Internet",
		date: new Date().toISOString(),
		category: { _ref: "utilities" },
	},
	{
		_id: "3",
		amount: 45,
		type: "expense",
		description: "Groceries",
		date: new Date().toISOString(),
		category: { _ref: "food" },
	},
	{
		_id: "4",
		amount: 20,
		type: "expense",
		date: new Date().toISOString(),
		category: { _ref: "transport" },
	},
	{
		_id: "5",
		amount: 120,
		type: "expense",
		description: "Concert",
		date: new Date().toISOString(),
		category: { _ref: "entertainment" },
	},
];

export const mockBreakdown = [
	{ name: "Housing", id: "housing", value: 1200, color: "#3B82F6" },
	{ name: "Food & Dining", id: "food", value: 450, color: "#F59E0B" },
	{ name: "Transportation", id: "transport", value: 300, color: "#8B5CF6" },
	{ name: "Utilities", id: "utilities", value: 150, color: "#10B981" },
];
