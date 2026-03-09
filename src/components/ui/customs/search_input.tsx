import { Search } from "lucide-react";
import { Input } from "../input";
import React, { useEffect, useState } from "react";

interface SearchInputProps {
	placeholder?: string;
	loading?: boolean;
	value: string;
	onChange: (value: string) => void;
}

const SearchInput = ({
	placeholder,
	loading,
	value,
	onChange,
}: SearchInputProps) => {
	const [inputValue, setInputValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			onChange(inputValue);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	}, [inputValue, onChange]);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	return (
		<div className="border border-border pl-2.5 pr-3 min-h-[45px] rounded-md flex items-center gap-2 bg-white transition-all duration-200 max-w-[320px] xl:max-w-[480px]">
			<Search className="text-gray-400" size={24} />
			<Input
				className="border-none truncate text-sm outline-none focus:outline-none focus-visible:ring-0 shadow-none placeholder:text-gray-400 px-0"
				placeholder={placeholder || "Search"}
				value={inputValue}
				disabled={loading}
				onChange={(e) => setInputValue(e.target.value)}
			/>
		</div>
	);
};

export default SearchInput;
