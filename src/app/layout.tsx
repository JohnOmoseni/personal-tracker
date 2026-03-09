import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "@/components/providers/query-provider";
import "@/styles/globals.css";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Personal Finance Tracker",
	description: "Track your income and expenses",
	icons: {
		icon: "/favicon.ico",
	},
	keywords: [""],
	openGraph: {
		title: "Personal Finance Tracker",
		description: "Personal Finance Tracker",
		images: [
			{
				url: "/favicon.ico",
				width: 1200,
				height: 630,
				alt: "Personal Finance Tracker",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Personal Finance Tracker",
		description: "Personal Finance Tracker",
		images: ["/favicon.ico"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://personal-finance-tracker.vercel.app",
	},
	appLinks: {
		web: {
			url: "https://personal-finance-tracker.vercel.app",
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<QueryProvider>
				<html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
					<body
						className={`${geistSans.variable} ${geistMono.variable} antialiased`}
					>
						<NuqsAdapter>
							<TooltipProvider>{children}</TooltipProvider>
						</NuqsAdapter>
						<Toaster position="top-center" richColors />
					</body>
				</html>
			</QueryProvider>
		</ClerkProvider>
	);
}
