import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { api, getResponseData } from "@/lib/api";
import NoRecordFound from "../NoRecordFound";
import ProgressTracker from "../Progress";
import VideoPlayer from "../VideoPlayer";
import MetaPointPage from "./Meta-point";

const LoadingSteps = ["Loading Media", "Extracting Media", "Media Extracted", "Generating Slides", "All Most Done..."];

const VideoPreviewPage = ({
	data,
	fileId = 0,
	showPreview,
}: {
	data: any;
	fileId?: number;
	showPreview: (a: boolean) => void;
}) => {
	// const [ppt, setPPT] = useState<any>([]);
	const [isLoadingPPT, setIsLoadingPPT] = useState(false);
	const [showPPT, setShowPPT] = useState(false);
	const [slide, setSlides] = useState<any[]>([]);

	const [loadingStepCount, setLoadingStepCount] = useState<number>(0);

	const video = data[0]; // Accessing the first item in your array
	console.log("video", video);

	useEffect(() => {
		if (video?.type == "LOCAL_VIDEO") {
			getSlideData();
		}
	}, []);

	const getSlideData = async () => {
		setIsLoadingPPT(true);
		const interval: any = [];
		const loadingStepsTimes = [5000, 11000, 17000];
		loadingStepsTimes.forEach((time, index) => {
			interval.push(
				setTimeout(() => {
					setLoadingStepCount(index + 1);
				}, time)
			);
		});
		try {
			const serverRes = await getResponseData(await api.post("/ppt/transcript", { audio: video?.audioUrl }));
			if (serverRes?.res?.success) setLoadingStepCount(3);
			const slides = await getResponseData(
				await api.post("/video/processTranscript", {
					transcript: serverRes?.res?.data,
				})
			);
			toast.success("Slide generated successfully");
			console.log(slides);

			setSlides(slides?.res?.data?.data as Array<any>);
			setIsLoadingPPT(false);
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			interval.forEach((timer: any) => clearTimeout(timer));
			setLoadingStepCount(0);
		}
	};

	const makePPTRequest = async () => {
		try {
			// console.log(video)
			// setIsLoadingPPT(true);
			setShowPPT(true);
			getSlideData();
			// const data = await getResponseData(await api.post("/ppt/response", {
			//     fileId: video?.id,
			//     audio: video?.audioUrl
			// }));
			// console.log("data", data?.res?.data?.slides);

			// setPPT(data?.res?.data?.slides);
			// console.log(data?.res?.slides);

			// setIsLoadingPPT(false);
		} catch (err: any) {
			// setIsLoadingPPT(false);
			setShowPPT(false);
			toast.error(err.message);
		}
	};

	return (
		<>
			{/* {showPPT ? (<AdvancedSlideStudio slidesArray={ppt || []} loading={isLoadingPPT} />) : ( */}
			{showPPT || video?.type == "LOCAL_VIDEO" ? (
				isLoadingPPT ? (
					<ProgressTracker steps={LoadingSteps} currentStep={loadingStepCount} />
				) : (
					<MetaPointPage silde={slide} fileId={fileId} />
				)
			) : video?.type == "YOUTUBE" ? (
				<div className="min-h-screen p-3 text-gray-100 font-sans">
					{/* Header Area */}

					<div className="w-full mx-auto mb-8">
						<h1 className="text-2xl font-bold border-l-4 border-red-600 pl-4">Confirm Video Details</h1>
						<p className="text-gray-400 mt-2 text-sm">Review the extracted metadata below before proceeding.</p>
					</div>

					<div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* LEFT COLUMN: Visuals */}
						<div className="lg:col-span-2 space-y-6">
							<div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-[#0f172a] shadow-2xl">
								{/* Using the Cloudinary Video URL for a live preview */}
								<VideoPlayer url={video?.videoUrl} poster={video?.thumbnail} />
							</div>

							<div className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800">
								<h2 className="text-xl font-bold mb-4">Description</h2>
								<p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap h-30 overflow-y-hidden pr-2 custom-scrollbar">
									{video?.description}
								</p>
							</div>
						</div>

						{/* RIGHT COLUMN: Metadata & Links */}
						<div className="space-y-6">
							<div className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800">
								<h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Title</h3>
								<h2 className="text-lg font-semibold mb-4 leading-snug">{video?.title}</h2>

								<div className="flex gap-3 mb-6">
									<span className="bg-red-900/30 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-800/50">
										{video?.categories?.[0]}
									</span>
									<span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
										{video?.durationString}
									</span>
								</div>

								<div className="space-y-4">
									<h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Available Assets</h3>
									<div className="flex flex-col gap-2">
										<a
											href={video?.videoUrl}
											download
											className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-gray-700"
										>
											<span className="text-sm">Video Stream (MP4)</span>
											<span className="text-xs text-green-500 font-mono">Ready</span>
										</a>
										<a
											href={video?.audioUrl}
											download
											className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-gray-700"
										>
											<span className="text-sm">Audio Track (MP3)</span>
											<span className="text-xs text-green-500 font-mono">Ready</span>
										</a>
									</div>
								</div>
							</div>

							<div className="bg-[#0f172a] p-6 rounded-2xl border border-gray-800">
								<h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Tags</h3>
								<div className="flex flex-wrap gap-2 ">
									{video?.tags?.length <= 0 ? (
										<NoRecordFound size="sm" />
									) : (
										video?.tags?.slice(0, 10)?.map((tag: string, index: number) => (
											<span
												key={index}
												className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded hover:text-white cursor-default"
											>
												#{tag.replace(/\s+/g, "")}
											</span>
										))
									)}
								</div>
							</div>

							{/* ACTION BUTTON SECTION */}
							<div className="mt-8">
								<button
									onClick={() => makePPTRequest()} // Replace with your routing logic (e.g., navigate('/next-gen'))
									className="w-full group relative flex items-center justify-center gap-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
								>
									<span className="text-lg">Proceed to Summarize</span>
									<svg
										className="w-5 h-5 group-hover:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="ArrowRightIcon" />
										<path d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>

									{/* Subtle Animated Ring */}
									<span className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-pulse"></span>
								</button>

								<button
									onClick={() => showPreview(false)}
									className="flex items-center justify-center py-3 mt-4 w-full gap-2 bg-linear-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-bold  px-6 rounded-2xl shadow-[0_0_20px_RGBA(220,38,38,0.3)] hover:shadow-[0_0_30px_RGBA(220,38,38,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
								>
									<ArrowLeft className="w-5 h-5" />
									<span className="text-lg">Go Back</span>
								</button>
								<p className="text-center text-gray-500 text-xs mt-4">
									By clicking proceed, you agree to generate AI assets for this video.
								</p>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default VideoPreviewPage;
