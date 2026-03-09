import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { syncUserToSanity } from "@/lib/actions/sanity.actions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();
	if (!user) {
		redirect("/sign-in");
	}

	await syncUserToSanity({
		id: user.id,
		email: user.emailAddresses[0]?.emailAddress ?? "",
		firstName: user.firstName,
		lastName: user.lastName,
		imageUrl: user.imageUrl,
	});
	return (
		<div className="flex min-h-screen w-full bg-slate-50">
			<Sidebar />
			<div className="flex flex-col flex-1 pb-16 md:pb-0">
				<header className="flex h-16 items-center border-b px-4 md:px-6 justify-between bg-white">
					<div className="font-semibold text-lg flex items-center md:hidden text-primary">
						Tracker
					</div>
					<div className="ml-auto flex items-center gap-4">
						<UserButton signInUrl="/" />
					</div>
				</header>
				<main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
