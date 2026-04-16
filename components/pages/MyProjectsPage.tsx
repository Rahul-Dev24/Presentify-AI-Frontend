"use client";

import React, { useEffect } from "react";
import {
	Clock,
	Copy,
	Download,
	Layers,
	MonitorPlay,
	MoreHorizontal,
	Play,
	Search,
	SlidersHorizontal,
	Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { api, getResponseData } from "@/lib/api";
import NoRecordFound from "../NoRecordFound";
import Loading from "../ui/loading";
import { debounce, formateDate } from "@/lib/utils";
import { downloadPresentation } from "@/lib/ppt-generation";
import toast from "react-hot-toast";

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

const tagsMap: Record<string, string> = {
	"YOUTUBE": 'Youtube',
	"LOCAL_VIDEO": 'Local Video',
	"AUDIO": 'Audio',
} as const;

export default function MyProjectsSection() {
	const [projects, setProjects] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState<boolean | null>(true);

	useEffect(() => {
		getProjects();
	}, []);

	const getProjects = async (search?: string) => {
		setLoading(true);
		const { res } = await getResponseData(await api.get("/project/getProject", { params: { search } }));
		const data = (res?.data || []).map((item: any) => ({
			...item,
			createdAt: formateDate(item?.createdAt) // ✅ fixed name
		}));
		console.log(data[0]?.response);
		setProjects(data);
		setLoading(false);

	}

	const downloadPPT = async (slides: any[]) => {
		console.log("slides", slides);

		if (slides?.length === 0) {
			toast.error("Please add at least one slide");
			return
		}
		try {
			const endSlides = slides.map((slide) => {
				return {
					...slide,
					htmlContent: wrapSlideHtml(slide.htmlContent)
				}
			})
			// We import the service we just wrote
			await downloadPresentation(endSlides);

			// Optional: Show a success toast/notification
			console.log("Download started!");
		} catch (err) {
			toast.error("PPT Export Error");
		}
	}

	const deleteProject = async (fileId: string) => {
		try {
			const response = await api.delete("/project/deleteProject", { data: { fileId } });
			const { res } = await getResponseData(response);
			if (res?.success) toast.success(res?.message);
			else toast.error(res?.message);
			getProjects();
		} catch (error: any) {
			toast.error(error?.message);
			console.error("Error fetching project:", error);
		}
	}

	const searchProject = debounce(async (searchText: string) => {
		getProjects(searchText);
	}, 600);

	return (
		<div className="space-y-6">
			{/* --- Filter & Search Header --- */}

			<div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.03] p-4 rounded-2xl backdrop-blur-3xl border border-white/10">

				<div>
					<h1 className="text-2xl font-bold text-gray-200" >My Projects</h1>
				</div>
				<div className="relative w-full md:w-96">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
					<Input
						onChange={(e: any) => searchProject(e?.target?.value)}
						placeholder="Search presentations..."
						className="pl-10 bg-white/[0.05] border-white/10 focus:border-blue-500/50 rounded-xl h-11 text-white"
					/>
				</div>
				{/* <div className="flex items-center gap-2 w-full md:w-auto">
					<Button
						variant="ghost"
						className="flex-1 md:flex-none gap-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all"
					>
						<SlidersHorizontal size={16} /> Filters
					</Button>
					<Button className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 font-bold">
						Recent First
					</Button>
				</div> */}
			</div>

			{/* --- Projects Grid --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{loading && <div className="col-span-12 rounded-2xl overflow-hidden" ><Loading /></div>}
				{!loading && projects?.length === 0 && <div className="col-span-12 rounded-2xl overflow-hidden" ><NoRecordFound /></div>}
				{projects.map((project) => (
					<Card
						key={project.id}
						className="group relative overflow-hidden border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
					>
						{/* Thumbnail Preview Area */}
						<div
							className={`relative aspect-[16/10] ${project.previewColor} flex items-center justify-center overflow-hidden`}
						>
							{/* {project.status === "completed" ? (
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-10">
									<Button
										size="icon"
										className="h-12 w-12 rounded-full bg-white text-blue-600 hover:scale-110 transition-transform"
									>
										<Play fill="currentColor" size={20} className="ml-1" />
									</Button>
								</div>
							) : (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 z-10">
									<div className="flex space-x-1">
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
									</div>
									<p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
										AI Designing...
									</p>
								</div>
							)} */}

							{project?.response[0]?.slides?.length == 0 ? (
								<MonitorPlay size={48} className="text-slate-300 dark:text-slate-700 opacity-50" />
							) : (
								<iframe
									className="w-full h-full pointer-events-none"
									srcDoc={wrapSlideHtml(project?.response[0]?.slides[0]?.htmlContent)}
									scrolling="no"
								/>
							)}

							{/* Top Badges */}
							<div className="absolute top-3 left-3 flex gap-2 z-20">
								<Badge className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white border-none shadow-sm capitalize">
									{project.type}
								</Badge>
							</div>
						</div>

						{/* Content Area */}
						<CardContent className="p-5">
							<div className="flex justify-between items-start">
								<div className="space-y-1">
									<h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{project.title}</h3>
									<div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
										<span className="flex items-center gap-1">
											<Layers size={12} /> {project.slides} Slides
										</span>
										<span className="flex items-center gap-1">
											<Clock size={12} /> {project.createdAt}
										</span>
									</div>
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="rounded-full h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
										>
											<MoreHorizontal size={18} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 dark:border-slate-800">
										<DropdownMenuItem
											onClick={() => downloadPPT(project?.response[0]?.slides || [])}
											className="gap-2 py-2.5 cursor-pointer" >
											<Download size={16} /> Download .pptx
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => deleteProject(project?.id)}
											className="gap-2 py-2.5 text-red-500 focus:text-red-500 cursor-pointer">
											<Trash2 size={16} /> Delete Forever
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardContent>

						{/* Bottom Accent Line */}
						<div
							className={`h-1 w-full bg-linear-to-r ${project.status === "processing" ? "from-amber-400 to-orange-500" : "from-blue-600 to-purple-600"}`}
						/>
					</Card>
				))}
			</div>
		</div>
	);
}
