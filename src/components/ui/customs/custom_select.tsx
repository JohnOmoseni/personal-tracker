import React, { Fragment, ReactNode } from "react";
import {
	Select as SelectPrimitive,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "../label";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

export enum SelectVariant {
	FILLED = "filled",
	OUTLINE = "outline",
	GHOST = "ghost",
}
type SelectProps = {
	triggerText: ReactNode;
	renderItem?: (item: any) => ReactNode;
	content: any[];
	containerClass?: string;
	variant?: "filled" | "outline" | "ghost";
	disabled?: boolean;
	name?: string;
	value?: string;
	onChange?: ((value: string) => void) | undefined;
	label?: ReactNode;
	labelStyles?: string;
	itemClassName?: string;
	contentClassName?: string;
	showAnyItemLabel?: string;
};

const SelectField = ({
	triggerText,
	renderItem,
	content,
	containerClass,
	variant = "outline",
	disabled,
	name,
	value,
	onChange,
	label,
	labelStyles,
	itemClassName,
	contentClassName,
	showAnyItemLabel,
}: SelectProps) => {
	return (
		<div className="flex flex-col gap-2 shrink-0">
			{label && <Label className={cn("", labelStyles)}>{label}</Label>}
			<SelectPrimitive
				disabled={disabled}
				name={name}
				value={value}
				onValueChange={(value: string) => value && onChange?.(value)}
			>
				<SelectTrigger
					className={cn(
						"rounded-none h-[48px]! bg-white/90 border-input py-0 w-auto placeholder:font-medium placeholder:text-gray-500 focus:outline-none focus-within:ring-0 focus:ring-0 focus-visible:ring-0",
						containerClass,
					)}
				>
					<SelectValue placeholder={triggerText} />
				</SelectTrigger>
				<SelectContent
					className={cn("border-none max-h-[350px]", contentClassName)}
				>
					{showAnyItemLabel && (
						<SelectItem value="any">{showAnyItemLabel}</SelectItem>
					)}
					{content?.length > 0 ? (
						content.map((item, idx) =>
							renderItem ? (
								<Fragment key={`select-item-${idx}-${item.label}`}>
									{renderItem(item)}
								</Fragment>
							) : (
								<SelectItem
									key={`select-item-${idx}-${item.label}`}
									value={item.value}
									className={cn(
										"hover:text-accent focus:text-foreground cursor-pointer gap-1 py-2",
										!item?.icon && "pl-3",
										item.value === "select" &&
											"text-gray-400 hover:text-gray-400 focus:text-gray-400 cursor-pointer py-2",
										itemClassName,
									)}
								>
									<div className="flex items-center gap-1">
										{item?.icon && <p>{item.icon}</p>}
										<p>{item.label}</p>
									</div>
								</SelectItem>
							),
						)
					) : (
						<SelectItem
							key={"no-option"}
							value="null"
							className={cn("shad-select-item no-option")}
						>
							No item
						</SelectItem>
					)}
				</SelectContent>
			</SelectPrimitive>
		</div>
	);
};

export default SelectField;

interface Option {
	label: string;
	value: string;
	icon?: React.ReactNode;
}

interface SelectFormFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	placeholder?: string;
	options: Option[];
}

export function SelectFormField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	options,
}: SelectFormFieldProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="">{label}</FormLabel>
					<SelectPrimitive
						defaultValue={field.value}
						value={field.value}
						onValueChange={(value: string) => value && field.onChange(value)}
					>
						<FormControl>
							<SelectTrigger className="w-full h-[48px]! border-input transition-all focus-visible:ring-primary shadow-sm bg-white/90">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<div className="flex items-center gap-2">
										{option?.icon}
										<span>{option.label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</SelectPrimitive>
					<FormMessage className="error-msg" />
				</FormItem>
			)}
		/>
	);
}

export function SelectCombobox({
	content,
	triggerText,
	value,
	label,
	variant = "outline",
	containerClass,
	disabled,
	onChange,
	contentClassName,
	itemClassName,
}: SelectProps) {
	const [open, setOpen] = React.useState(false);
	// const [value, setValue] = React.useState("");

	return (
		<div className="flex flex-col gap-2 shrink-0">
			{label && <Label className="">{label}</Label>}
			<Popover open={open} onOpenChange={setOpen} modal>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						role="combobox"
						disabled={disabled}
						aria-expanded={open}
						className={cn(
							"border bg-transparent rounded-md text-gray-600 flex items-center justify-between gap-1 w-auto focus-within:ring-0 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-300 focus:outline-none h-11! py-0 text-sm! truncate",
							variant === SelectVariant.FILLED
								? "border-none dark:border-gray-500 bg-gray-50 dark:bg-gray-600 px-2 text-accent gap-3"
								: variant === SelectVariant.OUTLINE
									? "border text-gray-600 border-gray-300 bg-transparent px-3 gap-3 hover:bg-transparent"
									: "bg-transparent gap-3",
							containerClass,
						)}
					>
						<span className="w-full truncate text-left">
							{value
								? content.find((item) => item.value === value)?.label
								: triggerText}
						</span>

						<ChevronDownIcon
							strokeWidth={1.5}
							className={cn(
								"size-5 shrink-0 text-gray-500 ml-2",
								variant === "filled" && "size-4",
							)}
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className={cn(
						"border-none w-full min-w-[350px] max-h-[600px] p-0",
						contentClassName,
					)}
				>
					<Command
						value={value}
						onValueChange={(value: string) => {
							value && onChange?.(value);
						}}
						className="min-w-full"
					>
						<CommandInput className="" placeholder="Search..." />
						<CommandList>
							<CommandEmpty>No item found.</CommandEmpty>
							<CommandGroup>
								{content.map((item, index) => (
									<CommandItem
										key={`select-item-${index}-${item.value}`}
										value={item?.value}
										onSelect={(currentValue: string) => {
											// setValue(currentValue === value ? "" : currentValue);
											setOpen(false);
										}}
										className={cn(
											"cursor-pointer gap-1 py-2",
											!item.icon && "pl-3",
											itemClassName,
										)}
									>
										{item?.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
