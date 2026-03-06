"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Layers, MessageSquare, Monitor, Save, Zap } from "lucide-react";

// Assuming you have a UI Button component, otherwise replace with <button>
import { Button } from "@/components/ui/button";
import StudioSkeleton from "../StudioSkeleton";

// 1. Define the interfaces
interface SlideData {
	slideIndex: number;
	title: string;
	htmlContent: string;
	speakerNotes: string;
	detailedNotes?: string;
}

interface AdvancedSlideStudioProps {
	slidesArray: SlideData[];
	loading: boolean;
}

// Helper to wrap HTML for sidebar previews
const wrapSlideHtml = (html: string) => `
  <html> <head> <style> * { box-sizing: border-box; margin: 0; padding: 0; } body, html { width: 100%; height: 100%; overflow: hidden; background: #111; display: flex; align-items: center; justify-content: center; } .canvas { width: 100vw; height: 56.25vw; /* 16:9 Aspect Ratio */ max-height: 100vh; max-width: 177.78vh; background: white; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); } .content { width: 100%; height: 100%; position: relative; } [contenteditable="true"]:focus { outline: 3px solid #3b82f6; outline-offset: -3px; background: rgba(59, 130, 246, 0.05); } h1, h2, h3, p { cursor: text; } </style> </head> <body> <div class="canvas"><div class="content">${html}</div></div> </body> </html>
`;

const AdvancedSlideStudio = ({ slidesArray, loading }: AdvancedSlideStudioProps) => {
	// 2. Initialize state with props
	const [slides, setSlides] = useState<SlideData[]>([]);
	const [currentIdx, setCurrentIdx] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	// 3. Keep internal state in sync if props change externally
	useEffect(() => {
		setSlides(slidesArray);
	}, [slidesArray]);

	const injectContent = (html: string) => {
		const doc = iframeRef.current?.contentDocument;
		if (!doc) return;
		doc.open();
		doc.write(`
<html> <head> <style> * { box-sizing: border-box; margin: 0; padding: 0; } body, html { width: 100%; height: 100%; overflow: hidden; background: #111; display: flex; align-items: center; justify-content: center; } .canvas { width: 100vw; height: 56.25vw; /* 16:9 Aspect Ratio */ max-height: 100vh; max-width: 177.78vh; background: white; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); } .content { width: 100%; height: 100%; position: relative; } [contenteditable="true"]:focus { outline: 3px solid #3b82f6; outline-offset: -3px; background: rgba(59, 130, 246, 0.05); } h1, h2, h3, p { cursor: text; } </style> </head> <body> <div class="canvas"><div class="content">${html}</div></div> </body> </html>
        `);
		doc.close();
		doc.designMode = "on";
	};

	useEffect(() => {
		if (slides?.length > 0) injectContent(slides[currentIdx].htmlContent);
	}, [currentIdx, slides]);

	const handleSave = () => {
		setIsSaving(true);
		const doc = iframeRef.current?.contentDocument;
		const root = doc?.querySelector(".content");
		if (root) {
			const updatedHTML = root.innerHTML;
			const updatedSlides = [...slides];
			updatedSlides[currentIdx].htmlContent = updatedHTML;
			setSlides(updatedSlides);

			// Optional: If you want to notify the parent component
			// onSave(updatedSlides);
		}
		setTimeout(() => setIsSaving(false), 800);
	};

	if (loading) {
		return <StudioSkeleton />;
	}

	if (slides?.length === 0 && !loading) {
		return (
			<div className="h-screen w-full -m-8 flex items-center justify-center relative overflow-hidden font-sans">
				{/* Subtle Animated Background Decorations */}
				<div className="absolute inset-0 z-0">
					<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
					<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
				</div>

				{/* Glassmorphism Empty Card */}
				<div className="relative z-10 flex flex-col items-center text-center p-8 md:p-12 rounded-3xl border border-white/10 bg-white/2 backdrop-blur-xl max-w-md mx-4 shadow-2xl">
					<div className="w-20 h-20 mb-6 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center group transition-transform duration-500 hover:rotate-12">
						<Layers className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
					</div>

					<h2 className="text-2xl font-black tracking-tight text-white mb-3">No Slides Found</h2>

					<p className="text-slate-400 text-sm leading-relaxed mb-8">
						We couldn't find any slide data to display. Please check your data source or try generating a new
						presentation.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 w-full">
						<button className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
							REFRESH SYSTEM
						</button>
					</div>

					<div className="mt-8 flex items-center gap-2 opacity-30">
						<Zap size={12} className="text-blue-400 fill-blue-400" />
						<span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Engine Offline</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-[90vh] md:h-[99vh] -m-7 text-slate-100 flex flex-col font-sans overflow-hidden">
			{/* --- TOP NAVIGATION BAR --- */}
			<nav className="h-18 md:h-22.5 shrink-0 bg-[#0f172a] backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between z-50">
				<div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
					<button className="px-3 py-1.5 text-[10px] font-bold bg-white/10 rounded-lg flex items-center gap-2">
						<Monitor size={14} className="text-blue-400" /> EDIT
					</button>
					<button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-colors">
						PREVIEW
					</button>
				</div>

				<Button
					onClick={handleSave}
					className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
				>
					{isSaving ? <CheckCircle size={14} className="animate-bounce" /> : <Save size={14} />}
					<span className="hidden sm:inline ml-2">SAVE & EXPORT</span>
				</Button>
			</nav>

			<div className="flex flex-1 flex-col md:flex-row min-h-0 overflow-hidden">
				{/* --- SIDEBAR: Filmstrip (Responsive) --- */}
				<aside className="w-full md:bg-[#0f172a] md:w-20 lg:w-64 border-r border-white/5 flex flex-col order-2 md:order-1 overflow-hidden">
					<div className="hidden lg:flex md:justify-between p-6 items-center gap-2 opacity-50">
						<div className="flex gap-2">
							<Layers size={14} />
							<span className="text-[10px] font-black uppercase tracking-widest">Outline</span>
						</div>
						<div className="text-[12px] text-black w-5 h-5 flex items-center justify-center bg-gray-300 rounded-full">
							{slides?.length}
						</div>
					</div>

					<div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto p-4 gap-4 no-scrollbar h-full">
						{slides?.map((slide, i) => (
							<button
								key={i}
								onClick={() => setCurrentIdx(i)}
								className={`shrink-0 w-32 md:w-full aspect-video rounded-xl transition-all border-2 overflow-hidden relative
                                         ${
																						currentIdx === i
																							? "border-blue-500 bg-blue-500/10"
																							: "border-white/5 bg-white/5 grayscale opacity-60 hover:opacity-100"
																					}`}
							>
								<div className="absolute inset-0">
									<iframe
										className="w-full h-full pointer-events-none border-none"
										sandbox="allow-same-origin"
										srcDoc={wrapSlideHtml(slide.htmlContent)}
									/>
								</div>
								<div className="absolute bottom-1 right-2 text-[10px] font-bold text-white/40">{i + 1}</div>
							</button>
						))}
					</div>
				</aside>

				{/* --- MAIN CANVAS AREA --- */}
				<section className="flex-1 relative p-6 flex items-center justify-center order-1 bg-slate-950">
					<div className="w-full h-full max-w-6xl flex flex-col gap-6">
						<div className="flex-1 w-full h-fit flex justify-center relative group">
							<div className="w-full h-fit max-w-240 object-contain aspect-video rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 bg-white ring-1 ring-white/10 relative">
								<iframe ref={iframeRef} className="w-full h-full border-none origin-top-left" />

								{/* Controls */}
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto flex items-center gap-6 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
									<button
										onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
										className="hover:text-blue-400 transition-colors disabled:opacity-30"
										disabled={currentIdx === 0}
									>
										<ChevronLeft size={20} />
									</button>

									<span className="text-xs font-black tracking-widest tabular-nums">
										{currentIdx + 1} / {slides?.length}
									</span>

									<button
										onClick={() => setCurrentIdx(Math.min(slides?.length - 1, currentIdx + 1))}
										className="hover:text-blue-400 transition-colors disabled:opacity-30"
										disabled={currentIdx === slides?.length - 1}
									>
										<ChevronRight size={20} />
									</button>
								</div>
							</div>
						</div>

						{/* SPEAKER NOTES PANEL (Mobile only based on your snippet) */}
						<div className="h-74 md:h-48 bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden flex flex-col">
							<div className="flex cursor-pointer items-center gap-2 mb-3 text-blue-400">
								<MessageSquare size={14} />
								<span className="text-[10px] font-black uppercase tracking-widest">Speaker Notes</span>
							</div>
							<div
								className="flex-1 overflow-y-auto text-sm text-slate-400 font-medium leading-relaxed"
								style={{ scrollbarWidth: "thin" }}
							>
								{slides?.[currentIdx].speakerNotes}
							</div>
						</div>
					</div>
				</section>
			</div>

			<style jsx global>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
};

export default AdvancedSlideStudio;
