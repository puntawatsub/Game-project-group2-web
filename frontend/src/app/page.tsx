'use client';

import React, { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { ChartBar } from "lucide-react";


interface Country {
    id: number;
    name: string;
    clue_id: any;
    iso_country: string;
}

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

    const [searchInput, setSearchInput] = useState<string>("")

    const [isPolyline, setIsPolyline] = useState(true)

    const newArray = Array.from(Array(100).keys())

    const carbonEmissionData = [{ number: 8000, total: 10000 }]
    const cluePointData = [{number: 3, total: 20}]
    const capabilityData = [{ number: 65, total:  200}]

    const carbonChartConfig = {
        number: {
            label: "Carbon Emission"
        },
    } satisfies ChartConfig
    const cluePointChartConfig = {
        number: {
            label: "Clue Points"
        },
    } satisfies ChartConfig
    const capabilityChartConfig = {
        number : {
            label: "Invention Points"
        }
    }

    const [accordionValue, setAccordianValue] = useState<string>("")

    // const countries = ["Luxembourg", "Singapore", "Ireland", "Norway", "Qatar", "United Arab Emirates", "Switzerland", "United States", "Denmark", "Netherlands", "Brunei", "Iceland", "Austria", "Belgium", "Sweden", "Germany", "Australia", "Bahrain", "Saudi Arabia", "Finland"]

    const [countries, setCountries] = useState<Country[]>([])

    useEffect(() => {
        fetch('http://127.0.0.1:8080/random_clue')
            .then(async (value) => {
                const results: Country[] = await value.json()
                setCountries(results)
            })
    }, [])

    return (
        <div className="flex absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
            <section className="flex flex-col flex-none w-[18rem] h-full">
                <div className="p-[1rem]">
                    <div className="w-full font-semibold mb-[0.5rem] h-[50px] justify-between flex items-center">
                        <h1 className="text-[16px]">Spy Game</h1>
                        <Button variant='ghost' className="outline-none">
                            <ChartBar></ChartBar>
                        </Button>
                    </div>
                    <div className="flex flex-row w-full">
                        <Input value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}} placeholder="Search Countries"></Input>
                        {/* <Button className="ml-[0.5rem]">Search</Button> */}
                    </div>
                </div>
                <div className='border-[0.5px] h-[0.5px] w-full border-slate-200' />
                <div className='overflow-y-auto mb-[12rem]'>
                <Accordion type='single' value={accordionValue} onValueChange={(e) => {setAccordianValue(e)}} collapsible className="w-full">
                    {
                        countries.filter(e => {
                            return (e.name.toLowerCase().includes(searchInput.toLowerCase()) || e.iso_country.toLowerCase().includes(searchInput.toLowerCase()))
                        }).map((country, index) => {
                            return (
                                <AccordionItem className="px-[1rem]" value={country.name} key={index}>
                                    <AccordionTrigger>{country.name}</AccordionTrigger>
                                    <AccordionContent>
                                        <Button onClick={() => {setAccordianValue("")}}>Confirm</Button>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
                </div>
                <footer className="fixed border-[0.5px] flex flex-row p-[1rem] justify-center items-center bg-white border-slate-200 w-full bottom-0 h-[12rem]">
                    <Card className="p-[1rem]">
                        <CardHeader>
                            <CardTitle>Current Country:</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-2xl font-bold">France</h1>
                        </CardContent>
                    </Card>
                    <Card className="max-h-[10rem] m-[1rem]">
                        <CardHeader>
                            {/* <CardTitle>
                                Status
                            </CardTitle> */}
                        </CardHeader>
                        <CardContent className="flex flex-row justify-center items-center">
                            <StatusChart chartConfig={carbonChartConfig} data={carbonEmissionData} color="#dc2626" />
                            <StatusChart chartConfig={cluePointChartConfig} data={cluePointData} color="#4ade80" className="ml-[1rem]" />
                            <StatusChart chartConfig={capabilityChartConfig} data={capabilityData} color="#0891b2" className="ml-[1rem]" />
                        </CardContent>
                    </Card>
                </footer>
            </section>
            <div className="flex flex-1 justify-center items-center h-prevent-footer h-full w-full bg-black text-white">
                {
                    accordionValue.length !== 0 ? <p>Go to {accordionValue}</p> : <p>Map Placeholder</p>
                }
            </div>
            {/* <Map className="flex flex-1 h-prevent-footer" positions={twoLocations} width={5} material={Color.RED}
                polyline={isPolyline}></Map> */}
        </div>
    )
}


export default Main;