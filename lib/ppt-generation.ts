import html2canvas from "html2canvas";
import pptxgen from "pptxgenjs";

import { generateTimestamp } from "./utils";

interface PPTSlideData {
	image: string;
	title?: string;
	description?: string;
}

export const downloadPresentation = async (slidesArray: any[]) => {
	const pptx = new pptxgen();

	pptx.defineLayout({ name: "STRICT_UI", width: 13.33, height: 7.5 });
	pptx.layout = "STRICT_UI";

	slidesArray.forEach((slide) => {
		const pptsSlide = pptx.addSlide();
		pptsSlide.background = { color: "0F172A" }; // Matches your Dark UI

		const parser = new DOMParser();
		const doc = parser.parseFromString(slide.htmlContent, "text/html");

		// --- DYNAMIC LAYOUT ENGINE ---
		let currentY = 0.6; // Starting top margin
		const marginX = 0.8;
		const maxW = 8.5; // Leave space on the right for SVGs

		// 1. Process all relevant tags in ORDER of appearance
		// This prevents overlapping by calculating the height of the previous element
		const elements = doc.body.querySelectorAll("h1, h2, p, ul");

		elements.forEach((el) => {
			const tagName = el.tagName.toLowerCase();

			if (tagName === "h1") {
				pptsSlide.addText(el.textContent || "", {
					x: marginX,
					y: currentY,
					w: 11,
					h: 0.9,
					fontSize: 40,
					bold: true,
					color: "3B82F6",
					fontFace: "Arial",
				});
				currentY += 1.0; // Push next element down
			} else if (tagName === "h2") {
				pptsSlide.addText(el.textContent || "", {
					x: marginX,
					y: currentY,
					w: 11,
					h: 0.7,
					fontSize: 30,
					bold: true,
					color: "E2E8F0",
					fontFace: "Arial",
				});
				currentY += 0.8;
			} else if (tagName === "p") {
				pptsSlide.addText(el.textContent || "", {
					x: marginX,
					y: currentY,
					w: maxW,
					h: 0.5,
					fontSize: 18,
					color: "94A3B8",
					fontFace: "Arial",
				});
				currentY += 0.6;
			} else if (tagName === "ul") {
				const items = Array.from(el.querySelectorAll("li")).map((li) => ({
					text: li.textContent || "",
					options: { bullet: true, color: "E2E8F0" },
				}));

				if (items.length > 0) {
					const listHeight = items.length * 0.4 + 0.5;
					pptsSlide.addText(items, {
						x: marginX + 0.2,
						y: currentY,
						w: maxW,
						h: listHeight,
						fontSize: 20,
						color: "E2E8F0",
						valign: "top",
						lineSpacing: 28,
					});
					currentY += listHeight;
				}
			}
		});

		// --- 2. HANDLE SVG ICONS (Floating on the right) ---
		const svgs = doc.querySelectorAll("svg");
		svgs.forEach((svg, idx) => {
			try {
				svg.setAttribute("width", "600");
				svg.setAttribute("height", "600");
				const serializer = new XMLSerializer();
				const svgXml = serializer.serializeToString(svg);
				const svgBase64 = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgXml)))}`;

				pptsSlide.addImage({
					data: svgBase64,
					x: 10.2,
					y: 1.2 + idx * 2.2, // Vertical stack on the right
					w: 2.0,
					h: 2.0,
				});
			} catch (e) {
				console.error(e);
			}
		});

		if (slide.speakerNotes) pptsSlide.addNotes(slide.speakerNotes);
	});

	await pptx.writeFile({ fileName: `Presentify_Export_${Date.now()}.pptx` });
};

const prepareElementForCanvas = (container: HTMLElement) => {
	const allElements = container.querySelectorAll("*");
	allElements.forEach((el) => {
		const htmlEl = el as HTMLElement;
		const style = window.getComputedStyle(htmlEl);

		// 1. Force computed (RGB) values into inline styles
		// This bypasses the html2canvas internal CSS parser
		htmlEl.style.color = style.color;
		htmlEl.style.backgroundColor = style.backgroundColor;
		htmlEl.style.borderColor = style.borderColor;

		// 2. Handle SVG specific properties (common in modern icons)
		if (htmlEl.tagName.toLowerCase() === "svg" || htmlEl.closest("svg")) {
			htmlEl.style.fill = style.fill;
			htmlEl.style.stroke = style.stroke;
		}
	});
};

/**
 * EXPORT PRESENTATION:
 * Renders HTML content into high-res images and builds the .pptx
 */
export const fixDesignLayout = async (slidesArray: any[]) => {
	if (!slidesArray || slidesArray.length === 0) return;

	const pptx = new pptxgen();

	// Set 16:9 Widescreen Layout
	pptx.defineLayout({ name: "STRICT_UI", width: 13.33, height: 7.5 });
	pptx.layout = "STRICT_UI";

	// 1. Create a hidden staging area
	const stagingContainer = document.createElement("div");
	stagingContainer.id = "pptx-staging-bridge";

	Object.assign(stagingContainer.style, {
		position: "fixed",
		left: "-10000px",
		top: "0",
		width: "1280px", // 720p base width
		height: "720px", // 720p base height
		zIndex: "-9999",
		pointerEvents: "none",
		backgroundColor: "#0F172A", // Match your Dark UI background
	});

	document.body.appendChild(stagingContainer);

	try {
		for (const slide of slidesArray) {
			// 2. Inject Slide Content with your UI's theme context
			// Note: We wrap slide.htmlContent in a div to ensure padding/layout
			stagingContainer.innerHTML = `
                <div class="dark" style="width: 1280px; height: 720px; display: flex; flex-direction: column; background-color: #0F172A; font-family: 'Arial', sans-serif;">
                    <div style="flex: 1; padding: 60px; display: flex; flex-direction: column; justify-content: center;">
                        ${slide.htmlContent || ""}
                    </div>
                </div>
            `;

			// 3. APPLY THE OKLCH FIX
			prepareElementForCanvas(stagingContainer);

			// 4. Brief pause for the browser to "paint" the new content
			await new Promise((resolve) => setTimeout(resolve, 250));

			// 5. Take the high-res "screenshot" of the HTML
			const canvas = await html2canvas(stagingContainer, {
				scale: 2, // Sharpness: 2 is standard, 3 is crystal clear but large file
				useCORS: true, // Essential for icons/images from external URLs
				logging: false,
				backgroundColor: "#0F172A",
				width: 1280,
				height: 720,
			});

			const imgData = canvas.toDataURL("image/png");

			// 6. Add Slide to PPTX
			const pptsSlide = pptx.addSlide();
			pptsSlide.addImage({
				data: imgData,
				x: 0,
				y: 0,
				w: 13.33,
				h: 7.5,
			});

			// 7. Attach Speaker Notes
			if (slide.speakerNotes) {
				pptsSlide.addNotes(slide.speakerNotes);
			}
		}

		// 8. Generate and Trigger Download
		const timestamp = new Date().toISOString().split("T")[0];
		await pptx.writeFile({ fileName: `AI_Presentation_${timestamp}.pptx` });
	} catch (error) {
		console.error("PPTX Export failed:", error);
	} finally {
		// 9. Cleanup: Remove the hidden bridge from the DOM
		if (document.body.contains(stagingContainer)) {
			document.body.removeChild(stagingContainer);
		}
	}
};

export async function createAndDownloadPPT(
	screenshots: string[],
	options: {
		title?: string;
		maxSlides?: number;
		sortByImportance?: boolean;
	} = {}
): Promise<void> {
	try {
		// Dynamic import to avoid SSR issues
		const PptxGenJS = (await import("pptxgenjs")).default;

		if (screenshots.length === 0) {
			throw new Error("No screenshots available to create PPT");
		}

		const pptx = new PptxGenJS();

		// Set presentation properties
		pptx.author = "Video2PPT";
		pptx.company = "Video2PPT";
		pptx.title = options.title || "Video Analysis Presentation";

		const maxSlides = options.maxSlides || 256;
		const slidesToProcess = screenshots.slice(0, maxSlides);

		// Add title slide
		const titleSlide = pptx.addSlide();
		titleSlide.addText(options.title || "Video Analysis", {
			x: 1,
			y: 1,
			w: 8,
			h: 1,
			fontSize: 32,
			fontFace: "Arial",
			color: "363636",
			align: "center",
			bold: true,
		});

		titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
			x: 1,
			y: 6,
			w: 8,
			h: 0.5,
			fontSize: 16,
			fontFace: "Arial",
			color: "666666",
			align: "center",
		});

		// Add screenshot slides
		for (let i = 0; i < slidesToProcess.length; i++) {
			const slide = pptx.addSlide();
			const screenshotUrl = slidesToProcess[i];

			try {
				// Add the screenshot image
				slide.addImage({
					path: screenshotUrl,
					x: 0.5,
					y: 0.5,
					w: 9,
					h: 6.75,
					sizing: {
						type: "contain",
						w: 9,
						h: 6.75,
					},
				});

				// Add slide number
				slide.addText(`${i + 1} / ${slidesToProcess.length}`, {
					x: 8.5,
					y: 7,
					w: 1,
					h: 0.3,
					fontSize: 10,
					fontFace: "Arial",
					color: "999999",
					align: "right",
				});
			} catch (error) {
				console.error(`Error adding slide ${i + 1}:`, error);
				// Add error slide instead
				slide.addText(`Error loading slide ${i + 1}`, {
					x: 1,
					y: 3,
					w: 8,
					h: 1,
					fontSize: 24,
					fontFace: "Arial",
					color: "FF0000",
					align: "center",
				});
			}
		}

		// Generate filename with timestamp
		const timestamp = generateTimestamp();
		const fileName = `Video2PPT_${timestamp}.pptx`;

		// Download the file
		await pptx.writeFile({ fileName });

		console.log(`PPT generated successfully: ${fileName}`);
	} catch (error) {
		console.error("Error creating PPT:", error);
		throw error;
	}
}

export async function createPPTFromVideoAnalysis(
	analysisResult: {
		keyFrames: string[];
		scenes: Array<{
			startTime: number;
			endTime: number;
			thumbnail: string;
		}>;
	},
	options: {
		title?: string;
		includeSceneBreaks?: boolean;
	} = {}
): Promise<void> {
	try {
		const PptxGenJS = (await import("pptxgenjs")).default;
		const pptx = new PptxGenJS();

		// Set presentation properties
		pptx.author = "Video2PPT";
		pptx.company = "Video2PPT";
		pptx.title = options.title || "Smart Video Analysis";

		// Add title slide
		const titleSlide = pptx.addSlide();
		titleSlide.addText(options.title || "Smart Video Analysis", {
			x: 1,
			y: 1,
			w: 8,
			h: 1,
			fontSize: 32,
			fontFace: "Arial",
			color: "363636",
			align: "center",
			bold: true,
		});

		titleSlide.addText("Generated using WebAV + FFmpeg Technology", {
			x: 1,
			y: 2.5,
			w: 8,
			h: 0.5,
			fontSize: 16,
			fontFace: "Arial",
			color: "666666",
			align: "center",
		});

		// Add scene-based slides
		if (options.includeSceneBreaks && analysisResult.scenes.length > 0) {
			for (let i = 0; i < analysisResult.scenes.length; i++) {
				const scene = analysisResult.scenes[i];
				const slide = pptx.addSlide();

				// Add scene thumbnail
				slide.addImage({
					path: scene.thumbnail,
					x: 0.5,
					y: 1,
					w: 9,
					h: 5,
					sizing: {
						type: "contain",
						w: 9,
						h: 5,
					},
				});

				// Add scene information
				const duration = scene.endTime - scene.startTime;
				slide.addText(`Scene ${i + 1}`, {
					x: 0.5,
					y: 6.5,
					w: 4,
					h: 0.5,
					fontSize: 18,
					fontFace: "Arial",
					color: "363636",
					bold: true,
				});

				slide.addText(`Duration: ${duration.toFixed(1)}s`, {
					x: 5,
					y: 6.5,
					w: 4,
					h: 0.5,
					fontSize: 14,
					fontFace: "Arial",
					color: "666666",
				});
			}
		} else {
			// Add key frames
			for (let i = 0; i < analysisResult.keyFrames.length; i++) {
				const slide = pptx.addSlide();

				slide.addImage({
					path: analysisResult.keyFrames[i],
					x: 0.5,
					y: 0.5,
					w: 9,
					h: 6.75,
					sizing: {
						type: "contain",
						w: 9,
						h: 6.75,
					},
				});

				// Add slide number
				slide.addText(`Key Frame ${i + 1}`, {
					x: 0.5,
					y: 7.25,
					w: 9,
					h: 0.25,
					fontSize: 12,
					fontFace: "Arial",
					color: "999999",
					align: "center",
				});
			}
		}

		// Generate filename
		const timestamp = generateTimestamp();
		const fileName = `SmartVideo2PPT_${timestamp}.pptx`;

		await pptx.writeFile({ fileName });
		console.log(`Smart PPT generated successfully: ${fileName}`);
	} catch (error) {
		console.error("Error creating smart PPT:", error);
		throw error;
	}
}

export function convertScreenshotsToSlideData(screenshots: string[]): PPTSlideData[] {
	return screenshots.map((screenshot, index) => ({
		image: screenshot,
		title: `Slide ${index + 1}`,
		description: `Screenshot captured at frame ${index + 1}`,
	}));
}
