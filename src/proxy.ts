import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const middleware = clerkMiddleware(async (_auth, req) => {
	if (!isPublicRoute(req)) {
		// await auth.protect();
	}
});

// biome-ignore lint/suspicious/noExplicitAny: use any
export default function proxy(req: any, event: any) {
	return middleware(req, event);
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
