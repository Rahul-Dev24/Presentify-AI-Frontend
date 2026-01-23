// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import { useAuth } from "@/context/AuthContext";

// export function middleware(req: NextRequest) {
// 	const { isAuthenticated } = useAuth();

// 	if (isAuthenticated && req.nextUrl.pathname.startsWith("/login")) {
// 		return NextResponse.redirect(new URL("/", req.url));
// 	}

// 	if (!isAuthenticated && req.nextUrl.pathname.startsWith("/dashboard")) {
// 		return NextResponse.redirect(new URL("/login", req.url));
// 	}
// }

export const config = {
	matcher: ["/dashboard/:path*"],
};
