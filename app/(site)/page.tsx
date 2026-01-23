"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowRight,
	Download,
	ExternalLink,
	FileText,
	Github,
	Globe,
	Monitor,
	Shield,
	Sparkles,
	Upload,
	Video,
	Zap,
} from "lucide-react";

import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import { useAuth } from "@/context/AuthContext";
import { ProjectInfo, ResumeData } from "@/data/resume";

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
	<div
		className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-8 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
		style={{ animationDelay: `${delay}s` }}
	>
		<div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		<div className="relative z-10">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 transform group-hover:scale-110 transition-transform duration-300">
				{icon}
			</div>
			<h3 className="mb-3 text-xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
				{title}
			</h3>
			<p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">{description}</p>
		</div>
	</div>
);

const HomePage = () => {
	const [currentFeature, setCurrentFeature] = useState(0);
	const { isAuthenticated, logout, user, loading } = useAuth();

	const features = [
		"Smart Video Analysis",
		"Real-time Content Extraction",
		"Automatic PPT Generation",
		"Multi-format Support",
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFeature((prev) => (prev + 1) % features.length);
		}, 3000);
		console.log("current user", isAuthenticated);
		return () => clearInterval(interval);
	}, [features.length]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
			<AnimatedBackground />

			{/* Header */}
			<Header isAuthenticated={isAuthenticated} user={user} logout={logout} loading={loading} />

			{/* Hero Section */}
			<section className="relative z-0 pt-20 pb-32">
				<div className="container mx-auto px-6">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<div className="mb-6">
								<div className="inline-flex items-center space-x-2 rounded-full bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-4 py-2 text-sm">
									<Sparkles className="h-4 w-4 text-blue-400" />
									<span className="text-blue-300">AI-driven video conversion technology</span>
								</div>
							</div>

							<h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
								Convert any video
								<br />
								<span className="bg-linear-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
									into a precise PPT
								</span>
								<br />
								with AI
							</h1>

							<p className="text-xl text-zinc-400 mb-8 leading-relaxed">
								Based on advanced WebAV and FFmpeg technology, automatically identify key content in the video and
								generate a professional PPT. Supports local video, online links, and real-time screen recording.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 mb-8">
								<Link href="/screen-recording">
									<Button
										size="lg"
										className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
									>
										<Monitor className="mr-2 h-5 w-5" />
										Start screen recording
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>

								<Link href="/local-video">
									<Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
										<Upload className="mr-2 h-5 w-5" />
										Upload video
									</Button>
								</Link>
							</div>

							<div className="text-sm text-zinc-500">
								Currently processing:
								<span className="ml-2 text-blue-400 font-medium">{features[currentFeature]}</span>
							</div>
						</div>

						<div className="relative z-1">
							<div className="relative">
								{/* Main demo card */}
								<div className="relative rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-8 backdrop-blur-sm">
									<div className="aspect-video rounded-lg border border-zinc-600/30 overflow-hidden mb-6">
										<Image
											src="/hero.png"
											alt="VideoToPPT AI-powered video intelligent clipping and conversion demo"
											width={800}
											height={450}
											className="w-full h-full object-cover"
											priority
										/>
									</div>

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm text-zinc-400">Progress</span>
											<span className="text-sm text-blue-400">85%</span>
										</div>
										<div className="h-2 rounded-full bg-zinc-800">
											<div className="h-full w-[85%] rounded-full bg-linear-to-r from-blue-500 to-purple-600" />
										</div>
									</div>
								</div>

								{/* Floating elements */}
								<div className="absolute -top-4 -right-4 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 p-3 animate-bounce">
									<FileText className="h-6 w-6 text-white" />
								</div>

								<div className="absolute -bottom-4 -left-4 rounded-lg bg-linear-to-br from-orange-500 to-red-600 p-3 animate-pulse">
									<Zap className="h-6 w-6 text-white" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="relative z-10 py-32">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl lg:text-5xl font-bold mb-6">
							<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
								Powerful features
							</span>
						</h2>
						<p className="text-xl text-zinc-400 max-w-2xl mx-auto">
							Combining the latest WebAV and FFmpeg technologies to provide you with professional-level video processing
							capabilities.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<FeatureCard
							icon={<Video className="h-6 w-6 text-white" />}
							title="Intelligent Video Analysis"
							description="Using WebAV technology to deeply analyze videos, automatically identifying key frames and important content nodes"
							delay={0.1}
						/>

						<FeatureCard
							icon={<Zap className="h-6 w-6 text-white" />}
							title="Efficient Content Extraction"
							description="Based on FFmpeg's video processing engine, quickly extract high-quality images and key information"
							delay={0.2}
						/>

						<FeatureCard
							icon={<FileText className="h-6 w-6 text-white" />}
							title="Automated PPT Generation"
							description="Intelligent layout algorithm, automatically generating professional-looking PowerPoint presentations"
							delay={0.3}
						/>

						<FeatureCard
							icon={<Globe className="h-6 w-6 text-white" />}
							title="Multi-Platform Support"
							description="Supports YouTube, Bilibili and other mainstream video platforms, one-click video import"
							delay={0.4}
						/>

						<FeatureCard
							icon={<Monitor className="h-6 w-6 text-white" />}
							title="Real-Time Screen Recording"
							description="Built-in high-definition screen recording capability, real-time video processing, generating presentation content in real-time"
							delay={0.5}
						/>

						<FeatureCard
							icon={<Shield className="h-6 w-6 text-white" />}
							title="Privacy Protection"
							description="Local processing technology, data is not uploaded to server, ensuring your privacy is secure"
							delay={0.6}
						/>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section id="how-it-works" className="relative z-10 py-32">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl lg:text-5xl font-bold mb-6">
							<span className="bg-linear-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
								Methodology Used
							</span>
						</h2>
						<p className="text-xl text-zinc-400">Three steps to complete the intelligent conversion of video to PPT</p>
					</div>

					<div className="grid md:grid-cols-3 gap-12">
						{[
							{
								step: "01",
								title: "Upload or Record",
								description:
									"Select a local video file, enter an online video link, or start screen recording directly",
								icon: <Upload className="h-8 w-8" />,
							},
							{
								step: "02",
								title: "Intelligent Processing",
								description:
									"The AI system automatically analyzes the video content, recognizes key frames, and extracts important information and text",
								icon: <Zap className="h-8 w-8" />,
							},
							{
								step: "03",
								title: "Generate Download",
								description:
									"The system automatically generates a professional PPT file, supporting multiple formats for export and online preview",
								icon: <Download className="h-8 w-8" />,
							},
						].map((item, index) => (
							<div key={index} className="text-center">
								<div className="relative mb-8">
									<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white">
										{item.icon}
									</div>
									<div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold">
										{item.step}
									</div>
								</div>
								<h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
								<p className="text-zinc-400">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative z-10 py-32">
				<div className="container mx-auto px-6">
					<div className="text-center">
						<div className="rounded-2xl bg-linear-to-br from-blue-900/30 to-purple-900/30 border border-zinc-700/50 p-12 backdrop-blur-sm">
							<h2 className="text-4xl lg:text-5xl font-bold mb-6">Are you ready to get started?</h2>
							<p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
								Experience the powerful features of Video2PPT, which can convert your video content into a professional
								presentation document
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/screen-recording">
									<Button
										size="lg"
										className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
									>
										<Monitor className="mr-2 h-5 w-5" />
										Start Screen Recording to Convert
									</Button>
								</Link>

								<Link href="/local-video">
									<Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
										<Upload className="mr-2 h-5 w-5" />
										Upload Local Video
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Project Info Section */}
			<section id="about" className="relative z-10 py-20 border-t border-zinc-800/50">
				<div className="container mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl lg:text-4xl font-bold mb-6">
								<span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
									Open Source Project
								</span>
							</h2>
							<p className="text-lg text-zinc-400 mb-6">{ProjectInfo.description}</p>
							<div className="flex flex-wrap gap-2 mb-6">
								{ProjectInfo.technologies.map((tech) => (
									<span
										key={tech}
										className="px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-300"
									>
										{tech}
									</span>
								))}
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<a href={ProjectInfo.repository.url} target="_blank" rel="noopener noreferrer" className="inline-flex">
									<Button className="bg-linear-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
										<Github className="mr-2 h-5 w-5" />
										View Source Code
										<ExternalLink className="ml-2 h-4 w-4" />
									</Button>
								</a>
								<Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
									<span className="mr-2">⭐</span>
									Star on GitHub
								</Button>
							</div>
						</div>

						<div className="relative">
							<div className="rounded-2xl bg-linear-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-700/50 p-8 backdrop-blur-sm">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center space-x-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-blue-600">
											<Github className="h-5 w-5 text-white" />
										</div>
										<div>
											<h3 className="font-semibold text-white">{ProjectInfo.name}</h3>
											<p className="text-sm text-zinc-400">{ProjectInfo.repository.name}</p>
										</div>
									</div>
									<span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
										{ProjectInfo.license}
									</span>
								</div>
								<p className="text-zinc-400 mb-6">{ProjectInfo.description}</p>
								<div className="space-y-2">
									<h4 className="text-sm font-medium text-white">Key Features</h4>
									{ProjectInfo.features.slice(0, 4).map((feature) => (
										<div key={feature} className="flex items-center space-x-2">
											<div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
											<span className="text-sm text-zinc-400">{feature}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="relative z-10 border-t border-zinc-800/50 py-12">
				<div className="container mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<Link href="/" className="flex items-center space-x-2 mb-4 md:mb-0 hover:opacity-80 transition-opacity">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
								<Video className="h-4 w-4" />
							</div>
							<span className="text-xl font-bold">{ProjectInfo.name}</span>
						</Link>

						<div className="flex items-center space-x-6">
							<div className="text-zinc-400 text-sm">
								© 2025 {ProjectInfo.name}. Built with WebAV and FFmpeg technologies
							</div>
							<div className="flex items-center space-x-4">
								{Object.entries(ResumeData.contact.social).map(([key, social]) => {
									const IconComponent = social.icon;
									return (
										<a
											key={key}
											href={social.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-zinc-400 hover:text-white transition-colors"
										>
											<IconComponent className="h-5 w-5" />
										</a>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
