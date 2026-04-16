"use client";

import React, { useEffect, useState } from "react";
import {
	Clock,
	Download,
	Layers,
	MonitorPlay,
	MoreHorizontal,
	Play,
	Search,
	SlidersHorizontal,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { api, getResponseData } from "@/lib/api";
import VideoPlayer from "../VideoPlayer";
import { debounce, formateDate } from "@/lib/utils";
import toast from "react-hot-toast";
import NoRecordFound from "../NoRecordFound";
import Loading from "../ui/loading";
import AdvancedSlideStudio from "./PPTView";


export default function MyProjectsTransparent() {

	const [videos, setVideos] = React.useState<any>([]);
	const [loading, setLoading] = React.useState<boolean | null>(true);
	const [slideData, setSildesData] = useState<any[]>([]);



	const types = {
		"VIDEO": "video",
		"AUDIO": "audio",
		"YOUTUBE": "youtube",
		"LOCAL_VIDEO": "Local Video",
	}

	useEffect(() => {
		getVideo();
	}, []);

	const getVideo = async (search?: string) => {
		console.log("search", search);
		try {
			setLoading(true);
			const response = await api.get("video/userFiles", { params: { search } });
			const { res } = await getResponseData(response);

			console.log("res", res);

			const data = (res?.data || []).map((item: any) => ({
				...item,
				createdAt: formateDate(item?.createdAt) // ✅ fixed name
			}));
			setLoading(false);
			setVideos(data);
		} catch (error: any) {
			toast.error(error?.message);
			setLoading(false);
			console.error("Error fetching videos:", error);
		}
	};

	const deleteVideo = async (fileId: string) => {
		try {
			const response = await api.delete("video/delete", { data: { fileId } });
			const { res } = await getResponseData(response);
			getVideo();
		} catch (error: any) {
			toast.error(error?.message);
			console.error("Error fetching videos:", error);
		}
	}

	const searchVideo = debounce(async (searchText: string) => {
		getVideo(searchText);
	}, 600);

	const getSlideData = async (project: any) => {
		const response = await api.post("video/getSlidesByFileId", { fileId: project?.id });
		const { res } = await getResponseData(response);
		setSildesData(res?.data?.response[0]?.slides)
		console.log(project);

	}

	return (
		<>
			{slideData?.length != 0 ? (
				<AdvancedSlideStudio loading={false} slidesArray={slideData} />
			) : (
				<div className="space-y-6 bg-transparent text-white">
					{/* --- Filter & Search Header --- */}
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.03] p-4 rounded-2xl backdrop-blur-3xl border border-white/10">
						<div>
							<h1 className="text-2xl font-bold text-gray-200" >My Assets</h1>
						</div>
						<div className="relative w-full md:w-96">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
							<Input
								onChange={(e: any) => searchVideo(e?.target?.value)}
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
						{!loading && videos?.length === 0 && <div className="col-span-12 rounded-2xl overflow-hidden" ><NoRecordFound /></div>}
						{videos?.map((project: any) => (
							<Card
								key={project.id}
								className="group relative overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10"
							>
								<div className="-mt-6">
									<VideoPlayer url={project?.videoUrl} poster={project?.thumbnail} />
								</div>

								<CardContent className="p-5 -mt-2 bg-transparent">
									<div className="flex justify-between items-start">
										<div className="space-y-1">
											<h3 className="font-bold text-white truncate max-w-[200px]">{project.title}</h3>
											<div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
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
													className="rounded-full h-8 w-8 hover:bg-white/10 text-slate-400"
												>
													<MoreHorizontal size={18} />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="bg-slate-900/90 border-white/10 backdrop-blur-xl text-white"
											>
												<DropdownMenuItem
													onClick={() => getSlideData(project)}
													className="gap-2 focus:bg-white/10 cursor-pointer">
													<Download size={16} /> Download .pptx
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => deleteVideo(project?.id)}
													className="gap-2 focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400">
													<Trash2 size={16} /> Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardContent>
								<div
									className={`h-1 -mt-3 w-full bg-linear-to-r ${project.status === "processing" ? "from-amber-400/50 to-orange-500/50" : "from-blue-600/50 to-purple-600/50"}`}
								/>
								<div className="flex justify-end bg-black rounded-full px-2 py-1 w-fit absolute right-2">
									<span>{types[project.type]}</span>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}
		</>
	);
}
