"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	Download,
	Eye,
	FileVideo,
	Images,
	Loader2,
	RotateCcw,
	Upload,
	Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createAndDownloadPPT } from "@/lib/ppt-generation";
import { formatTime } from "@/lib/utils";
import { diagnoseVideoFile, generateDiagnosticReport } from "@/lib/video-diagnostics";
import { convertToMp4, extractFramesFromVideo, preprocessVideo } from "@/lib/video-processing";

type ProcessingState = "idle" | "uploading" | "analyzing" | "extracting" | "completed" | "error" | "converting";

const LocalVideoPage = () => {
	// File and video state
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string>("");
	const [processingState, setProcessingState] = useState<ProcessingState>("idle");
	const [progress, setProgress] = useState<number>(0);
	const [error, setError] = useState<string>("");

	// Video analysis results
	const [screenshots, setScreenshots] = useState<string[]>([]);
	const [videoMetadata, setVideoMetadata] = useState<{
		duration: number;
		width: number;
		height: number;
		size: number;
	} | null>(null);

	// Refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Enhanced format checking
	const isMP4Format = useCallback((file: File): boolean => {
		return file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
	}, []);

	// Check if format is supported for conversion
	const isSupportedFormat = useCallback((file: File): boolean => {
		const supportedTypes = [
			"video/mp4",
			"video/webm",
			"video/quicktime",
			"video/x-msvideo",
			"video/x-matroska",
			"video/3gpp",
			"video/x-flv",
			"video/x-ms-wmv",
			"video/ogg",
			"video/x-ms-asf",
			"video/x-f4v",
			"video/x-m4v",
		];
		const supportedExtensions = [
			".mp4",
			".webm",
			".mov",
			".avi",
			".mkv",
			".3gp",
			".flv",
			".wmv",
			".ogv",
			".asf",
			".f4v",
			".m4v",
		];

		const fileName = file.name.toLowerCase();
		return supportedTypes.includes(file.type) || supportedExtensions.some((ext) => fileName.endsWith(ext));
	}, []);

	// Get video metadata
	const getVideoMetadata = useCallback((file: File, url: string) => {
		const video = document.createElement("video");
		video.preload = "metadata";

		video.onloadedmetadata = () => {
			setVideoMetadata({
				duration: video.duration,
				width: video.videoWidth,
				height: video.videoHeight,
				size: file.size,
			});
			setProcessingState("idle");
		};

		video.onerror = () => {
			setError("Unable to read video file information");
			setProcessingState("error");
		};

		video.src = url;
	}, []);

	// Convert non-MP4 video to MP4 format
	const convertVideoToMp4 = useCallback(async (file: File): Promise<File> => {
		setProcessingState("converting");
		setProgress(0);

		try {
			console.log(`Converting ${file.name} to MP4...`);

			// Get file extension for format detection
			const fileExtension = file.name.split(".").pop()?.toLowerCase();

			// Convert using copy-first strategy
			const convertedBlob = await convertToMp4(
				file,
				(progressValue) => {
					// Simple progress indicator
					const validProgress = Math.max(0, Math.min(100, Math.round(progressValue || 0)));
					console.log(`Conversion activity: ${validProgress}%`);
					setProgress(validProgress);
				},
				fileExtension
			);

			// Create new file with MP4 extension
			const convertedFileName = file.name.replace(/\.[^/.]+$/, "_converted.mp4");
			const convertedFile = new File([convertedBlob], convertedFileName, {
				type: "video/mp4",
			});

			console.log(`Conversion completed: ${convertedFile.name}`);
			return convertedFile;
		} catch (error) {
			console.error("Error converting video:", error);

			// Generate diagnostic report for troubleshooting
			const diagnosticReport = generateDiagnosticReport(file);
			console.error("Diagnostic Report:", diagnosticReport);

			// User-friendly error message based on diagnostic
			const videoInfo = diagnoseVideoFile(file);
			let errorMessage = "Video format conversion failed";

			if (!videoInfo.isSupported) {
				errorMessage = `Unsupported video format: ${videoInfo.detectedFormat}. Please use a supported format.`;
			} else if (videoInfo.recommendations.length > 0) {
				errorMessage = `Conversion failed. Suggestion: ${videoInfo.recommendations[0]}`;
			}

			throw new Error(errorMessage);
		}
	}, []);

	// Handle file selection
	const handleFileSelect = useCallback(
		async (file: File) => {
			// Validate file type
			if (!file.type.startsWith("video/") && !isSupportedFormat(file)) {
				setError("Please select a valid video file format");
				return;
			}

			// Check if format is supported
			if (!isSupportedFormat(file)) {
				setError(
					`Unsupported video format: ${file.name.split(".").pop()}. Supported formats: MP4, WebM, MOV, AVI, MKV, WMV, etc.`
				);
				return;
			}

			// Validate file size (200MB limit with ultra-fast conversion optimizations)
			const maxSize = 200 * 1024 * 1024; // 200MB with speed optimizations
			if (file.size > maxSize) {
				setError("File size cannot exceed 200MB (with speed optimizations enabled)");
				return;
			}

			// Reset states
			setError("");
			setProgress(0);
			setScreenshots([]);
			setVideoMetadata(null);
			setVideoUrl(""); // Clear previous video URL

			setSelectedFile(file);
			setProcessingState("uploading");

			try {
				let finalFile = file;

				// Diagnose file format and show information
				const videoInfo = diagnoseVideoFile(file);
				console.log("Video diagnosis:", videoInfo);

				// Check if file is MP4, if not convert it
				if (!isMP4Format(file)) {
					console.log("Non-MP4 format detected, converting to MP4...");
					setError(`Detected ${videoInfo.detectedFormat} format, converting to MP4 (fast copy and conversion) ...`);

					finalFile = await convertVideoToMp4(file);
					setSelectedFile(finalFile);
					setError(""); // Clear conversion message

					console.log("Ultra-fast format conversion completed successfully");
				}

				// Create video URL for preview only after conversion is complete
				const url = URL.createObjectURL(finalFile);
				setVideoUrl(url);

				// Get video metadata
				getVideoMetadata(finalFile, url);
			} catch (error) {
				console.error("Error processing file:", error);
				setError(error instanceof Error ? error.message : "Failed to process file");
				setProcessingState("error");
				// Ensure video URL is cleared on error
				setVideoUrl("");
			}
		},
		[isSupportedFormat, isMP4Format, convertVideoToMp4, getVideoMetadata]
	);

	// Handle drag and drop
	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const files = e.dataTransfer.files;
			if (files.length > 0) {
				handleFileSelect(files[0]);
			}
		},
		[handleFileSelect]
	);

	// Process video using traditional method with WebAV enhancements
	const handleProcessVideo = useCallback(async () => {
		if (!selectedFile || !videoRef.current || !canvasRef.current) return;

		try {
			setProcessingState("analyzing");
			setProgress(0);
			setScreenshots([]);

			const video = videoRef.current;
			const canvas = canvasRef.current;

			// Wait for video to be ready
			if (video.readyState < 2) {
				await new Promise<void>((resolve, reject) => {
					video.onloadedmetadata = () => resolve();
					video.onerror = () => reject(new Error("Video load failed"));
				});
			}

			// Preprocess to get dynamic threshold
			setProcessingState("analyzing");
			const dynamicThreshold = await preprocessVideo(video, canvas);

			console.log(`Using dynamic threshold: ${dynamicThreshold}`);

			setProcessingState("extracting");

			// Extract frames using the traditional method with improvements
			await extractFramesFromVideo(
				video,
				canvas,
				{
					captureInterval: 3, // Capture every 3 seconds
					differenceThreshold: dynamicThreshold,
					maxScreenshots: 256,
				},
				{
					onProgress: (progressPercent) => {
						setProgress(progressPercent);
					},
					onFrameCaptured: (blob, url) => {
						setScreenshots((prev) => [...prev, url]);
					},
					onComplete: () => {
						setProcessingState("completed");
						setProgress(100);
					},
				}
			);
		} catch (error) {
			console.error("Error processing video:", error);
			setError("Video processing failed, please try again");
			setProcessingState("error");
		}
	}, [selectedFile]);

	// Download PPT
	const handleDownloadPPT = useCallback(async () => {
		try {
			await createAndDownloadPPT(screenshots, {
				title: selectedFile?.name || "Video Analysis",
				maxSlides: 256,
			});
		} catch (error) {
			console.error("Error generating PPT:", error);
			setError("Failed to generate PPT, please try again");
		}
	}, [screenshots, selectedFile?.name]);

	// Reset everything
	const handleReset = useCallback(() => {
		// Clean up video URL to prevent memory leaks
		if (videoUrl) {
			URL.revokeObjectURL(videoUrl);
		}

		setSelectedFile(null);
		setVideoUrl("");
		setProcessingState("idle");
		setProgress(0);
		setError("");
		setScreenshots([]);
		setVideoMetadata(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, [videoUrl]);

	// File input change handler
	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files && files.length > 0) {
				handleFileSelect(files[0]);
			}
		},
		[handleFileSelect]
	);

	return (
		<div className="min-h-screen bg-zinc-950 text-white relative">
			{/* Background - Fixed to cover entire page */}
			<div className="fixed inset-0 z-0 overflow-hidden">
				{/* Gradient overlays */}
				<div className="absolute inset-0 bg-linear-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20" />
				<div className="absolute inset-0 bg-linear-to-tr from-zinc-900 via-zinc-900/80 to-zinc-900/60" />

				{/* Grid pattern - covers entire viewport */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-100" />

				{/* Subtle animated elements */}
				<div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-linear-to-r from-purple-500/10 to-teal-500/10 blur-3xl animate-pulse [animation-delay:2s]" />
			</div>

			{/* Header */}
			<header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-4">
					<nav className="flex items-center justify-between">
						<Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
							<ArrowLeft className="h-5 w-5" />
							<span>Back to Home</span>
						</Link>

						<div className="flex items-center space-x-2">
							<FileVideo className="h-6 w-6 text-blue-400" />
							<span className="text-xl font-semibold">Local Video</span>
						</div>
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-6 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Upload Panel */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
							{!selectedFile ? (
								/* Upload Area */
								<div
									className="border-2 border-dashed border-zinc-600/50 rounded-xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer group"
									onDragOver={handleDragOver}
									onDrop={handleDrop}
									onClick={() => fileInputRef.current?.click()}
								>
									<div className="space-y-6 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
										<div className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
											<Upload className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
										</div>

										<div>
											<h3 className="text-2xl font-semibold mb-2">Select a video file</h3>
											<p className="text-zinc-400 mb-4">Drag and drop a video file here, or click to select a file</p>
											<p className="text-sm text-zinc-500">
												Supports MP4, WebM, MOV, AVI, MKV, WMV, FLV, OGV formats, maximum 200MB
											</p>
											<p className="text-xs text-zinc-600 mt-1">
												Non-MP4 formats will be automatically converted to MP4 for compatibility
											</p>
										</div>

										<Button className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
											<Upload className="mr-2 h-5 w-5" />
											Select a file
										</Button>
									</div>
								</div>
							) : (
								/* Video Preview and Controls */
								<div className="space-y-6">
									{/* Video Player */}
									<div className="aspect-video rounded-lg bg-black overflow-hidden relative">
										<video
											ref={videoRef}
											src={videoUrl || undefined}
											className="w-full h-full object-contain"
											controls
											preload="metadata"
										/>

										{/* Processing Overlay */}
										{(processingState === "analyzing" ||
											processingState === "extracting" ||
											processingState === "converting") && (
											<div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
												<div className="text-center space-y-4">
													<Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-400" />
													<div>
														<p className="text-lg font-semibold">
															{processingState === "converting" && "Converting video format..."}
															{processingState === "analyzing" && "Analyzing video..."}
															{processingState === "extracting" && "Extracting key frames..."}
														</p>
														<p className="text-sm text-zinc-400 mt-2">
															{processingState === "converting" && "Converting..."}
															{processingState === "analyzing" && "Analyzing..."}
															{processingState === "extracting" && "Extracting..."}
														</p>
														{processingState === "converting" && (
															<p className="text-xs text-zinc-500 mt-2">
																Try quick copy first, then re-encode if needed
															</p>
														)}
													</div>
												</div>
											</div>
										)}
									</div>

									{/* File Info */}
									{videoMetadata && (
										<div className="grid md:grid-cols-2 gap-4 p-4 bg-zinc-800/30 rounded-lg">
											<div>
												<p className="text-sm text-zinc-400">File Name</p>
												<p className="font-medium truncate">{selectedFile.name}</p>
											</div>
											<div>
												<p className="text-sm text-zinc-400">File Size</p>
												<p className="font-medium">{(videoMetadata.size / 1024 / 1024).toFixed(1)} MB</p>
											</div>
											<div>
												<p className="text-sm text-zinc-400">Duration</p>
												<p className="font-medium">{formatTime(Math.floor(videoMetadata.duration))}</p>
											</div>
											<div>
												<p className="text-sm text-zinc-400">Resolution</p>
												<p className="font-medium">
													{videoMetadata.width} × {videoMetadata.height}
												</p>
											</div>
										</div>
									)}

									{/* Action Buttons */}
									<div className="flex space-x-4">
										{processingState === "idle" && (
											<Button
												onClick={handleProcessVideo}
												className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
											>
												<Zap className="mr-2 h-5 w-5" />
												Start Processing
											</Button>
										)}

										{processingState === "completed" && (
											<>
												<Button
													onClick={handleDownloadPPT}
													className="flex-1 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
													disabled={screenshots.length === 0}
												>
													<Download className="mr-2 h-5 w-5" />
													Download PPT ({screenshots.length} slides)
												</Button>

												<Button
													onClick={handleProcessVideo}
													variant="outline"
													className="border-zinc-700 text-white hover:bg-zinc-800"
												>
													<RotateCcw className="mr-2 h-4 w-4" />
													Rerun Processing
												</Button>
											</>
										)}

										<Button
											onClick={handleReset}
											variant="outline"
											className="border-zinc-700 text-white hover:bg-zinc-800"
										>
											Retry Selection
										</Button>
									</div>

									{/* Error Display */}
									{error && (
										<div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-3 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
											<AlertCircle className="h-5 w-5 text-red-400" />
											<p className="text-red-300">{error}</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Info Panel */}
					<div className="space-y-6">
						{/* Conversion Info */}
						<div className="rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
							<h3 className="text-lg font-semibold mb-4">Conversion Strategy</h3>

							<div className="space-y-3">
								<div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<Zap className="h-4 w-4 text-blue-400" />
										<span className="font-medium text-blue-300">Intelligent Copy First</span>
									</div>
									<p className="text-xs text-blue-200/80">
										Try direct copy first (very fast), and if failed, smart re-encode
									</p>
								</div>
							</div>

							<div className="mt-4 p-3 bg-zinc-800/20 border border-zinc-700/30 rounded-lg">
								<p className="text-xs text-zinc-400">
									Most videos can be directly copied, with a speed boost of 10-50 times and zero quality loss
								</p>
							</div>
						</div>

						{/* Status */}
						<div className="rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
							<h3 className="text-lg font-semibold mb-4">Processing Status</h3>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Current status</span>
									<div className="flex items-center space-x-2">
										{processingState === "analyzing" && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
										{processingState === "extracting" && <Loader2 className="h-4 w-4 animate-spin text-purple-400" />}
										{processingState === "converting" && <Loader2 className="h-4 w-4 animate-spin text-orange-400" />}
										{processingState === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
										{processingState === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
										<span className="capitalize">
											{processingState === "idle" && "Waiting for processing"}
											{processingState === "uploading" && "Uploading"}
											{processingState === "converting" && "Converting"}
											{processingState === "analyzing" && "Analyzing"}
											{processingState === "extracting" && "Extracting"}
											{processingState === "completed" && "Completed"}
											{processingState === "error" && "Error"}
										</span>
									</div>
								</div>

								{(processingState === "converting" ||
									processingState === "analyzing" ||
									processingState === "extracting") && (
									<div className="flex items-center justify-between">
										<span className="text-zinc-400">Progress</span>
										<span>{progress}%</span>
									</div>
								)}

								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Extracted frames</span>
									<span>{screenshots.length}</span>
								</div>
							</div>
						</div>

						{/* Screenshots Preview */}
						{screenshots.length > 0 && (
							<div className="rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Preview ({screenshots.length} frames)</h3>
									<div className="flex gap-2">
										<Button
											onClick={() => {
												// Bulk download function
												screenshots.forEach((screenshot, index) => {
													const link = document.createElement("a");
													link.href = screenshot;
													link.download = `video_frame_${String(index + 1).padStart(3, "0")}.png`;
													document.body.appendChild(link);
													link.click();
													document.body.removeChild(link || document.createElement("dev"));
												});
											}}
											variant="outline"
											size="sm"
											className="border-zinc-700 text-white hover:bg-zinc-800"
										>
											<Images className="mr-1 h-4 w-4" />
											Dowload all
										</Button>
									</div>
								</div>

								{/* Scrollable preview area */}
								<div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
									{screenshots.map((screenshot, index) => (
										<div
											key={index}
											className="aspect-video rounded-lg overflow-hidden border border-zinc-600/30 group relative"
										>
											<Image
												src={screenshot}
												alt={`Frame ${index + 1}`}
												width={300}
												height={200}
												className="w-full h-full object-cover"
												unoptimized
											/>
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<div className="flex gap-2">
													<Button
														onClick={() => {
															const link = document.createElement("a");
															link.href = screenshot;
															link.download = `video_frame_${String(index + 1).padStart(3, "0")}.png`;
															document.body.appendChild(link);
															link.click();
															document.body.removeChild(link || document.createElement("dev"));
														}}
														size="sm"
														variant="secondary"
													>
														<Download className="h-4 w-4" />
													</Button>
													<Button
														onClick={() => {
															window.open(screenshot, "_blank");
														}}
														size="sm"
														variant="secondary"
													>
														<Eye className="h-4 w-4" />
													</Button>
												</div>
											</div>
											<div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
												#{index + 1}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Tips */}
						<div className="rounded-2xl bg-linear-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 p-6 backdrop-blur-sm hover:border-blue-500/50 hover:bg-linear-to-br hover:from-blue-900/30 hover:to-purple-900/30 transition-all duration-300">
							<h3 className="text-lg font-semibold mb-4 text-blue-300">Processing Instructions</h3>

							<ul className="space-y-2 text-sm text-blue-200">
								<li>• Supports multiple video formats: MP4, WebM, MOV, AVI, MKV, WMV, FLV, etc.</li>
								<li>• Automatically detects format, non-MP4 automatically converted to ensure compatibility</li>
								<li>• Uses FFmpeg.wasm for high-quality format conversion</li>
								<li>• Smart difference detection algorithm, automatically calculates the best threshold</li>
								<li>• Extracts key content, generates PPT</li>
								<li>• Local processing, protects privacy and security, no server upload</li>
							</ul>
						</div>
					</div>
				</div>
			</main>

			{/* Hidden Elements */}
			<input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileInputChange} className="hidden" />

			<canvas ref={canvasRef} className="hidden" />
		</div>
	);
};

export default LocalVideoPage;
