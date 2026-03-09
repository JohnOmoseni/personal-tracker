"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
}

export function DatePickerField<T extends FieldValues>({
	control,
	name,
	label,
}: DatePickerFieldProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel className="text-sm font-medium mb-1">{label}</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant={"outline"}
									className={cn(
										"w-full h-[48px] pl-3 text-left font-normal bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-all focus-visible:ring-primary shadow-sm bg-white",
										!field.value && "text-muted-foreground",
									)}
								>
									{field.value ? (
										format(field.value, "PPP")
									) : (
										<span>Pick a date</span>
									)}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
								disabled={(date) =>
									date > new Date() || date < new Date("1900-01-01")
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					<FormMessage className="text-xs" />
				</FormItem>
			)}
		/>
	);
}
