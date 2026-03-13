import React, { ChangeEvent, useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Code, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { api, getResponseData } from "@/lib/api";
import toast from "react-hot-toast";
import AdvancedSlideStudio from "./PPTView";

interface Slide {
	slide_index: number;
	title: string;
	bullets: string[];
}

const INITIAL_DATA: Slide[] = [
	{
		slide_index: 1,
		title: "PROGRAMMING LANGUAGES",
		bullets: [
			"In this session we are going to learn the basic concepts of Java, understand why Java is one of the most popular programming languages in the world.",
			"One of the most famous principles of Java is “Write Once, Run Anywhere.”",
		],
	},
	{
		slide_index: 2,
		title: "JAVA COMPILER",
		bullets: [
			"This file is then compiled using the Java compiler.",
			"This bytecode is stored in a file with the extension dot class.",
		],
	},
];

const MetaPointPage = ({ silde }: { silde: any[] }) => {
	const [slides, setSlides] = useState<any[]>(silde || INITIAL_DATA);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [showJson, setShowJson] = useState<boolean>(false);
	const [statusMsg, setStatusMsg] = useState<string>("");
	const [isFocused, setIsFocused] = useState<number | null>(null);
	const [showPPT, setShowPPT] = useState<boolean>(false);
	const [pptLoading, setPPTLoading] = useState<boolean>(false);
	const [ppt, setPPT] = useState<any>([]);

	const activeSlide: any = slides[activeIndex];

	useEffect(() => {
		if (statusMsg) {
			const timer = setTimeout(() => setStatusMsg(""), 3000);
			return () => clearTimeout(timer);
		}
	}, [statusMsg]);

	const handleUpdateTitle = (val: string) => {
		const newSlides = [...slides];
		newSlides[activeIndex].title = val;
		setSlides(newSlides);
	};

	const handleUpdateBullet = (bulletIdx: number, val: string) => {
		const newSlides = [...slides];
		newSlides[activeIndex].bullets[bulletIdx] = val;
		setSlides(newSlides);
	};

	const handleAddBullet = () => {
		const newSlides = [...slides];
		newSlides[activeIndex].bullets.push("");
		setSlides(newSlides);
		setIsFocused(newSlides[activeIndex].bullets.length - 1);
	};

	const handleDeleteBullet = (bulletIdx: number) => {
		const newSlides = [...slides];
		newSlides[activeIndex].bullets.splice(bulletIdx, 1);
		setSlides(newSlides);
	};

	const handleAddSlide = () => {
		const newSlide: Slide = {
			slide_index: slides.length + 1,
			title: "NEW SECTION",
			bullets: [""],
		};
		setSlides([...slides, newSlide]);
		setActiveIndex(slides.length);
		setStatusMsg("New page created");
	};

	const nextSlide = () => setActiveIndex((prev) => (prev + 1) % slides.length);
	const prevSlide = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

	const copyToClipboard = () => {
		const json = JSON.stringify({ success: true, data: slides }, null, 4);
		const textArea = document.createElement("textarea");
		textArea.value = json;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand("copy");
			setStatusMsg("Data Copied");
		} catch (err) {
			console.error("Fallback: Oops, unable to copy", err);
		}
		document.body.removeChild(textArea);
		setShowJson(false);
	};

	const generateSlides = async () => {
		if (silde?.length <= 0) {
			toast.error("Please add at least one slide");
			return;
		}
		try {
			setShowPPT(true);
			setPPTLoading(true);
			const serverRes = await getResponseData(await api.post("/getSlides", { slideArray: silde }));
			const data = serverRes?.res?.data;
			setPPT(data);
			setPPTLoading(false);

			console.log(data);

		} catch (err: any) {
			toast.error(err.message);
			setShowPPT(false);
		}
	}

	return (
		<>
			{showPPT ? (<AdvancedSlideStudio loading={pptLoading} slidesArray={ppt} />) : (
				<div className="min-h-screen text-slate-200 animate-in fade-in duration-700 overflow-x-hidden">
					{/* Top Action Bar */}
					<div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
						<div className="flex items-center gap-4 md:hidden ">
							<div className="h-10 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] hidden sm:block" />
							<div>
								<h2 className="text-white font-bold tracking-tight text-lg sm:text-base">Content Editor</h2>
								<p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-widest">
									Slide {activeIndex + 1} of {slides?.length}
								</p>
							</div>
						</div>
						<div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
							<div className="flex gap-6 w-full sm:w-auto justify-between  sm:justify-start">
								<button
									onClick={prevSlide}
									className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 hover:text-white transition-colors group"
								>
									<ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> PREVIOUS
								</button>
								<button
									onClick={nextSlide}
									className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 hover:text-white transition-colors group"
								>
									NEXT <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</button>
							</div>

							{statusMsg && (
								<div className="flex items-center gap-2 text-emerald-400 text-[10px] sm:text-xs font-bold animate-pulse">
									<CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
									{statusMsg.toUpperCase()}
								</div>
							)}
						</div>
						<div className="flex flex-col items-start md:flex-row md:items-center gap-2 w-full sm:w-auto">
							<button
								onClick={() => setShowJson(true)}
								className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-all bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700"
							>
								<Code className="w-4 h-4" />
								<span className="sm:inline">JSON</span>
							</button>
							<button
								onClick={() => {
									setStatusMsg("All changes synced");
								}}
								className="flex-2 sm:flex-none group flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 border border-white/10"
							>
								<Save className="w-4 h-4" />
								<span>Sync</span>
							</button>
							<button
								onClick={() => {
									generateSlides();
								}}
								className="flex-2 sm:flex-none group flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all active:scale-95 border border-white/10"
							>
								<span>Proceed to Genrate</span>

								<svg
									className="w-6 h-5 group-hover:translate-x-1 transition-transform"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="ArrowRightIcon" />
									<path d="M13 7l5 5m0 0l-5 5m5-5H6" />
								</svg>
							</button>
						</div>
					</div>

					<div className="w-full mx-auto flex flex-col gap-6 lg:gap-8">
						{/* Navigation Rail - Responsive: Horizontal on Mobile, Vertical on Desktop */}
						<div className="w-full flex items-center gap-3 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 scrollbar-hide">
							{slides.map((_, idx) => (
								<button
									key={idx}
									onClick={() => setActiveIndex(idx)}
									className={`shrink-0 transition-all duration-300 ${activeIndex === idx
										? "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] w-8 h-2 rounded-full"
										: "bg-slate-800 hover:bg-slate-700 w-2 h-2 rounded-full"
										}`}
									aria-label={`Go to slide ${idx + 1}`}
								/>
							))}
							<button
								onClick={handleAddSlide}
								className="shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all ml-2 lg:ml-0 lg:mt-4"
							>
								<Plus className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</div>

						{/* Main Work Surface */}
						<div className="lg:col-span-11 w-full">
							<div className="bg-[#0B1120] border border-slate-800/60 rounded-2xl sm:rounded-4xl shadow-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden backdrop-blur-sm">
								{/* Background Accent */}
								<div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full hidden sm:block" />

								<div className="relative space-y-10 lg:space-y-16">
									{/* Header Input Area */}
									<div className="group relative">
										<div className="flex items-center gap-2 mb-3">
											<span className="h-px w-4 sm:w-8 bg-indigo-500/40" />
											<span className="text-[9px] sm:text-[10px] font-black text-indigo-500 tracking-[0.2em] uppercase">
												Section Title
											</span>
										</div>
										<div className="relative">
											<input
												type="text"
												value={activeSlide?.title}
												onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateTitle(e.target.value)}
												className="w-full bg-transparent border-none text-3xl sm:text-5xl lg:text-7xl font-black text-white placeholder:text-slate-900 outline-none transition-all leading-tight tracking-tight focus:ring-0 selection:bg-indigo-500/30 p-0"
												placeholder="ENTER TITLE..."
											/>
											<div className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-indigo-500 to-transparent group-hover:w-1/3 transition-all duration-500" />
										</div>
									</div>

									{/* Bullet Points Workspace */}
									<div className="space-y-6 sm:space-y-8">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 sm:gap-3">
												<div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-lg">
													<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
												</div>
												<h3 className="text-xs sm:text-sm font-bold text-slate-300 tracking-wide uppercase">
													Core Information
												</h3>
											</div>
											<button
												onClick={handleAddBullet}
												className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 hover:text-white transition-colors"
											>
												<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-800 flex items-center justify-center">
													<Plus className="w-3 h-3" />
												</div>
												<span>NEW POINT</span>
											</button>
										</div>

										<div className="space-y-4 sm:space-y-6">
											{activeSlide?.bullets?.map((bullet: any, bIdx: any) => (
												<div
													key={bIdx}
													className={`group/item relative flex gap-3 sm:gap-6 p-4 sm:p-8 rounded-xl sm:rounded-3xl transition-all duration-500 border ${isFocused === bIdx
														? "bg-indigo-500/3 border-indigo-500/30 shadow-xl"
														: "bg-transparent border-slate-800/40 hover:border-slate-700"
														}`}
												>
													<div className="flex flex-col items-center gap-3 sm:gap-4 shrink-0">
														<div
															className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isFocused === bIdx
																? "bg-indigo-400 scale-150 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
																: "bg-slate-700"
																}`}
														/>
														<div className="w-px flex-1 bg-slate-800 group-hover/item:bg-slate-700 transition-colors" />
													</div>

													<div className="flex-1">
														<textarea
															value={bullet}
															onFocus={() => setIsFocused(bIdx)}
															onBlur={() => setIsFocused(null)}
															onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleUpdateBullet(bIdx, e.target.value)}
															rows={1}
															onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
																const target = e.target as HTMLTextAreaElement;
																target.style.height = "auto";
																target.style.height = target.scrollHeight + "px";
															}}
															className="w-full bg-transparent border-none text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed outline-none resize-none focus:ring-0 placeholder:text-slate-800 selection:bg-indigo-500/40 p-0"
															placeholder="Detail your thoughts..."
														/>
													</div>

													<div className="flex flex-row sm:flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity">
														<button
															onClick={() => handleDeleteBullet(bIdx)}
															className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
															aria-label="Delete bullet"
														>
															<Trash2 className="w-4 h-4" />
														</button>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* JSON Preview Modal */}
					{showJson && (
						<div className="fixed pt-10 h-full inset-0 z-9999 flex justify-center  bg-gray-300/5 backdrop-blur-sm">
							<div className="bg-[#0F172A] w-full max-w-3xl rounded-2xl sm:rounded-4xl border border-slate-800 shadow-3xl overflow-hidden flex flex-col scale-in-center max-h-[90vh]">
								<div className="p-5 sm:p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
											<Code className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
										</div>
										<div>
											<h3 className="text-white font-bold tracking-tight text-sm sm:text-base">Export Data Object</h3>
											<p className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-bold">
												Standard JSON Format
											</p>
										</div>
									</div>
									<button
										onClick={() => setShowJson(false)}
										className="text-slate-500 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-all"
									>
										<X className="w-5 h-5 sm:w-6 sm:h-6" />
									</button>
								</div>
								<div className="flex-1 overflow-auto p-6 sm:p-10 bg-[#020617]/50 font-mono text-[11px] sm:text-sm leading-relaxed text-indigo-300 scrollbar-hide">
									<pre className="whitespace-pre-wrap break-all">
										{JSON.stringify({ success: true, data: slides }, null, 4)}
									</pre>
								</div>
								<div className="p-5 sm:p-8 bg-[#0F172A] border-t border-slate-800 flex justify-end gap-4">
									<button
										onClick={copyToClipboard}
										className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-slate-950 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95"
									>
										COPY TO CLIPBOARD
									</button>
								</div>
							</div>
						</div>
					)}

					<style jsx>{`
				input::placeholder,
				textarea::placeholder {
					font-weight: 900;
					opacity: 0.1;
				}
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
				.scrollbar-hide {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
				</div>
			)}
		</>
	);
};

export default MetaPointPage;
