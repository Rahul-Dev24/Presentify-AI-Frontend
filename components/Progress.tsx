"use client";

import { useEffect } from "react";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface Props {
	steps: string[];
	currentStep: number;
}

export default function FullscreenProgress({ steps, currentStep }: Props) {
	// 🔒 Lock scroll
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, []);

	return (
		<div className="fixed h-full inset-0 z-9999 flex justify-center  bg-gray-300/5 backdrop-blur-sm">
			{/* Card */}
			<div className="sticky top-1/3 md:top-1/4 h-fit md:mx-auto w-full mx-6 md:max-w-md rounded-2xl p-6 shadow-2xl bg-zinc-900">
				<h2 className="text-center text-lg font-semibold">Processing your video</h2>
				<p className="mt-1 text-center text-sm text-zinc-500">Please don’t close this tab</p>

				{/* Progress Bar */}
				<div className="mt-5 h-1 w-full rounded bg-zinc-200 dark:bg-zinc-800">
					<div
						className="h-full rounded bg-indigo-500 transition-all duration-500"
						style={{
							width: `${((currentStep + 1) / steps.length) * 100}%`,
						}}
					/>
				</div>

				{/* Steps */}
				<ul className="mt-6 space-y-4">
					{steps.map((step, index) => {
						const done = index < currentStep;
						const active = index === currentStep;

						return (
							<li key={step} className="flex items-start gap-3">
								{done && <CheckCircle className="text-green-500" size={18} />}
								{active && <Loader2 className="animate-spin text-indigo-500" size={18} />}
								{!done && !active && <Circle className="text-zinc-400" size={18} />}

								<span
									className={`text-sm ${
										done ? "line-through text-zinc-400" : active ? "font-medium text-indigo-500" : "text-zinc-500"
									}`}
								>
									{step}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
