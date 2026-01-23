"use client";

import React from "react";
import { MoreHorizontal, Download, Clock, Play, Trash2, Copy, MonitorPlay, Layers, Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MY_PROJECTS = [
    { id: "1", title: "AI Revolution in Healthcare", status: "completed", type: "Video", slides: 18, lastModified: "2m ago", previewColor: "bg-blue-500/10" },
    { id: "2", title: "Quarterly Sales Pitch - Q1", status: "processing", type: "Audio", slides: 0, lastModified: "Just now", previewColor: "bg-purple-500/10" },
    { id: "3", title: "Sustainability Workshop", status: "completed", type: "YouTube", slides: 32, lastModified: "1 day ago", previewColor: "bg-emerald-500/10" }
];

export default function MyProjectsTransparent() {
    return (
        <div className="space-y-6 bg-transparent text-white">
            {/* --- Filter & Search Header --- */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.03] p-4 rounded-2xl backdrop-blur-3xl border border-white/10">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input placeholder="Search presentations..." className="pl-10 bg-white/[0.05] border-white/10 focus:border-blue-500/50 rounded-xl h-11 text-white" />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="ghost" className="flex-1 md:flex-none gap-2 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-all">
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
                    <Card key={project.id} className="group relative overflow-hidden border-white/10 bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10">
                        <div className={`relative aspect-[16/10] ${project.previewColor} flex items-center justify-center`}>
                            {project.status === "completed" ? (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-10">
                                    <Button size="icon" className="h-12 w-12 rounded-full bg-white text-blue-600 hover:scale-110 transition-transform">
                                        <Play fill="currentColor" size={20} className="ml-1" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 z-10 backdrop-blur-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                            <MonitorPlay size={48} className="text-white/10" />
                        </div>

                        <CardContent className="p-5 bg-transparent">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-white truncate max-w-[200px]">{project.title}</h3>
                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><Layers size={12} /> {project.slides} Slides</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {project.lastModified}</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white/10 text-slate-400">
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-slate-900/90 border-white/10 backdrop-blur-xl text-white">
                                        <DropdownMenuItem className="gap-2 focus:bg-white/10 cursor-pointer"><Download size={16} /> Download .pptx</DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400"><Trash2 size={16} /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardContent>
                        <div className={`h-1 w-full bg-gradient-to-r ${project.status === 'processing' ? 'from-amber-400/50 to-orange-500/50' : 'from-blue-600/50 to-purple-600/50'}`} />
                    </Card>
                ))}
            </div>
        </div>
    );
}