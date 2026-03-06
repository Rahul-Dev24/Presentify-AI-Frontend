"use client";

import React from "react";
import { Layers, MessageSquare, Monitor } from "lucide-react";

const StudioSkeleton = () => {
	return (
		<div className="h-[90vh] md:h-[99vh] -m-7 bg-[#020617] text-slate-100 flex flex-col font-sans overflow-hidden">
			{/* --- HEADER SKELETON --- */}
			<nav className="h-18 md:h-22.5 shrink-0 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between z-50">
				<div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-40 h-10 animate-pulse" />
				<div className="w-32 h-10 bg-blue-600/20 rounded-xl animate-pulse border border-blue-500/20" />
			</nav>

			<div className="flex flex-1 flex-col md:flex-row min-h-0 overflow-hidden">
				{/* --- SIDEBAR SKELETON --- */}
				<aside className="w-full md:bg-[#0f172a] md:w-20 lg:w-64 border-r border-white/5 flex flex-col order-2 md:order-1 overflow-hidden">
					<div className="hidden lg:flex p-6 items-center gap-2 opacity-20">
						<Layers size={14} />
						<div className="w-20 h-2 bg-white/20 rounded" />
					</div>

					<div className="flex flex-row md:flex-col p-4 gap-4 overflow-hidden h-full">
						{[1, 2, 3, 4, 5].map((i) => (
							<div
								key={i}
								className="shrink-0 w-32 md:w-full aspect-video rounded-xl bg-white/5 border border-white/10 relative overflow-hidden"
							>
								<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
							</div>
						))}
					</div>
				</aside>

				{/* --- MAIN CANVAS SKELETON --- */}
				<section className="flex-1 relative p-4 md:p-12 flex items-center justify-center order-1 md:order-2 bg-slate-950">
					<div className="w-full h-full max-w-6xl flex flex-col gap-6">
						{/* THE STAGE SKELETON */}
						<div className="flex-1 flex items-center justify-center relative">
							<div className="w-full aspect-video rounded-2xl bg-[#0f172a] border border-white/5 relative overflow-hidden shadow-2xl">
								<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
								<Monitor
									size={48}
									className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5"
								/>
							</div>
						</div>

						{/* SPEAKER NOTES SKELETON */}
						<div className="h-48 hidden md:flex bg-white/2 rounded-3xl border border-white/10 p-6 flex-col gap-3">
							<div className="flex items-center gap-2 mb-1 opacity-20">
								<MessageSquare size={14} />
								<div className="w-24 h-2 bg-white/40 rounded" />
							</div>
							<div className="w-full h-3 bg-white/5 rounded animate-pulse" />
							<div className="w-[90%] h-3 bg-white/5 rounded animate-pulse" />
							<div className="w-[40%] h-3 bg-white/5 rounded animate-pulse" />
						</div>
					</div>
				</section>
			</div>

			<style jsx>{`
				@keyframes shimmer {
					100% {
						transform: translateX(100%);
					}
				}
			`}</style>
		</div>
	);
};

export default StudioSkeleton;
