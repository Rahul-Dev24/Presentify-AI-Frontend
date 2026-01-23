import type { Metadata } from "next";
import { Github, Mail, Twitter, Video } from "lucide-react";

// Website metadata configuration
export const SiteMetadata: Metadata = {
	title: "VideoToPPT - Intelligent Video to PPT Tool",
	description:
		"A modern video analysis and PPT generation tool based on WebAV and FFmpeg, supporting screen recording, local video processing and online video analysis",
	keywords: [
		"video to ppt",
		"webav",
		"ffmpeg",
		"screen recording",
		"video analysis",
		"ppt generation",
		"intelligent conversion",
	],
	authors: [{ name: "liwenka1" }],
	creator: "liwenka1",
	publisher: "liwenka1",
	openGraph: {
		title: "VideoToPPT - Intelligent Video to PPT Tool",
		description: "A modern video analysis and PPT generation tool based on WebAV and FFmpeg",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "VideoToPPT - Intelligent Video to PPT Tool",
		description: "A modern video analysis and PPT generation tool based on WebAV and FFmpeg",
		creator: "@liwenka1",
	},
	robots: {
		index: true,
		follow: true,
	},
};

//  Project information configuration
export const ProjectInfo = {
	name: "VideoToPPT",
	tagline: "Intelligent Video to PPT Tool",
	description:
		"A modern video analysis and PPT generation tool based on WebAV and FFmpeg, supporting screen recording, local video processing and online video analysis",
	version: "1.0.0",
	repository: {
		type: "github",
		url: "https://github.com/liwenka1/video-to-ppt",
		name: "video-to-ppt",
	},
	features: [
		"Intelligent Video Analysis",
		"Real-time Content Extraction",
		"Automatic PPT Generation",
		"Multi-format Support",
		"Screen Recording",
		"Local Processing",
		"Privacy Protection",
	],
	technologies: ["TypeScript", "Next.js 15", "WebAV", "FFmpeg.wasm", "Tailwind CSS", "Shadcn/ui"],
	license: "MIT",
} as const;

// Personal information configuration
export const ResumeData = {
	personal: {
		name: "liwenka1",
		title: "Full Stack Developer",
		bio: "Focused on modern web technology development, enthusiastic about video processing and AI application development",
	},
	contact: {
		email: "2020583117@qq.com",
		social: {
			GitHub: {
				name: "GitHub",
				url: "https://github.com/liwenka1",
				icon: Github,
				username: "@liwenka1",
			},
			X: {
				name: "Twitter",
				url: "https://x.com/liwenka1",
				icon: Twitter,
				username: "@liwenka1",
			},
			email: {
				name: "Send Email",
				url: "mailto:2020583117@qq.com",
				icon: Mail,
			},
		},
	},
	projects: {
		featured: {
			name: ProjectInfo.name,
			description: ProjectInfo.description,
			url: ProjectInfo.repository.url,
			icon: Video,
			technologies: ProjectInfo.technologies,
			features: ProjectInfo.features,
		},
	},
} as const;

// Export type definitions
export type ProjectInfoType = typeof ProjectInfo;
export type ResumeDataType = typeof ResumeData;
