import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import youtubedl from "youtube-dl-exec";

export const runtime = "nodejs"; // 🔴 REQUIRED (no Edge)

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const youtubeUrl: string | undefined = body?.youtubeUrl;

		if (!youtubeUrl) {
			return NextResponse.json({ error: "Missing youtubeUrl" }, { status: 400 });
		}

		const outputPath = path.join(process.cwd(), `temp_audio_${Date.now()}.mp3`);

		console.log("⬇️ yt-dlp downloading audio (ANDROID client)...");

		await youtubedl(youtubeUrl, {
			extractAudio: true,
			audioFormat: "mp3",
			audioQuality: "192K" as any,
			output: outputPath,

			noPlaylist: true,

			// REQUIRED (2025+)
			jsRuntimes: "node",

			// 🔥 SABR FIX
			extractorArgs: "youtube:player_client=android",

			format: "bestaudio/best",
		});

		console.log("✅ Audio saved:", outputPath);

		return NextResponse.json({
			success: true,
			filePath: outputPath,
		});
	} catch (err: any) {
		console.error("yt-dlp error:", err?.stderr || err?.message);

		return NextResponse.json(
			{
				error: "Audio processing failed",
				details: err?.stderr || err?.message,
			},
			{ status: 500 }
		);
	}
}
