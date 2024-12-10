{/* <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
                        <RadialBarChart data={data} endAngle={180} innerRadius={80} outerRadius={130}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label content={({ viewBox })=> {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold">
                                                    {data[0].carbon_emission.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground">
                                                    Carbon Emissions
                                                </tspan>
                                            </text>
                                            )
                                        }
                                    }}
                                    />
                            </PolarRadiusAxis>
                            <RadialBar isAnimationActive={false} dataKey='left' stackId="a" cornerRadius={0} fill="#e2e8f0"
                                className="stroke-transparent stroke-2" />
                            <RadialBar dataKey="carbon_emission" fill="#dc2626" stackId="a" cornerRadius={0}
                                className="stroke-transparent stroke-2" />
                        </RadialBarChart>
                    </ChartContainer> */}

import React from "react";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { RadialBarChart, PolarRadiusAxis, Label, RadialBar, PolarGrid } from "recharts";

interface ChartProps {
    className?: string;
    chartConfig: ChartConfig;
    data: any[];
    color?: string
}

const StatusChart = (props: ChartProps) => {

    const {className, chartConfig, data, color} = props

    const adjustedData: any[] = [
        {
            number: data[0].number,
            left: data[0].total - data[0].number
        }
    ]

    return (
        <ChartContainer config={chartConfig} className={"w-full max-h-[12rem] aspect-square min-w-[180px] max-w-[250px] flex flex-col justify-end items-end " + `${className}`}>
            <RadialBarChart data={adjustedData} endAngle={180} innerRadius={80} outerRadius={130}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label content={({ viewBox })=> {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16}
                                        className="fill-foreground text-2xl font-bold">
                                        {adjustedData[0].number.toLocaleString()}
                                    </tspan>
                                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4}
                                        className="fill-muted-foreground">
                                        {chartConfig['number'].label}
                                    </tspan>
                                </text>
                                )
                            }
                        }}
                        />
                </PolarRadiusAxis>
                <RadialBar isAnimationActive={false} dataKey='left' stackId="a" cornerRadius={0} fill={'#e2e8f0'}
                    className="stroke-transparent stroke-2" />
                <RadialBar dataKey="number" fill={color || ""} stackId="a" cornerRadius={0}
                    className="stroke-transparent stroke-2" />
            </RadialBarChart>
        </ChartContainer>
    )
}

export default StatusChart;