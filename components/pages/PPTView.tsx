"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, Download, Layers, MessageSquare, Monitor, Save, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudioSkeleton from "../StudioSkeleton";
import { downloadPresentation, fixDesignLayout } from "@/lib/ppt-generation";

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

/**
 * SHARED STYLE CONSTANT
 * This ensures both the editor and the sidebar previews use the exact same scaling logic.
 */
const SLIDE_CORE_CSS = `
 * { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }
  
  body, html { 
    width: 1280px; 
    height: 720px; 
    overflow: hidden; 
    background: #000;
  }

  .viewport {
    width: 1280px;
    height: 720px;
    position: relative;
    overflow: hidden;
    /* This ensures that even if the AI makes a mistake, 
       the content is clipped to the slide boundaries */
  }

  /* Force the AI's generated .slide to stay exactly 1280x720 */
  .slide {
    width: 1280px !important;
    height: 720px !important;
    padding: 60px 80px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: flex-start !important;
    position: absolute !important;
    top: 0;
    left: 0;
  }

  h1 {
    font-size: 52px !important;
    line-height: 1.2 !important;
    margin-bottom: 30px !important;
    max-width: 900px !important;
  }

  ul {
    list-style: none !important;
    width: 100% !important;
  }

  li {
    font-size: 26px !important;
    line-height: 1.5 !important;
    margin-bottom: 15px !important;
    max-width: 850px !important;
  }
`;

const wrapSlideHtml = (html: string) => `
  <html><head><style>${SLIDE_CORE_CSS}</style></head>
  <body><div class="viewport">${html}</div></body></html>
`;

const AdvancedSlideStudio = ({ slidesArray, loading }: AdvancedSlideStudioProps) => {
	const [slides, setSlides] = useState<SlideData[]>([]);
	const [currentIdx, setCurrentIdx] = useState(0);
	const [isSaving, setIsSaving] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [isDownloading, setIsDownloading] = useState(false);

	useEffect(() => {
		setSlides(slidesArray);
	}, [slidesArray]);

	const injectContent = (html: string) => {
		const doc = iframeRef.current?.contentDocument;
		if (!doc) return;

		doc.open();
		doc.write(`
            <html>
            <head><style>${SLIDE_CORE_CSS}</style></head>
            <body>
                <div class="viewport">
                    <div class="editor-root">${html}</div>
                </div>
            </body>
            </html>
        `);
		doc.close();
		doc.designMode = "on";
	};

	useEffect(() => {
		if (slides?.length > 0) {
			injectContent(slides[currentIdx].htmlContent);
		}
	}, [currentIdx, slides]);

	const handleSave = async (flag?: boolean) => {
		// setIsSaving(true);
		setIsDownloading(true);
		const doc = iframeRef.current?.contentDocument;
		// Target the inner HTML of the AI generated slide
		const slideEl = doc?.querySelector(".slide");
		if (slideEl) {
			const updatedHTML = slideEl.outerHTML; // Save the full slide structure
			const updatedSlides = [...slides];
			updatedSlides[currentIdx].htmlContent = updatedHTML;
			// setSlides(updatedSlides);

			try {
				const endSlides = updatedSlides.map((slide) => {
					return {
						...slide,
						htmlContent: wrapSlideHtml(slide.htmlContent)
					}
				})
				// We import the service we just wrote
				if (flag) fixDesignLayout(endSlides);
				await downloadPresentation(endSlides);

				// Optional: Show a success toast/notification
				console.log("Download started!");
			} catch (err) {
				console.error("PPT Export Error:", err);
			} finally {
				setIsDownloading(false);
			}
		}

		// setTimeout(() => setIsSaving(false), 800);
	};

	if (loading) return <StudioSkeleton />;

	if (slides?.length === 0) {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
				<div className="text-center">
					<Layers className="w-12 h-12 mx-auto mb-4 text-slate-700" />
					<p>No slides to display.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="-m-8 bg-[#020617] text-slate-100 flex flex-col overflow-hidden">
			{/* NAVIGATION */}
			<nav className="h-24 shrink-0 bg-slate-900/50 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-50">
				<div className="flex items-center gap-4">
					<div className="font-bold text-sm tracking-tighter text-blue-400">GEMINI STUDIO</div>
					<div className="h-4 w-[1px] bg-white/10" />
					<div className="text-[10px] font-medium text-slate-400">PROJECT_V1.PPTX</div>
				</div>

				<Button
					onClick={() => handleSave(true)}
					disabled={isSaving}
					className="bg-blue-600 hover:bg-blue-500 text-xs font-bold h-9"
				>
					<span className="ml-2 text-white">Fix Layout & Download</span>
				</Button>

				<Button
					onClick={() => handleSave(false)}
					disabled={isDownloading}
					className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
				>
					{isDownloading ? (
						<Zap className="animate-spin mr-2" size={14} />
					) : (
						<Save className="mr-2" size={14} />
					)}
					{isDownloading ? "GENERATING..." : "DOWNLOAD PPTX"}
				</Button>
			</nav>

			<div className="flex flex-1 min-h-0">
				{/* SIDEBAR */}
				<aside className="w-64 border-r border-white/5 bg-slate-900/20 flex flex-col overflow-hidden">
					<div className="p-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
						<Layers size={12} /> Slides
					</div>
					<div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
						{slides.map((slide, i) => (
							<div key={i} className="space-y-2">
								<button
									onClick={() => setCurrentIdx(i)}
									className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${currentIdx === i ? "border-blue-500 ring-4 ring-blue-500/20" : "border-white/10 hover:border-white/20"
										}`}
								>
									<iframe
										className="w-full h-full pointer-events-none"
										srcDoc={wrapSlideHtml(slide.htmlContent)}
										scrolling="no"
									/>
									<div className="absolute inset-0 bg-transparent z-10" />
								</button>
								<div className="text-[10px] text-center font-bold text-slate-500">SLIDE {i + 1}</div>
							</div>
						))}
					</div>
				</aside>

				{/* MAIN EDITOR */}
				<main className="flex-1 flex flex-col relative p-8">
					<div className="flex-1 flex items-center justify-center relative">
						{/* THE ARTBOARD CONTAINER */}
						<div className="w-full aspect-video  rounded-xl overflow-hidden relative shadow-2xl">
							<iframe
								ref={iframeRef}
								style={{
									width: '1280px',
									height: '720px',
									border: 'none',
									// This is the key: we scale the 1280px iframe down to fit the responsive container
									transform: `scale(${iframeRef.current ? (iframeRef.current.parentElement!.clientWidth / 1280) : 1})`,
									transformOrigin: 'top left',
								}}
								className="absolute top-0 left-0"
								scrolling="no"
							/>
						</div>
					</div>

					{/* NOTES PANEL */}
					<div className="h-40 mt-8 bg-slate-900/40 rounded-2xl border border-white/5 p-6 flex flex-col">
						<div className="flex items-center gap-2 mb-2 text-blue-400">
							<MessageSquare size={14} />
							<span className="text-[10px] font-black uppercase tracking-widest">Presenter Notes</span>
						</div>
						<div className="flex-1 overflow-y-auto text-sm text-slate-400 leading-relaxed no-scrollbar">
							{slides[currentIdx]?.speakerNotes || "No notes for this slide."}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdvancedSlideStudio;