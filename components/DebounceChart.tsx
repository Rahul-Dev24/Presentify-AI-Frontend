import { Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { api, getResponseData } from "@/lib/api";
import toast from "react-hot-toast";
import NoRecordFound from "./NoRecordFound";

const sourceData = [
	{ source: "video", count: 450, fill: "#3b82f6" },
	{ source: "audio", count: 300, fill: "#9333ea" },
	{ source: "youtube", count: 200, fill: "#06b6d4" },
];

export function SourceDistribution() {

	const [fileType, setFileType] = useState<any[]>([]);
	const [count, setCount] = useState<number>(0);
	useEffect(() => {
		getFileType();
	}, []);

	const getFileType = async () => {
		const { res } = await getResponseData(await api.get("/dashboard/getFileType"));
		if (res?.success) {
			setFileType(res?.data);
			const total = res?.data?.reduce((acc: number, item: any) => acc + item.count, 0);
			setCount(total);
		}
		else toast.success(res?.message);
	};

	return (
		<Card className="flex flex-col border-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
			<CardHeader className="items-center pb-0">
				<CardTitle className="text-lg">Input Sources</CardTitle>
			</CardHeader>
			{fileType?.length == 0 ? (
				<div className="mx-48 rounded-2xl overflow-hidden">
					<NoRecordFound />
				</div>
			) : (
				<CardContent className="flex-1 pb-0">
					<ChartContainer config={{}} className="mx-auto aspect-square max-h-[260px] h-[260px]">
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie
								data={fileType}
								dataKey="count"
								nameKey="source"
								innerRadius={60}
								strokeWidth={5}
								stroke="transparent"
							>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
													<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
														{count}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="fill-muted-foreground text-xs uppercase"
													>
														Total
													</tspan>
												</text>
											);
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
			)}
		</Card>
	);
}
