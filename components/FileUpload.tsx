"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

import { Progress } from "@/components/ui/progress";
import { decrypt } from "@/lib/decrypt";

type SourceType = "video" | "audio";

export default function FileUploader({
	sourceType,
	setUploadedFile,
}: {
	sourceType: SourceType;
	setUploadedFile: (a: any) => void;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	// 1️⃣ Open file picker
	const handleUpload = () => {
		fileInputRef.current?.click();
	};

	// 2️⃣ Validate + Upload
	const handleFile = async (file: File) => {
		if (!file) return;

		const maxSize = 100 * 1024 * 1024; // 100MB
		if (file.size > maxSize) {
			alert("File size exceeds 100MB");
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		// Get signature
		const sigRes = await fetch("/api/upload", {
			method: "POST",
		});

		const encrypted = await sigRes.json();
		const sig: any = await decrypt(encrypted);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("api_key", sig.apiKey);
		formData.append("timestamp", sig.timestamp);
		formData.append("signature", sig.signature);
		formData.append("folder", "uploads");
		formData.append("resource_type", "auto");

		// Use XHR for progress
		const uploadData = await new Promise<void>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`);

			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					const percent = Math.round((event.loaded / event.total) * 100);
					setUploadProgress(percent);
				}
			};

			xhr.onload = () => {
				setIsUploading(false);
				setUploadProgress(100);

				const response = JSON.parse(xhr.responseText);
				console.log("Uploaded file:", response); // secure_url, public_id, duration
				setUploadedFile(response);
				resolve();
			};

			xhr.onerror = () => {
				setIsUploading(false);
				toast.error("Failed to upload file. Check the file size and try again.");
				reject();
			};

			xhr.send(formData);
		});
	};

	// 3️⃣ Drag & Drop support
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (isUploading) return;

		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	};

	return (
		<>
			{/* Hidden input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="video/*,audio/*"
				hidden
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
				}}
			/>

			{/* 🔥 YOUR DESIGN – UNTOUCHED */}
			<div
				onClick={() => !isUploading && handleUpload()}
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				className="group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer relative overflow-hidden"
			>
				{isUploading ? (
					<div className="w-full max-w-xs space-y-4 text-center">
						<p className="text-sm font-medium text-blue-600">Uploading your {sourceType}...</p>
						<Progress value={uploadProgress} className="h-2" />
					</div>
				) : (
					<>
						<div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 transition-transform group-hover:scale-110">
							<Upload size={32} />
						</div>
						<div className="text-center">
							<p className="text-lg font-semibold text-gray-900 dark:text-white">Click to upload or drag and drop</p>
							<p className="text-sm text-gray-500">MP4, MOV, MP3, or WAV (Max 100MB)</p>
						</div>
					</>
				)}
			</div>
		</>
	);
}
