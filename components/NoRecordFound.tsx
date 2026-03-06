import React from "react";
import { AlertCircle, Search } from "lucide-react";

const NoRecordFound = ({ size = "md" }) => {
	// 1. Define scale mappings for each size
	const scales: any = {
		sm: {
			container: "py-3",
			icon: 20,
			badge: 12,
			radar: "w-15 h-15",
			glow: "w-25 h-25",
			title: "text-lg",
			subtitle: "text-[8px]",
			spacing: "mb-2",
		},
		md: {
			container: "py-24",
			icon: 60,
			badge: 24,
			radar: "w-32 h-32",
			glow: "w-48 h-48",
			title: "text-3xl",
			subtitle: "text-sm",
			spacing: "mb-10",
		},
		lg: {
			container: "py-40",
			icon: 100,
			badge: 36,
			radar: "w-56 h-56",
			glow: "w-72 h-72",
			title: "text-5xl",
			subtitle: "text-lg",
			spacing: "mb-14",
		},
	};

	const s: any = scales[size] || scales.md;

	return (
		<div
			className={`relative w-full flex flex-col items-center justify-center bg-[#0f172a] ${s.container} text-center overflow-hidden`}
		>
			{/* 1. Background Decoration SVG (Grid Pattern) */}
			{/* <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg> */}

			{/* 2. Central Animated Icon Area */}
			<div className={`relative ${s.spacing}`}>
				{/* Pulsing Radar Circles */}
				<div
					className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${s.radar} bg-red-600/20 rounded-full animate-ping opacity-20`}
				></div>
				<div
					className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${s.glow} bg-red-600/10 rounded-full animate-pulse opacity-10`}
				></div>

				{/* Main Icon Container */}
				<div className="relative bg-[#121212] p-6 md:p-8 rounded-full border border-gray-800 shadow-2xl">
					<Search size={s.icon} className="text-gray-600" strokeWidth={1.5} />

					{/* Small Alert SVG Badge */}
					<div className="absolute -bottom-1 -right-1 bg-red-600 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-lg rotate-12">
						<AlertCircle size={s.badge} color="white" />
					</div>
				</div>
			</div>

			{/* 3. Text Content with Typography Polish */}
			<div className="relative z-10 px-6">
				<h2 className={`${s.title} font-black text-white tracking-tight`}>
					Data <span className="text-red-600 italic">Not</span> Found
				</h2>
				<p
					className={`text-gray-500 mt-3 max-w-sm mx-auto ${s.subtitle} leading-relaxed uppercase tracking-widest font-medium opacity-80`}
				>
					The requested content is currently unreachable or does not exist.
				</p>
			</div>

			{/* 5. Bottom Gradient SVG Flare */}
			<div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-40  blur-[100px] rounded-full"></div>
		</div>
	);
};

export default NoRecordFound;
