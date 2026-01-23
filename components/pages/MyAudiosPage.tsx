"use client";

import React, { useState } from "react";
import {
	Clock,
	Download,
	FileAudio,
	History,
	Mic,
	MoreHorizontal,
	Music,
	Pause,
	Play,
	Search,
	Sparkles,
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

const AUDIOS = [
	{
		id: 1,
		name: "Project_Kickoff_Meeting.mp3",
		duration: "45:12",
		size: "12.4 MB",
		date: "1h ago",
		status: "Transcribed",
		waveform: [40, 70, 45, 90, 65, 30, 80, 50],
	},
	{
		id: 2,
		name: "Voice_Note_Strategy.wav",
		duration: "02:30",
		size: "4.1 MB",
		date: "4h ago",
		status: "Processing",
		waveform: [20, 30, 40, 35, 30, 25, 30, 20],
	},
	{
		id: 3,
		name: "Lecture_Series_Economics.m4a",
		duration: "1:12:05",
		size: "65.8 MB",
		date: "Yesterday",
		status: "Transcribed",
		waveform: [50, 50, 60, 55, 70, 80, 75, 60],
	},
];

export default function MyAudiosPage() {
	const [playingId, setPlayingId] = useState<number | null>(null);

	return (
		// Changed bg to transparent to inherit global ambient background
		<div className="min-h-screen bg-transparent text-slate-200">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* --- DYNAMIC HEADER --- */}

				<div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.03] p-4 rounded-2xl backdrop-blur-3xl border border-white/10">
					{/* <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <Input placeholder="Search presentations..." className="pl-10 bg-white/[0.05] border-white/10 focus:border-blue-500/50 rounded-xl h-11 text-white" />
                    </div> */}
					<div className="flex items-center gap-4">
						<div className="h-14 w-14 bg-linear-to-br from-purple-600 to-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-purple-500/20">
							<Mic className="text-white" size={28} />
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight text-white">My Audios</h1>
							<p className="text-slate-400 text-sm font-medium">Manage voice notes & recordings for PPT conversion.</p>
						</div>
					</div>
					<div className="flex items-center justify-end md:justify-normal gap-2 w-full md:w-auto">
						<Button
							variant="ghost"
							className="flex-1 md:flex-none gap-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all"
						>
							<Search className=" text-slate-500" size={18} />
						</Button>
						<Button className="bg-linear-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-2xl px-6 shadow-xl shadow-purple-500/20 gap-2 border-t border-white/10">
							<Mic size={18} />
							New Audio
						</Button>
					</div>
				</div>

				{/* --- QUICK STATS - Transparent Cards --- */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[
						{ label: "Total Files", val: "148", icon: <FileAudio size={18} className="text-purple-400" /> },
						{ label: "AI Transcribed", val: "132", icon: <Sparkles size={18} className="text-blue-400" /> },
						{ label: "Total Length", val: "12.5 hrs", icon: <Clock size={18} className="text-emerald-400" /> },
					].map((s, i) => (
						<div
							key={i}
							className="bg-white/[0.02] backdrop-blur-3xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-4 hover:bg-white/[0.04] transition-all duration-300"
						>
							<div className="p-3 bg-white/[0.05] rounded-2xl border border-white/5">{s.icon}</div>
							<div>
								<p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{s.label}</p>
								<p className="text-xl font-bold text-white leading-none mt-1">{s.val}</p>
							</div>
						</div>
					))}
				</div>

				{/* --- AUDIO LIST - Ultra Glass --- */}
				<div className="space-y-4">
					{AUDIOS.map((audio) => (
						<Card
							key={audio.id}
							className="group border-white/10 bg-white/[0.01] backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-500 rounded-[2rem] overflow-hidden shadow-2xl"
						>
							<CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
								{/* Play Button & Waveform Preview */}
								<div className="flex items-center gap-4 w-full md:w-auto">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setPlayingId(playingId === audio.id ? null : audio.id)}
										className={`h-14 w-14 rounded-2xl transition-all duration-300 ${
											playingId === audio.id
												? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
												: "bg-white/[0.05] text-purple-400 hover:bg-purple-600 hover:text-white"
										}`}
									>
										{playingId === audio.id ? (
											<Pause size={28} fill="currentColor" />
										) : (
											<Play size={28} fill="currentColor" className="ml-1" />
										)}
									</Button>

									<div className="flex-1 md:w-32 flex items-center gap-1.5 h-10">
										{audio.waveform.map((h, i) => (
											<div
												key={i}
												className={`w-1.5 rounded-full transition-all duration-500 ${playingId === audio.id ? "bg-purple-500 animate-[pulse_1s_infinite]" : "bg-white/10"}`}
												style={{ height: `${h}%` }}
											/>
										))}
									</div>
								</div>

								{/* Info Section */}
								<div className="flex-1 w-full space-y-1">
									<h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors truncate tracking-tight">
										{audio.name}
									</h3>
									<div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
										<span className="flex items-center gap-1.5">
											<History size={12} /> {audio.date}
										</span>
										<span className="flex items-center gap-1.5">
											<Clock size={12} /> {audio.duration}
										</span>
										<span>{audio.size}</span>
									</div>
								</div>

								{/* AI Status & Actions */}
								<div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
									<Badge
										variant="outline"
										className={`rounded-xl py-1.5 px-4 border-none font-black text-[10px] uppercase tracking-widest shadow-inner ${
											audio.status === "Processing"
												? "bg-amber-500/10 text-amber-500 animate-pulse"
												: "bg-blue-500/10 text-blue-400"
										}`}
									>
										{audio.status}
									</Badge>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="hidden lg:flex gap-2 rounded-xl bg-white/[0.05] text-white hover:bg-white/10 border border-white/5 font-bold text-xs"
										>
											<Sparkles size={14} className="text-blue-400" /> AI PPT
										</Button>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="rounded-xl h-10 w-10 text-slate-500 hover:text-white hover:bg-white/5"
												>
													<MoreHorizontal size={20} />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-52 rounded-2xl bg-slate-900/80 backdrop-blur-xl border-white/10 text-slate-200"
											>
												<DropdownMenuItem className="gap-2 py-3 focus:bg-white/10 cursor-pointer">
													<Download size={16} /> Download Audio
												</DropdownMenuItem>
												<DropdownMenuItem className="gap-2 py-3 focus:bg-white/10 cursor-pointer">
													<Music size={16} /> View Transcript
												</DropdownMenuItem>
												<DropdownMenuSeparator className="bg-white/10" />
												<DropdownMenuItem className="gap-2 py-3 focus:bg-red-500/10 text-red-500 focus:text-red-500 cursor-pointer">
													<Trash2 size={16} /> Move to Trash
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
