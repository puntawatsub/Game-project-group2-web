'use client';

import React, { useState } from "react";
import Map from "../components/Map";
import { Color } from "cesium";

const Main = () => {

    const [twoLocations, setTwoLocations] = useState([
        {
            name: 'DE',
            position: [8.5518, 50.0354]
        },
        {
            name: 'FI',
            position: [24.9496, 60.3179]
        }
    ])

    const [isPolyline, setIsPolyline] = useState(true)




    return (
        <div>
            <Map className="h-[50rem]" positions={twoLocations} width={5} material={Color.RED} polyline={isPolyline}></Map>
            <button onClick={() => {
                setTwoLocations([])
                setIsPolyline(false)
            }}>Click me!</button>
        </div>
    )
}


export default Main;