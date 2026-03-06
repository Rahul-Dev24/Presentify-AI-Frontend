"use server";

import { exec } from "child_process";
import path from "path";

import cloudinary from "./cloudinary";

export const streamAudioToCloudinary = async (url: string) => {
	try {
		console.log("video Download start ***********************************************************************");

		const videoPath = await downloadVideo(url);
		console.log("auto Download start ***********************************************************************");

		const audioPath = await extractAudio(videoPath);
		const cloudinaryUrl = await uploadToCloudinary(audioPath);

		return { audioUrl: cloudinaryUrl };
	} catch (err) {
		console.error("Error processing video:", err);
	}
};

const downloadVideo = (url: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const outputPath = path.join("/tmp", "video.mp4");

		exec(`yt-dlp -f best -o "${outputPath}" "${url}"`, (error) => {
			if (error) return reject(error);
			resolve(outputPath);
		});
	});
};

const extractAudio = (videoPath: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const audioPath = videoPath.replace(".mp4", ".mp3");

		exec(`ffmpeg -i "${videoPath}" -vn -acodec mp3 "${audioPath}"`, (error) => {
			if (error) return reject(error);
			resolve(audioPath);
		});
	});
};

const uploadToCloudinary = async (audioPath: string) => {
	const result = await cloudinary.uploader.upload(audioPath, {
		resource_type: "video", // IMPORTANT for audio
		folder: "extracted-audio",
	});

	return result.secure_url;
};
