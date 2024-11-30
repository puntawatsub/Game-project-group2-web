import { Viewer, Polyline, Entity, Billboard, BillboardGraphics, PolylineGraphics } from "resium";
import { Ion, VerticalOrigin, PinBuilder, Color, Cartesian3 } from "cesium";
import React from "react";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzY2QwNDE3Ni03ODdiLTQ0ZDUtOGEyZC1kZWMxNTc0MDdkZmQiLCJpZCI6MjU5MDA3LCJpYXQiOjE3MzI5MTA0NTB9.djwrwoxGgi2kDN9P2N_Zwspwc8QTl3g90ON9x3YeF88";

interface IonProps {
  className?: string;
  polyline?: boolean;
  name?: any;
  width?: any;
  material?: any;
  pins?: {
    position: number[],
    name: string
  }[];
  positions?: number[];
}

export default function Cesium(props: IonProps) {

  const pinBuilder = new PinBuilder();

  const { className, name, polyline, width, material, pins, positions } = props

  return (
      <Viewer className={className} full>
        {
          polyline && <Entity name={name}>
            <PolylineGraphics positions={Cartesian3.fromDegreesArray(positions!)} width={width} material={material}/>
          </Entity>
        }
        {
          pins && pins.map((pin, index: any) => {
            return (
              <Entity key={index} position={Cartesian3.fromDegrees(pin.position[0], pin.position[1])} name={pin.name}>
                <BillboardGraphics image={pinBuilder.fromText(pin.name, Color.BLUE, 48)} verticalOrigin={VerticalOrigin.BOTTOM}></BillboardGraphics>
              </Entity>
            )
          })
        }
      </Viewer>
  );
}
