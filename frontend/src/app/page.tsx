'use client';

import React, { useState } from "react";
import Map from "../components/Map";
import { Color } from "cesium";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { RadialBarChart, PolarRadiusAxis, Label, RadialBar, PolarGrid } from "recharts";
import StatusChart from "@/components/StatusChart";

const Main = () => {

    const [twoLocations, setTwoLocations] = useState([
        // {
        //     name: 'DE',
        //     position: [8.5518, 50.0354]
        // },
        {
            name: 'FI',
            position: [24.9496, 60.3179]
        },
        {
            name: 'FR',
            position: [2.5508, 49.0079]
        }
    ])

    const [isPolyline, setIsPolyline] = useState(true)

    const newArray = Array.from(Array(100).keys())

    const carbonEmissionData = [{ carbon_emission: 8000, left: 2000 }]

    const chartConfig = {
        carbon_emission: {
            label: "Carbon Emission"
        },
    } satisfies ChartConfig


    return (
        <div className="flex absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
            <section className="flex flex-col flex-none w-[18rem] h-full">
                <div className="p-[1rem]">
                    <div className="w-full font-semibold mb-[0.5rem] flex items-center">
                        <h1 className="text-[14px]">Spy Game</h1>
                    </div>
                    <div className="flex flex-row w-full">
                        <Input placeholder="Search Countries"></Input>
                        <Button className="ml-[0.5rem]">Search</Button>
                    </div>
                </div>
                <div className='border-[0.5px] h-[0.5px] w-full border-slate-200' />
                <div className='overflow-y-auto mb-[10rem]'>
                    {
                        newArray.map((e, index) => {
                            return (
                                <p key={index}>asdf</p>
                            )
                        })
                    }
                </div>
                <div className="fixed border-[0.5px] bg-white border-slate-200 w-full bottom-0 h-[10rem]">
                    <StatusChart chartConfig={chartConfig} data={carbonEmissionData} color="#dc2626" />
                </div>
            </section>
            <Map className="flex flex-1 h-prevent-footer" positions={twoLocations} width={5} material={Color.RED}
                polyline={isPolyline}></Map>
        </div>
    )
}


export default Main;