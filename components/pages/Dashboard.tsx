import { FileVideo, Mic, Presentation } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourceDistribution } from "../DebounceChart";
import { UsageChart } from "../UserChat";

const DashboardPage = () => {
	return (
		<>
			{/* Quick Action Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
				{/* Video to PPT Card */}
				<Card className="group relative overflow-hidden border-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
					{/* Animated Gradient Border Effect */}
					<div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

					<CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
						<div className="space-y-1">
							<CardTitle className="text-base font-semibold tracking-tight">Video to PPT</CardTitle>
							<p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">AI Workflow</p>
						</div>
						<div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
							<FileVideo className="w-6 h-6" />
						</div>
					</CardHeader>
					<CardContent className="relative z-10">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Upload MP4 or paste YouTube links to auto-generate slides.
						</p>
					</CardContent>
				</Card>

				{/* Audio to PPT Card */}
				<Card className="group relative overflow-hidden border-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer">
					<div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

					<CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
						<div className="space-y-1">
							<CardTitle className="text-base font-semibold tracking-tight">Audio to PPT</CardTitle>
							<p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">AI Transcription</p>
						</div>
						<div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
							<Mic className="w-6 h-6" />
						</div>
					</CardHeader>
					<CardContent className="relative z-10">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Turn voice notes or meeting recordings into professional decks.
						</p>
					</CardContent>
				</Card>

				{/* AI Tokens Card (The "Pro" Look) */}
				<Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl">
					{/* Decorative Circle for "AI" feel */}
					<div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

					<CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-base font-medium text-blue-50">AI Credits</CardTitle>
						<div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
							<Presentation className="w-5 h-5 text-white" />
						</div>
					</CardHeader>
					<CardContent className="relative z-10 mt-2">
						<div className="flex items-baseline gap-1">
							<span className="text-4xl font-extrabold tracking-tight">12</span>
							<span className="text-blue-200 text-lg">/ 50</span>
						</div>
						{/* Mini Progress Bar */}
						<div className="w-full bg-black/20 h-1.5 mt-4 rounded-full overflow-hidden">
							<div className="bg-white h-full transition-all duration-1000" style={{ width: "24%" }} />
						</div>
						<p className="text-[10px] mt-2 text-blue-100/80 uppercase font-medium tracking-tighter">Resets in 8 days</p>
					</CardContent>
				</Card>
			</div>

			{/* Project Tabs Section */}
			<Tabs defaultValue="chart" className="w-full">
				<div className="mb-6 w-full">
					{/* Scroll container */}
					<div className="w-full overflow-x-auto scrollbar-hide touch-pan-x overscroll-x-contain">
						{/* Pill wrapper */}
						<div
							className="min-w-max inline-flex p-1.5 rounded-2xl 
      bg-gray-100/60 dark:bg-gray-800/40 backdrop-blur-md 
      border border-white/20 dark:border-gray-700/50"
						>
							<TabsList className="flex flex-nowrap items-center gap-1 bg-transparent h-11">
								<TabsTrigger
									value="chart"
									className="snap-start whitespace-nowrap rounded-xl 
          px-4 sm:px-6 py-2.5 text-sm font-semibold transition-all
          data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
          data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
								>
									Analytics
								</TabsTrigger>

								<TabsTrigger
									value="allProjects"
									className="snap-start whitespace-nowrap rounded-xl 
          px-4 sm:px-6 py-2.5 text-sm font-semibold transition-all
          data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
          data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
								>
									All Projects
								</TabsTrigger>

								<TabsTrigger
									value="processing"
									className="snap-start whitespace-nowrap rounded-xl 
          px-4 sm:px-6 py-2.5 text-sm font-semibold transition-all
          data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
          data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
								>
									<div className="flex items-center gap-2">
										Processing
										<span className="relative flex h-2 w-2">
											<span
												className="absolute inline-flex h-full w-full rounded-full 
                bg-amber-400 opacity-75 animate-ping"
											/>
											<span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
										</span>
									</div>
								</TabsTrigger>

								<TabsTrigger
									value="completed"
									className="snap-start whitespace-nowrap rounded-xl 
          px-4 sm:px-6 py-2.5 text-sm font-semibold transition-all
          data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
          data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
								>
									Completed
								</TabsTrigger>

								<TabsTrigger
									value="archived"
									className="snap-start whitespace-nowrap rounded-xl 
          px-4 sm:px-6 py-2.5 text-sm font-semibold transition-all
          data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700
          data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
								>
									Archived
								</TabsTrigger>
							</TabsList>
						</div>
					</div>
				</div>

				<TabsContent value="chart" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Main Area Chart (Takes 2 columns) */}
						<div className="lg:col-span-2">
							<UsageChart />
						</div>

						{/* Smaller Distribution Chart (Takes 1 column) */}
						<div className="lg:col-span-1 h-full">
							<SourceDistribution />
						</div>
					</div>
				</TabsContent>

				<TabsContent value="allProjects" className="space-y-4">
					{/* Project List Table-like UI */}
					{[1, 2].map((i) => (
						<div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border">
							<div className="flex items-center gap-4">
								<div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
									<Presentation className="text-blue-200" />
								</div>
								<div>
									<h4 className="font-semibold">AI Lecture Summary - Unit {i}</h4>
									<p className="text-xs text-gray-500">Created 2 hours ago • Video source</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Badge variant={i === 1 ? "default" : "secondary"}>{i === 1 ? "Completed" : "Processing"}</Badge>
								<Button variant="outline" size="sm">
									Edit
								</Button>
							</div>
						</div>
					))}
				</TabsContent>
			</Tabs>
		</>
	);
};

export default DashboardPage;
