"use client";
import { cn } from "@/lib/utils";
import { Input } from "../input";
import { Label } from "../label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Textarea } from "../textarea";
import React from "react";

interface IInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	labelStyles?: string;
	className?: string;
	value?: string | number;
	error?: string | undefined;
	withRightIcon?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}
export const InputField = ({
	label,
	labelStyles,
	type,
	className,
	name,
	error,
	withRightIcon,
	value,
	leftIcon,
	rightIcon,
	required,
	...props
}: IInputFieldProps) => {
	const [showPassword, setShowPassword] = React.useState(false);
	return (
		<div className="flex flex-col gap-3 w-full">
			{label && (
				<Label className={cn("flex items-center gap-1", labelStyles)}>
					{label}
					{required && <span className="text-red-500">*</span>}
				</Label>
			)}
			<div className="relative bg-white/90">
				{leftIcon && (
					<span className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer">
						{leftIcon}
					</span>
				)}
				<Input
					type={type === "password" && showPassword ? "text" : type || "text"}
					name={name || ""}
					className={cn(
						"h-[48px] px-3 placeholder:font-medium placeholder:text-gray-500",
						className,
						leftIcon && "pl-10",
						withRightIcon && "pr-10",
					)}
					value={value || ""}
					autoComplete="off"
					{...props}
				/>
				{type === "password" ? (
					showPassword ? (
						<EyeIcon
							className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
							size={18}
							onClick={() => setShowPassword(!showPassword)}
						/>
					) : (
						<EyeOffIcon
							className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
							size={18}
							onClick={() => setShowPassword(!showPassword)}
						/>
					)
				) : (
					<div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
						{rightIcon}
					</div>
				)}
			</div>
		</div>
	);
};

interface IAmountInputFieldProps {
	label?: string;
	labelStyles?: string;
	className?: string;
	value?: any;
	unit?: string;
	containerClass?: string;
	unitClass?: string;
}
export const AmountInputField = ({
	label,
	labelStyles,
	placeholder,
	className,
	name,
	onChange,
	unit,
	containerClass,
	unitClass,
	disabled,
	value,
	required,
	...props
}: IAmountInputFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => {
	// Get display value - convert number to string if needed
	const getDisplayValue = (): string => {
		if (value === undefined || value === null || value === "") {
			return "";
		}
		return String(value);
	};

	return (
		<div className="flex flex-col gap-3 w-full">
			{label && (
				<Label className={cn("flex items-center gap-1", labelStyles)}>
					{label}
					{required && <span className="text-red-500">*</span>}
				</Label>
			)}
			<div
				className={cn(
					"relative h-[48px] bg-white/90 flex items-center border border-input rounded-none overflow-hidden",
					disabled && "*:cursor-not-allowed *:opacity-70",
					containerClass,
				)}
			>
				<div
					className={cn(
						"min-w-[64px] flex items-center justify-center border-r h-full border-input",
						unitClass,
					)}
				>
					<p className="font-light text-gray-600 text-sm">{unit || "NGN"}</p>
				</div>
				<Input
					name={name || ""}
					className={cn(
						"h-full flex-1 px-3 placeholder:font-medium placeholder:text-gray-500 border-none outline-none focus-visible:ring-0",
						className,
					)}
					placeholder={placeholder || "0.00"}
					value={getDisplayValue()}
					onChange={onChange}
					autoComplete="off"
					disabled={disabled ?? false}
					{...props}
				/>
			</div>
		</div>
	);
};

interface ITextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	labelStyles?: string;
	placeholder: string;
	className?: string;
	name?: string;
	value?: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	error?: string | undefined;
	touched?: boolean;
	disabled?: boolean;
}
export const TextAreaField = ({
	label,
	labelStyles,
	placeholder,
	className,
	name,
	error,
	value,
	onChange,
	touched,
	disabled,
	required,
	...props
}: ITextAreaFieldProps) => {
	return (
		<div className="space-y-2">
			{label && (
				<Label className={cn("", labelStyles)}>
					{label}
					{required && <span className="text-red-500">*</span>}
				</Label>
			)}
			<div className="relative bg-white/90">
				<Textarea
					name={name || ""}
					className={cn(
						"rounded-md h-[120px] py-3 px-3.5 placeholder:text-sm placeholder:font-medium  placeholder:text-gray-500 resize-none",
						className,
					)}
					placeholder={placeholder || ""}
					value={value || ""}
					onChange={onChange}
					disabled={disabled ?? false}
					{...props}
				/>
			</div>
			{touched && error && (
				<p className="text-red-400 text-[0.7rem]">{error}</p>
			)}
		</div>
	);
};
