"use client"

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [
    { month: "Jan", desktop: 186 },
    { month: "Feb", desktop: 305 },
    { month: "Mar", desktop: 237 },
    { month: "Apr", desktop: 473 },
    { month: "May", desktop: 509 },
    { month: "Jun", desktop: 614 },
]

const chartConfig = {
    desktop: {
        label: "PPTs Generated",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function UsageChart() {
    return (
        <Card className="border-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Generation Activity</CardTitle>
                <CardDescription>Video & Audio to PPT monthly volume</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <defs>
                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#colorUsage)"
                            stroke="#3b82f6"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}