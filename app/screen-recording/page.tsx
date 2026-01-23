"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeft,
	Camera,
	CheckCircle,
	Download,
	Eye,
	Images,
	Loader2,
	Mic,
	MicOff,
	Monitor,
	Pause,
	Play,
	Settings,
	Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createAndDownloadPPT } from "@/lib/ppt-generation";
import { formatTime } from "@/lib/utils";
import { captureAndFilterScreenshot } from "@/lib/video-processing";

type RecordingState = "idle" | "ready" | "recording" | "paused" | "processing" | "completed";

interface ScreenshotStats {
	total: number;
	saved: number;
}

const ScreenRecordingPage = () => {
	// Recording state
	const [recordingState, setRecordingState] = useState<RecordingState>("idle");
	const [recordingTime, setRecordingTime] = useState<number>(0);
	const [withAudio, setWithAudio] = useState<boolean>(false);

	// State ref for timeout callbacks
	const recordingStateRef = useRef<RecordingState>("idle");

	// Update ref when state changes
	useEffect(() => {
		recordingStateRef.current = recordingState;
	}, [recordingState]);

	// Media stream and recording
	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const recordedChunksRef = useRef<Blob[]>([]);
	const videoRef = useRef<HTMLVideoElement>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Screenshot capture
	const [screenshots, setScreenshots] = useState<string[]>([]);
	const [screenshotStats, setScreenshotStats] = useState<ScreenshotStats>({ total: 0, saved: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const lastImageDataRef = useRef<ImageData | null>(null);
	const diffThreshold = 30;

	// Video output
	const [videoUrl, setVideoUrl] = useState<string>("");

	// Cleanup function
	const cleanup = useCallback(() => {
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());
			setMediaStream(null);
		}
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
	}, [mediaStream]);

	// Timer functions
	const startTimer = useCallback(() => {
		const startTime = Date.now() - recordingTime * 1000;
		timerRef.current = setInterval(() => {
			setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);
	}, [recordingTime]);

	const stopTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	// Screenshot capture function
	const captureScreenshot = useCallback(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (!video || !canvas) {
			console.warn("Video or canvas element is not available");
			return;
		}

		// Check if video is loaded and has content
		if (video.videoWidth === 0 || video.videoHeight === 0) {
			console.warn(`Video dimension is 0 (${video.videoWidth}x${video.videoHeight}), skipping screenshot`);
			console.warn(`Video state: readyState=${video.readyState}, currentTime=${video.currentTime}`);
			return;
		}

		if (video.readyState < 2) {
			console.warn(`Video is not ready (readyState=${video.readyState}), skipping screenshot`);
			return;
		}

		console.log(`Capturing screenshot, video dimension: ${video.videoWidth}x${video.videoHeight}, readyState: ${video.readyState}`);

		try {
			captureAndFilterScreenshot({
				videoRef: videoRef as React.RefObject<HTMLVideoElement>,
				canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
				lastImageDataRef,
				diffThreshold,
				onScreenshotCaptured: (screenshot) => {
					console.log("New screenshot saved");
					setScreenshots((prev) => {
						const newScreenshots = [...prev, screenshot];
						return newScreenshots;
					});
					setScreenshotStats((prev) => ({ ...prev, saved: prev.saved + 1 }));
				},
				onStatsUpdate: () => {
					setScreenshotStats((prev) => ({ ...prev, total: prev.total + 1 }));
				},
			});
		} catch (error) {
			console.error("Screenshot capture failed:", error);
		}
	}, [diffThreshold]);

	// Screenshot capture during recording
	const startScreenshotCapture = useCallback(() => {
		console.log("Start screenshot capture...");

		// Delay starting screenshot capture, wait for video to be fully prepared
		setTimeout(() => {
			const captureInterval = setInterval(() => {
				if (recordingStateRef.current === "recording") {
					captureScreenshot();
				} else {
					console.log("Stop screenshot capture, current state:", recordingStateRef.current);
					clearInterval(captureInterval);
				}
			}, 3000); // Capture screenshot every 3 seconds
		}, 2000); // Wait for 2 seconds to let the video fully prepare
	}, [captureScreenshot]);

	// Start recording preparation
	const handleStartPrepare = useCallback(async () => {
		try {
			console.log("Starting screen recording preparation...");

			// Check if browser supports screen recording
			if (!navigator.mediaDevices?.getDisplayMedia) {
				throw new Error("Your browser does not support screen recording functionality");
			}

			const displayMediaOptions: DisplayMediaStreamOptions = {
				video: {
					cursor: "always",
					displaySurface: "monitor",
					width: { ideal: 1920 },
					height: { ideal: 1080 },
					frameRate: { ideal: 30 },
				} as MediaTrackConstraints,
				audio: true,
			};

			console.log("Requesting screen recording permission...");
			const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
			console.log(
				"Obtained screen recording permission, video tracks:",
				stream.getVideoTracks().length,
				"audio tracks:",
				stream.getAudioTracks().length
			);

			let finalStream = stream;

			if (withAudio) {
				try {
					console.log("Requesting microphone permission");
					const micStream = await navigator.mediaDevices.getUserMedia({
						audio: {
							echoCancellation: true,
							noiseSuppression: true,
							autoGainControl: true,
						},
					});

					console.log("Obtained microphone permission, merging audio tracks...");
					// Merge audio tracks
					const audioTracks = [...stream.getAudioTracks(), ...micStream.getAudioTracks()];
					finalStream = new MediaStream([...stream.getVideoTracks(), ...audioTracks]);
				} catch (error) {
					console.warn("Failed to obtain microphone permission, using system audio only:", error);
					// Continue with system audio only
				}
			}

			setMediaStream(finalStream);
			setRecordingState("ready");

			// Wait for the component to re-render before setting the video element
			setTimeout(() => {
				if (videoRef.current) {
					console.log("Setting video element...");
					videoRef.current.srcObject = finalStream;
					videoRef.current.muted = true; // To avoid audio feedback

					// Play the video
					const playVideo = async () => {
						try {
							console.log("Attempting to play the video...");
							await videoRef.current!.play();
							console.log("Video playback successful");
						} catch (error) {
							console.error("Video playback failed:", error);
						}
					};

					// Listen for multiple events to ensure the video is loaded
					videoRef.current.onloadedmetadata = () => {
						console.log(
							"Video metadata loaded, video resolution:",
							videoRef.current!.videoWidth,
							"x",
							videoRef.current!.videoHeight
						);
						playVideo();
					};

					videoRef.current.oncanplay = () => {
						console.log("Video can play, video resolution:", videoRef.current!.videoWidth, "x", videoRef.current!.videoHeight);
					};

					// Attempt to play the video immediately if the metadata is already loaded
					if (videoRef.current.readyState >= 1) {
						console.log("The video has metadata, attempting to play immediately");
						playVideo();
					}

					// Listen for the stream ending event
					const videoTrack = finalStream.getVideoTracks()[0];
					if (videoTrack) {
						videoTrack.addEventListener("ended", () => {
							console.log("Screen sharing has stopped");
							setRecordingState("idle");
							setMediaStream(null);
						});
					}
				} else {
					console.log("The video element has not been found yet");
				}
			}, 200);

			// Reset screenshot related states
			setScreenshots([]);
			setScreenshotStats({ total: 0, saved: 0 });
			lastImageDataRef.current = null;
		} catch (error) {
			console.error("Failed to prepare recording:", error);
			if (error instanceof Error) {
				if (error.name === "NotAllowedError") {
					alert("User denied screen recording permission. Please try again and allow screen sharing.");
				} else if (error.name === "NotSupportedError") {
					alert("Your browser does not support screen recording. Please use Chrome, Edge or Firefox browser.");
				} else {
					alert(`Failed to prepare recording: ${error.message}`);
				}
			} else {
				alert("Failed to prepare recording, please check browser permission settings.");
			}
		}
	}, [withAudio]);

	// Start recording with stream
	const handleStartRecording = useCallback(
		(stream?: MediaStream) => {
			const recordingStream = stream || mediaStream;

			if (!recordingStream) {
				alert("The media stream is not ready, please click prepare recording first");
				return;
			}

			try {
				console.log("Starting recording...");

				// Reset data
				recordedChunksRef.current = [];
				setRecordingTime(0);

				// Check recording format support
				const mimeTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];

				let supportedMimeType = "";
				for (const mimeType of mimeTypes) {
					if (MediaRecorder.isTypeSupported(mimeType)) {
						supportedMimeType = mimeType;
						console.log("Using recording format:", supportedMimeType);
						break;
					}
				}

				if (!supportedMimeType) {
					throw new Error("Browser does not support video recording format");
				}

				const mediaRecorder = new MediaRecorder(recordingStream, {
					mimeType: supportedMimeType,
					videoBitsPerSecond: 2500000, // 2.5 Mbps
				});

				mediaRecorderRef.current = mediaRecorder;

				mediaRecorder.ondataavailable = (event) => {
					console.log("Recording data available:", event.data.size, "bytes");
					if (event.data.size > 0) {
						recordedChunksRef.current.push(event.data);
					}
				};

				mediaRecorder.onstop = () => {
					console.log("Recording stopped, generating video file...");
					const blob = new Blob(recordedChunksRef.current, {
						type: supportedMimeType.split(";")[0],
					});
					setVideoUrl(URL.createObjectURL(blob));
					console.log("Video file generated successfully, size:", blob.size, "bytes");
					console.log("Number of screenshots:", screenshots.length);

					// Clean up video preview, stop media stream
					if (videoRef.current) {
						videoRef.current.srcObject = null;
					}
					if (recordingStream) {
						recordingStream.getTracks().forEach((track) => track.stop());
					}
					setMediaStream(null);

					setRecordingState("completed");
				};

				mediaRecorder.onerror = (event) => {
					console.error("Recording error:", event);
					alert("An error occurred during the recording process");
					setRecordingState("ready");
				};

				mediaRecorder.start(1000); // Collect data every second
				setRecordingState("recording");
				startTimer();
				startScreenshotCapture();
				console.log("Recording has started");
			} catch (error) {
				console.error("Recording startup failed:", error);
				alert(`Recording startup failed: ${error instanceof Error ? error.message : "Unknown error"}`);
			}
		},
		[mediaStream, screenshots.length, startTimer, startScreenshotCapture]
	);

	// Pause/Resume recording
	const handlePauseResume = useCallback(() => {
		if (!mediaRecorderRef.current) return;

		if (recordingState === "recording") {
			mediaRecorderRef.current.pause();
			setRecordingState("paused");
			stopTimer();
		} else if (recordingState === "paused") {
			mediaRecorderRef.current.resume();
			setRecordingState("recording");
			startTimer();
		}
	}, [recordingState, stopTimer, startTimer]);

	// Stop recording
	const handleStopRecording = useCallback(() => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
		}

		stopTimer();
		setRecordingState("processing");
	}, [stopTimer]);

	// Download PPT
	const handleDownloadPPT = useCallback(async () => {
		try {
			await createAndDownloadPPT(screenshots, {
				title: "Screen Recording Analysis",
				maxSlides: 256,
			});
		} catch (error) {
			console.error("Error generating PPT:", error);
			alert("Failed to generate PPT, please try again.");
		}
	}, [screenshots]);

	// Download video
	const handleDownloadVideo = useCallback(() => {
		if (videoUrl) {
			const a = document.createElement("a");
			a.href = videoUrl;
			a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.webm`;
			a.click();
		}
	}, [videoUrl]);

	// Reset everything
	const handleReset = useCallback(() => {
		setRecordingState("idle");
		setRecordingTime(0);
		setScreenshots([]);
		setScreenshotStats({ total: 0, saved: 0 });
		setVideoUrl("");

		cleanup();
	}, [cleanup]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			cleanup();
		};
	}, [cleanup]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white relative">
			{/* Background - Fixed to cover entire page */}
			<div className="fixed inset-0 z-0 overflow-hidden">
				{/* Gradient overlays */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-teal-900/20" />
				<div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-900/80 to-zinc-900/60" />

				{/* Grid pattern - covers entire viewport */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-100" />

				{/* Subtle animated elements */}
				<div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-3xl animate-pulse" />
				<div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl animate-pulse [animation-delay:3s]" />
			</div>

			{/* Header */}
			<header className="relative z-10 border-b border-zinc-800/50 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-4">
					<nav className="flex items-center justify-between">
						<Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
							<ArrowLeft className="h-5 w-5" />
							<span>Return to homepage</span>
						</Link>

						<div className="flex items-center space-x-2">
							<Monitor className="h-6 w-6 text-blue-400" />
							<span className="text-xl font-semibold">Screen Recording</span>
						</div>
					</nav>
				</div>
			</header>

			{/* Main Content */}
			<main className="relative z-10 container mx-auto px-6 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Recording Panel */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
							{/* Video Preview */}
							<div className="aspect-video rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 border border-zinc-600/30 overflow-hidden mb-6 relative">
								{recordingState === "idle" ? (
									<div className="flex h-full items-center justify-center flex-col space-y-4">
										<Monitor className="h-16 w-16 text-zinc-500" />
										<p className="text-zinc-400">Click to start preparing the screen recording</p>
										<p className="text-xs text-zinc-500">Make sure to use Chrome, Edge or Firefox browser for the best experience</p>
									</div>
								) : recordingState === "completed" && videoUrl ? (
									// Show the recorded video after completion
									<>
										<video src={videoUrl} className="w-full h-full object-cover" controls playsInline />

										{/* Completed indicator */}
										<div className="absolute top-4 left-4 flex items-center space-x-2 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1">
											<CheckCircle className="w-3 h-3" />
											<span className="text-sm font-medium">Recording completed</span>
										</div>
									</>
								) : (
									// Show real-time preview while recording - the video element always exists
									<>
										<video ref={videoRef} className="w-full h-full object-contain" muted playsInline autoPlay />
									</>
								)}

								{/* State indicator - overlays on top of the video */}
								{recordingState === "recording" && (
									<div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1 animate-pulse">
										<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
										<span className="text-sm font-medium">Recording</span>
									</div>
								)}

								{recordingState === "paused" && (
									<div className="absolute top-4 left-4 flex items-center space-x-2 bg-yellow-500/90 backdrop-blur-sm rounded-full px-3 py-1">
										<Pause className="w-3 h-3" />
										<span className="text-sm font-medium">Paused</span>
									</div>
								)}

								{recordingState === "ready" && (
									<div className="absolute top-4 left-4 flex items-center space-x-2 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1">
										<CheckCircle className="w-3 h-3" />
										<span className="text-sm font-medium">Ready to record</span>
									</div>
								)}

								{recordingState === "processing" && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/50">
										<div className="flex items-center space-x-3 text-white">
											<Loader2 className="h-8 w-8 animate-spin" />
											<span className="text-lg">Processing...</span>
										</div>
									</div>
								)}

								{/* Timer - shows in all states */}
								{(recordingState === "recording" || recordingState === "paused") && (
									<div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded px-3 py-1">
										<span className="font-mono text-lg text-white">{formatTime(recordingTime)}</span>
									</div>
								)}

								{/* Screenshot counter */}
								{screenshots.length > 0 && (recordingState === "recording" || recordingState === "paused") && (
									<div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded px-3 py-1">
										<span className="text-sm text-white">{screenshots.length} screenshots</span>
									</div>
								)}
							</div>

							{/* Controls */}
							<div className="flex flex-col space-y-4">
								{/* Audio Settings */}
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Settings className="h-5 w-5 text-zinc-400" />
										<span className="text-sm text-zinc-300">Recording settings</span>
									</div>

									<Button
										variant="outline"
										size="sm"
										onClick={() => setWithAudio(!withAudio)}
										className="border-zinc-700 text-white hover:bg-zinc-800"
										disabled={recordingState !== "idle"}
									>
										{withAudio ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
										{withAudio ? "With microphone audio" : "System audio only"}
									</Button>
								</div>

								{/* Action Buttons */}
								<div className="flex space-x-4">
									{recordingState === "idle" && (
										<Button
											onClick={handleStartPrepare}
											className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
										>
											<Monitor className="mr-2 h-5 w-5" />
											Prepare for recording
										</Button>
									)}

									{recordingState === "ready" && (
										<Button
											onClick={() => handleStartRecording()}
											className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
										>
											<Play className="mr-2 h-5 w-5" />
											Start recording
										</Button>
									)}

									{(recordingState === "recording" || recordingState === "paused") && (
										<>
											<Button
												onClick={handlePauseResume}
												variant="outline"
												className="border-zinc-700 text-white hover:bg-zinc-800"
											>
												{recordingState === "recording" ? (
													<>
														<Pause className="mr-2 h-4 w-4" />
														Pause
													</>
												) : (
													<>
														<Play className="mr-2 h-4 w-4" />
														Continue
													</>
												)}
											</Button>

											<Button
												onClick={captureScreenshot}
												variant="outline"
												className="border-zinc-700 text-white hover:bg-zinc-800"
												title="Take a screenshot"
											>
												<Camera className="mr-2 h-4 w-4" />
												Take a screenshot
											</Button>

											<Button onClick={handleStopRecording} variant="destructive" className="flex-1">
												<Square className="mr-2 h-4 w-4" />
												Stop recording
											</Button>
										</>
									)}

									{recordingState === "processing" && (
										<Button disabled className="flex-1">
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Processing...
										</Button>
									)}

									{recordingState === "completed" && (
										<>
											<Button
												onClick={handleDownloadPPT}
												className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
												disabled={screenshots.length === 0}
											>
												<Download className="mr-2 h-5 w-5" />
												Generate PPT ({screenshots.length} slides)
											</Button>

											<Button
												onClick={handleDownloadVideo}
												variant="outline"
												className="border-zinc-700 text-white hover:bg-zinc-800"
											>
												<Download className="mr-2 h-4 w-4" />
												Download video
											</Button>

											<Button
												onClick={handleReset}
												variant="outline"
												className="border-zinc-700 text-white hover:bg-zinc-800"
											>
												Restart recording
											</Button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Info Panel */}
					<div className="space-y-6">
						{/* Status */}
						<div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
							<h3 className="text-lg font-semibold mb-4">Recording Status</h3>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Current status</span>
									<div className="flex items-center space-x-2">
										{recordingState === "recording" && (
											<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
										)}
										{recordingState === "paused" && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
										{recordingState === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
										<span className="capitalize">
											{recordingState === "idle" && "Waiting to start"}
											{recordingState === "ready" && "Ready to start"}
											{recordingState === "recording" && "Recording"}
											{recordingState === "paused" && "Paused"}
											{recordingState === "processing" && "Processing"}
											{recordingState === "completed" && "Completed"}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Recording Time</span>
									<span className="font-mono">{formatTime(recordingTime)}</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-zinc-400">Number of Screenshots</span>
									<span>{screenshots.length}</span>
								</div>

								{screenshotStats.total > 0 && (
									<div className="flex items-center justify-between">
										<span className="text-zinc-400">Screenshot Statistics</span>
										<span className="text-sm">
											Saved {screenshotStats.saved} / Detected {screenshotStats.total}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Screenshots Preview */}
						{screenshots.length > 0 && (
							<div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-6 backdrop-blur-sm hover:border-zinc-600/70 transition-all duration-300">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Screenshot Preview ({screenshots.length} images)</h3>
									<div className="flex gap-2">
										<Button
											onClick={() => {
												// Bulk download function
												screenshots.forEach((screenshot, index) => {
													const link = document.createElement("a");
													link.href = screenshot;
													link.download = `screenshot_${String(index + 1).padStart(3, "0")}.png`;
													document.body.appendChild(link);
													link.click();
													document.body.removeChild(link);
												});
											}}
											variant="outline"
											size="sm"
											className="border-zinc-700 text-white hover:bg-zinc-800"
										>
											<Images className="mr-1 h-4 w-4" />
											Bulk Download All
										</Button>
									</div>
								</div>

								{/* Scroll preview area */}
								<div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
									{screenshots.map((screenshot, index) => (
										<div
											key={index}
											className="aspect-video rounded-lg overflow-hidden border border-zinc-600/30 group relative"
										>
											<Image
												src={screenshot}
												alt={`Screenshot ${index + 1}`}
												className="w-full h-full object-cover"
												width={320}
												height={180}
												unoptimized
											/>
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<div className="flex gap-2">
													<Button
														onClick={() => {
															const link = document.createElement("a");
															link.href = screenshot;
															link.download = `screenshot_${String(index + 1).padStart(3, "0")}.png`;
															document.body.appendChild(link);
															link.click();
															document.body.removeChild(link);
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
						<div className="rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 p-6 backdrop-blur-sm hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-900/30 hover:to-purple-900/30 transition-all duration-300">
							<h3 className="text-lg font-semibold mb-4 text-blue-300">Tips for use</h3>

							<ul className="space-y-2 text-sm text-blue-200">
								<li>• The system will automatically detect changes in the screen and take screenshots</li>
								<li>• It is recommended to turn off unnecessary notifications before recording</li>
								<li>• The function to pause and continue recording is supported</li>
								<li>• The PPT can be generated directly after the recording is complete</li>
							</ul>
						</div>
					</div>
				</div>
			</main>

			{/* Hidden canvas for screenshot processing */}
			<canvas ref={canvasRef} className="hidden" />
		</div>
	);
};

export default ScreenRecordingPage;
