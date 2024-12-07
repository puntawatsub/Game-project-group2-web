import {
  Viewer,
  Polyline,
  Entity,
  Billboard,
  BillboardGraphics,
  PolylineGraphics,
  ImageryLayer,
  useCesium,
  CameraFlyTo,
  Camera,
} from "resium";
import {
  Ion,
  VerticalOrigin,
  PinBuilder,
  Color,
  Cartesian3,
  Terrain,
  UrlTemplateImageryProvider,
} from "cesium";
import React, { useEffect, useState } from "react";
import { Locate } from "lucide-react";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzY2QwNDE3Ni03ODdiLTQ0ZDUtOGEyZC1kZWMxNTc0MDdkZmQiLCJpZCI6MjU5MDA3LCJpYXQiOjE3MzI5MTA0NTB9.djwrwoxGgi2kDN9P2N_Zwspwc8QTl3g90ON9x3YeF88";

interface IonProps {
  className?: string;
  polyline?: boolean;
  name?: any;
  width?: any;
  material?: any;
  pins?: {
    position: number[];
    name: string;
  }[];
  positions?: number[];
}

export default function Cesium(props: IonProps) {
  const { viewer } = useCesium();

  // useEffect(() => {
  //   if (
  //     viewer &&
  //     viewer.entities &&
  //     localStorage.getItem("currentPlayerCountry")
  //   ) {
  //     const entityName = localStorage.getItem("currentPlayerCountry");
  //     const entity = viewer.entities.values.find((e) => e.name === entityName);
  //     if (entity) {
  //       viewer.zoomTo(entity);
  //     } else {
  //       console.log(`Entity with name "${entityName}" not found.`);
  //     }
  //   }
  //   console.log(viewer?.entities);
  // }, [props.positions]);

  const pinBuilder = new PinBuilder();

  const { className, name, polyline, width, material, pins, positions } = props;

  const imageryProvider = new UrlTemplateImageryProvider({
    url: "https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}",
  });

  const [currentPlayer, setCurrentPlayer] = useState("");

  const [currentPlayerPin, setCurrentPlayerPin] = useState<any | undefined>();

  // useEffect(() => {
  //   const init = async () => {
  //     if (localStorage.getItem("currentPlayerCountry")) {
  //       setCurrentPlayer(localStorage.getItem("currentPlayerCountry")!);
  //       setCurrentPlayerPin(
  //         pins!.find((pin) => {
  //           return pin.name === currentPlayer;
  //         })
  //       );
  //     }
  //   };
  //   const interval = setInterval(async () => {
  //     if (currentPlayerPin !== undefined) {
  //       clearInterval(interval);
  //     } else {
  //       console.log(currentPlayerPin);
  //       await init();
  //     }
  //   }, 1000);
  // });

  const flyHome = () => {
    if (localStorage.getItem("currentPlayerCountry")) {
      const country = localStorage.getItem("currentPlayerCountry");
      console.log("trying to fly");
      console.log(currentPlayerPin);
      setCurrentPlayer(country!);
      setCurrentPlayerPin(
        pins!.find((pin) => {
          return pin.name === country;
        })
      );
    }
    setTimeout(() => {
      setCurrentPlayerPin(undefined);
    }, 2000);
  };

  return (
    <Viewer className={className}>
      <ImageryLayer imageryProvider={imageryProvider}></ImageryLayer>
      <div className="bg-white absolute bottom-prevent-footer flex justify-center items-center right-[1rem] rounded-xl">
        <button
          className="h-[3.5rem] w-[3.5rem] flex justify-center items-center"
          onClick={() => flyHome()}
        >
          <Locate className="self-center"></Locate>
        </button>
      </div>
      <Camera></Camera>
      {localStorage.getItem("currentPlayerCountry") &&
        currentPlayerPin?.position && (
          <CameraFlyTo
            destination={Cartesian3.fromDegrees(
              currentPlayerPin!.position[0],
              currentPlayerPin!.position[1],
              700000
            )}
            duration={2}
          ></CameraFlyTo>
        )}
      {polyline && (
        <Entity name={name}>
          <PolylineGraphics
            positions={Cartesian3.fromDegreesArray(positions!)}
            width={width}
            material={material}
          />
        </Entity>
      )}
      {pins &&
        pins.map((pin, index: any) => {
          return (
            <Entity
              key={index}
              position={Cartesian3.fromDegrees(
                pin.position[0],
                pin.position[1]
              )}
              name={pin.name}
            >
              <BillboardGraphics
                image={pinBuilder.fromText(pin.name, Color.BLUE, 48)}
                verticalOrigin={VerticalOrigin.BOTTOM}
              ></BillboardGraphics>
            </Entity>
          );
        })}
    </Viewer>
  );
}
