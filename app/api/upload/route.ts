import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";
import { encrypt } from "@/lib/encryption";

export async function POST() {
	const timestamp = Math.round(Date.now() / 1000);

	const signature = cloudinary.utils.api_sign_request(
		{
			timestamp,
			folder: "uploads",
		},
		process.env.CLOUDINARY_API_SECRET!
	);

	const payload = {
		signature,
		timestamp,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
	};

	const encryptedPayload = encrypt(payload);
	console.log("sadasd", encryptedPayload);

	return NextResponse.json(encryptedPayload);
}
