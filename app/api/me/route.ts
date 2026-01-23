import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
	// 1. Check raw headers
	const headersList = await headers();
	const rawCookie = headersList.get("cookie");
	console.log("RAW HEADER STRING:", rawCookie);

	// 2. Standard method
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) {
		return NextResponse.json({ authenticated: false }, { status: 401 });
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET!);
		return NextResponse.json({ authenticated: true, user });
	} catch (err) {
		return NextResponse.json({ authenticated: false, error: err }, { status: 401 });
	}
}
