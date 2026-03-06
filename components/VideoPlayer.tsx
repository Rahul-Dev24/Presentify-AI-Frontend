"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
	url: string;
	poster?: string;
	autoPlay?: boolean;
}

export default function VideoPlayer({ url, poster, autoPlay = false }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (!videoRef.current || !url) return;

		const video = videoRef.current;
		const hlsUrl = url?.replace(".mp4", ".m3u8");

		let hls: Hls | null = null;

		if (Hls.isSupported()) {
			hls = new Hls({
				enableWorker: true,
				lowLatencyMode: true,
			});

			hls.loadSource(hlsUrl);
			hls.attachMedia(video);
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			video.src = hlsUrl;
		}

		return () => {
			hls?.destroy();
		};
	}, [url]);

	const handleDownload = () => {
		const downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
		window.open(downloadUrl, "_blank");
	};

	return (
		<div className="w-full overflow-hidden rounded-xl bg-[#0f172a] shadow-lg">
			{/* Video */}
			<video
				ref={videoRef}
				controls
				autoPlay={autoPlay}
				poster={poster}
				preload="metadata"
				className="w-full aspect-video bg-[#0f172a]"
			/>

			{/* Bottom Download Bar */}
			<div className="w-full bg-[#0f172a] p-3">
				<button
					onClick={handleDownload}
					className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold 
                     text-white transition hover:bg-indigo-700 active:scale-[0.99]"
				>
					⬇ Download Video
				</button>
			</div>
		</div>
	);
}
