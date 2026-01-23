import { Label, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const sourceData = [
    { source: "video", count: 450, fill: "#3b82f6" },
    { source: "audio", count: 300, fill: "#9333ea" },
    { source: "youtube", count: 200, fill: "#06b6d4" },
]

export function SourceDistribution() {
    return (
        <Card className="flex flex-col border-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-lg">Input Sources</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[260px] h-[260px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={sourceData}
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
                                                    950
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-xs uppercase">
                                                    Total PPTs
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}