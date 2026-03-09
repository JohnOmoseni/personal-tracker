import clsx from "clsx";
const green = ["active", "verified", "approved", "completed"];
const error = ["cancelled", "inactive", "high", "rejected", "suspended"];
const yellow = ["pending", "medium"];
const orange = ["submitted", "in progress", "onboarding"];
const gray = ["low", "unknown"];

export const StatusBadge = ({
	status,
	containerStyles,
}: {
	status: any;
	containerStyles?: string;
}) => {
	const normalizedStatus = status?.toLowerCase();
	return (
		<div
			className={clsx(
				"row-flex rounded-full bg-gray-50 border-none px-2 w-max py-1",
				{
					"bg-green-50": green.includes(normalizedStatus),
					"bg-red-50": error.includes(normalizedStatus),
					"bg-yellow-50": yellow.includes(normalizedStatus),
					"bg-orange-50": orange.includes(normalizedStatus),
					"bg-gray-50": gray.includes(normalizedStatus),
				},
				containerStyles
			)}
		>
			<p
				className={clsx(
					"whitespace-nowrap text-xs text-accent-foreground font-medium capitalize",
					{
						"text-green-600": green.includes(normalizedStatus),
						"text-red-600": error.includes(normalizedStatus),
						"text-primary": yellow.includes(normalizedStatus),
						"text-orange-600": orange.includes(normalizedStatus),
						"text-gray-600": gray.includes(normalizedStatus),
					}
				)}
			>
				{status || "Unknown"}
			</p>
		</div>
	);
};
