"use client";

import React, { useState } from "react";
import {
	CheckCircle2,
	FileText,
	Link as LinkIcon,
	Mic,
	Settings,
	Sparkles,
	Upload,
	Video,
	Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoToPPTPage() {
	const [sourceType, setSourceType] = useState("video");
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	// Simple mock upload trigger
	const handleUpload = () => {
		setIsUploading(true);
		let prog = 0;
		const interval = setInterval(() => {
			prog += 10;
			setUploadProgress(prog);
			if (prog >= 100) {
				clearInterval(interval);
				setTimeout(() => setIsUploading(false), 1000);
			}
		}, 200);
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Header Space (Assuming your layout handles this) */}

			<main className="flex-1 flex flex-col items-center justify-center p-0">
				<div className=" w-full space-y-8">
					{/* Main Ingester Card */}
					<Card className=" bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
						<CardContent className="p-0">
							<Tabs defaultValue="video" onValueChange={setSourceType} className="w-full">
								<div className="border-b dark:border-gray-700 bg-[#0f172a] p-4 pt-6 -mt-6">
									<TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gray-200/50 dark:bg-gray-800/50">
										<TabsTrigger value="video" className="gap-2">
											<Video size={16} /> Video
										</TabsTrigger>
										<TabsTrigger value="audio" className="gap-2">
											<Mic size={16} /> Audio
										</TabsTrigger>
									</TabsList>
								</div>

								<div className="p-8 space-y-6">
									{/* URL Input Section */}
									<div className="space-y-4">
										<div className="relative">
											<div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
												{sourceType === "video" ? <Youtube size={20} /> : <LinkIcon size={20} />}
											</div>
											<Input
												placeholder={sourceType === "video" ? "Paste YouTube or Video URL..." : "Paste Audio URL..."}
												className="pl-10 h-14 text-md border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 rounded-xl bg-white dark:bg-gray-900"
											/>
										</div>

										<div className="relative flex items-center py-2">
											<div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
											<span className="flex-shrink mx-4 text-gray-400 text-sm font-medium uppercase tracking-wider">
												OR
											</span>
											<div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
										</div>

										{/* File Dropzone */}
										<div
											onClick={() => !isUploading && handleUpload()}
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
														<p className="text-lg font-semibold text-gray-900 dark:text-white">
															Click to upload or drag and drop
														</p>
														<p className="text-sm text-gray-500">MP4, MOV, MP3, or WAV (Max 500MB)</p>
													</div>
												</>
											)}
										</div>
									</div>

									{/* Settings & Generate Button */}
									<div className="flex flex-col sm:flex-row gap-4 pt-4">
										<Button variant="outline" className="flex-1 h-12 rounded-xl gap-2">
											<Settings size={18} /> Presentation Settings
										</Button>
										<Button className="flex-[2] h-12 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow-lg shadow-blue-500/25 gap-2 text-md font-bold">
											<Sparkles size={18} /> Generate Slides
										</Button>
									</div>
								</div>
							</Tabs>
						</CardContent>
					</Card>

					{/* Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
						{[
							{
								icon: <CheckCircle2 className="text-green-500" />,
								title: "Auto Transcription",
								desc: "Perfectly transcribed text from any speaker.",
							},
							{
								icon: <FileText className="text-blue-500" />,
								title: "AI Summarization",
								desc: "Key points extracted and turned into slides.",
							},
							{
								icon: <Sparkles className="text-purple-500" />,
								title: "Designer Layouts",
								desc: "Beautifully designed slides based on content.",
							},
						].map((f, i) => (
							<div key={i} className="flex gap-4 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 border border-white/20">
								<div className="mt-1">{f.icon}</div>
								<div>
									<h4 className="font-bold text-gray-900 dark:text-white">{f.title}</h4>
									<p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>

			{/* Footer Space (Assuming your layout handles this) */}
		</div>
	);
}
