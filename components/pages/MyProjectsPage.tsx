"use client";

import React from "react";
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

const MY_PROJECTS = [
	{
		id: "1",
		title: "AI Revolution in Healthcare",
		status: "completed",
		type: "Video",
		duration: "12:45",
		slides: 18,
		lastModified: "2m ago",
		previewColor: "bg-linear-to-br from-blue-500/20 to-indigo-500/20",
	},
	{
		id: "2",
		title: "Quarterly Sales Pitch - Q1",
		status: "processing",
		type: "Audio",
		duration: "05:20",
		slides: 0,
		lastModified: "Just now",
		previewColor: "bg-linear-to-br from-purple-500/20 to-pink-500/20",
	},
	{
		id: "3",
		title: "Sustainability Workshop",
		status: "completed",
		type: "YouTube",
		duration: "45:00",
		slides: 32,
		lastModified: "1 day ago",
		previewColor: "bg-linear-to-br from-emerald-500/20 to-teal-500/20",
	},
];

export default function MyProjectsSection() {
	return (
		<div className="space-y-6">
			{/* --- Filter & Search Header --- */}

			<div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.03] p-4 rounded-2xl backdrop-blur-3xl border border-white/10">
				<div className="relative w-full md:w-96">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
					<Input
						placeholder="Search presentations..."
						className="pl-10 bg-white/[0.05] border-white/10 focus:border-blue-500/50 rounded-xl h-11 text-white"
					/>
				</div>
				<div className="flex items-center gap-2 w-full md:w-auto">
					<Button
						variant="ghost"
						className="flex-1 md:flex-none gap-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all"
					>
						<SlidersHorizontal size={16} /> Filters
					</Button>
					<Button className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 font-bold">
						Recent First
					</Button>
				</div>
			</div>

			{/* --- Projects Grid --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{MY_PROJECTS.map((project) => (
					<Card
						key={project.id}
						className="group relative overflow-hidden border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
					>
						{/* Thumbnail Preview Area */}
						<div
							className={`relative aspect-[16/10] ${project.previewColor} flex items-center justify-center overflow-hidden`}
						>
							{project.status === "completed" ? (
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
							)}

							<MonitorPlay size={48} className="text-slate-300 dark:text-slate-700 opacity-50" />

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
											<Clock size={12} /> {project.lastModified}
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
										<DropdownMenuItem className="gap-2 py-2.5 cursor-pointer">
											<Download size={16} /> Download .pptx
										</DropdownMenuItem>
										<DropdownMenuItem className="gap-2 py-2.5 cursor-pointer">
											<Copy size={16} /> Duplicate Project
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="gap-2 py-2.5 text-red-500 focus:text-red-500 cursor-pointer">
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
