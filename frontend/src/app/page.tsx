"use client";

import React, { useEffect, useRef, useState } from "react";
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
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  RadialBarChart,
  PolarRadiusAxis,
  RadialBar,
  PolarGrid,
} from "recharts";
import StatusChart from "@/components/StatusChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, ChartBar } from "lucide-react";
import Alert from "@/components/Alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import Slide from "@mui/material/Slide";
import FirstEnterDialog from "@/components/FirstEnterDialog";
import Country from "@/types/Country";
import backendURL from "@/components/backendURL";
import PlayerCountry from "@/types/PlayerCountry";

interface ErrorDisplay {
  open: boolean;
  title: string;
  description: string;
  onClose?: () => void;
}

interface SlideProp {
  in: boolean;
  direction?: "left" | "right" | "up" | "down" | undefined;
}

interface NextLocation {
  coordinate: number[];
  ICAO: string;
}

const Main = () => {
  const [currentLocation, setCurrentLocation] = useState<number[]>([]);
  const [userCountry, setUserCountry] = useState<Country>();
  const [currentCountry, setCurrentCountryState] = useState<Country>();

  const [twoLocations, setTwoLocations] = useState([
    // {
    //     name: 'DE',
    //     position: [8.5518, 50.0354]
    // },
    {
      name: "FI",
      position: [24.9496, 60.3179],
    },
    {
      name: "FR",
      position: [2.5508, 49.0079],
    },
  ]);

  const [searchInput, setSearchInput] = useState<string>("");

  const [isPolyline, setIsPolyline] = useState(true);

  const [errorDisplay, setErrorDisplay] = useState<ErrorDisplay>({
    open: false,
    title: "",
    description: "",
    onClose: () => {},
  });

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const newArray = Array.from(Array(100).keys());

  const carbonEmissionData = [{ number: 8000, total: 10000 }];
  const cluePointData = [{ number: 3, total: 20 }];
  const capabilityData = [{ number: 65, total: 200 }];

  const carbonChartConfig = {
    number: {
      label: "Carbon Emission",
    },
  } satisfies ChartConfig;
  const cluePointChartConfig = {
    number: {
      label: "Clue Points",
    },
  } satisfies ChartConfig;
  const capabilityChartConfig = {
    number: {
      label: "Invention Points",
    },
  };

  const [accordionValue, setAccordianValue] = useState<string>("");

  //   const [nameField, setNameField] = useState("");

  const [username, setUsername] = useState("");

  // const countries = ["Luxembourg", "Singapore", "Ireland", "Norway", "Qatar", "United Arab Emirates", "Switzerland", "United States", "Denmark", "Netherlands", "Brunei", "Iceland", "Austria", "Belgium", "Sweden", "Germany", "Australia", "Bahrain", "Saudi Arabia", "Finland"]

  const [countries, setCountries] = useState<Country[]>([]);

  const [namePageVisible, setNamePageVisible] = useState<boolean>(true);

  const [playerCountry, setPlayerCountry] = useState<PlayerCountry[]>([]);

  const [nextCountry, setNextCountry] = useState<Country>();

  const [nextLocation, setNextLocation] = useState<NextLocation>();

  const setCurrentCountry = (value: Country) => {
    localStorage.setItem("currentCountry", JSON.stringify(value));
    setCurrentCountryState(value);
  };

  const getPlayerCountryICAO = async (iso_country: string): Promise<string> => {
    let formData = new FormData();
    formData.append("iso_country", iso_country);
    try {
      const fetch_result = await fetch(
        `${backendURL}/get_ident_player_country`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json_result = await fetch_result.json();
      return json_result["ICAO"];
    } catch (error) {
      throw error;
    }
  };

  const getGameCountryICAO = async (iso_country: string): Promise<string> => {
    let formData = new FormData();
    formData.append("iso_country", iso_country);
    try {
      const fetch_result = await fetch(`${backendURL}/get_ident_game_country`, {
        method: "POST",
        body: formData,
      });
      const json_result = await fetch_result.json();
      return json_result["ICAO"];
    } catch (error) {
      throw error;
    }
  };

  const getAirportLocation = async (icao: string): Promise<number[]> => {
    let formData = new FormData();
    formData.append("ICAO", icao);
    try {
      const fetch_result = await fetch(`${backendURL}/request_location`, {
        method: "POST",
        body: formData,
      });
      const json_result = await fetch_result.json();
      return [json_result["latitude_deg"], json_result["longitude_deg"]];
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // fetch countries and randomize clues
    const init = async () => {
      fetch(`${backendURL}/random_clue`)
        .then(async (value) => {
          const results: Country[] = await value.json();
          setCountries(results);
        })
        .catch((error: Error) => {
          setErrorDisplay({
            open: true,
            title: "Error",
            description: `${error.name}. "${error.message}". Please try again later.`,
            onClose: () => {
              setErrorDisplay({ ...errorDisplay, open: false });
              location.reload();
            },
          });
        });
      fetch(`${backendURL}/player_country`)
        .then(async (response) => {
          const result: PlayerCountry[] = await response.json();
          setPlayerCountry(result);
          sessionStorage.setItem("playerCountry", JSON.stringify(result));
        })
        .catch((error: Error) => {
          setErrorDisplay({
            open: true,
            title: "Error",
            description: `${error.name}. "${error.message}". Please try again later.`,
            onClose: () => {
              setErrorDisplay({ ...errorDisplay, open: false });
              location.reload();
            },
          });
        });
      // check if user is signed in
      const user = localStorage.getItem("user");
      if (user === null) {
        setIsDialogOpen(true);
      } else {
        setUsername(user);
      }
    };
    init().catch(console.error);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("currentCountry")) {
      const currentCountry_temp: Country = JSON.parse(
        localStorage.getItem("currentCountry")!
      );
      setCurrentCountry(currentCountry_temp);
      getAirportLocation(currentCountry_temp.ICAO!).then((location) => {
        setCurrentLocation(location);
      });
    }
  }, []);

  return (
    <div className="flex absolute top-0 bottom-0 left-0 right-0 overflow-hidden">
      {/* Error Alert */}
      <Alert
        title={errorDisplay.title}
        description={errorDisplay.description}
        open={errorDisplay.open}
      >
        <Button
          variant="outline"
          onClick={() => {
            errorDisplay.onClose && errorDisplay.onClose();
          }}
        >
          Close
        </Button>
      </Alert>
      {/* End Error Alert */}
      {/* If user is not logged in */}
      <FirstEnterDialog
        isDialogOpen={isDialogOpen}
        onFinished={(result) => {
          localStorage.setItem("user", `${result.name}`);
          setUsername(result.name);
          let formData = new FormData();
          formData.append("iso_country", result.iso_country);
          getPlayerCountryICAO(result.iso_country).then(async (ICAO_result) => {
            const temp_userCountry: Country = {
              name: playerCountry.find((e) => {
                return e.iso_country === result.iso_country;
              })!.name,
              iso_country: result.iso_country,
              ICAO: ICAO_result,
            };
            setUserCountry(temp_userCountry);
            setCurrentCountry(temp_userCountry);
            getAirportLocation(ICAO_result).then((location_result) => {
              setCurrentLocation(location_result);
            });
            setIsDialogOpen(false);
          });
        }}
      />
      {/* End if user is not logged in */}
      <section className="flex flex-col flex-none w-[18rem] h-full">
        <div className="p-[1rem]">
          <div className="w-full font-semibold mb-[0.5rem] h-[50px] justify-between flex items-center">
            <h1 className="text-[16px]">
              Hello, Spy {username.length < 11 ? username : ""}
            </h1>
            <Button variant="ghost" className="outline-none">
              <ChartBar></ChartBar>
            </Button>
          </div>
          <div className="flex flex-row w-full">
            <Input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder="Search Countries"
            ></Input>
            {/* <Button className="ml-[0.5rem]">Search</Button> */}
          </div>
        </div>
        <div className="border-[0.5px] h-[0.5px] w-full border-slate-200" />
        <div className="overflow-y-auto mb-[12rem]">
          <Accordion
            type="single"
            value={accordionValue}
            onValueChange={(e) => {
              setAccordianValue(e);
            }}
            collapsible
            className="w-full"
          >
            {countries
              .filter((e) => {
                return (
                  e.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                  e.iso_country
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
                );
              })
              .map((country, index) => {
                return (
                  <AccordionItem
                    className="px-[1rem]"
                    value={country.name}
                    key={index}
                  >
                    <AccordionTrigger
                      onClick={() => {
                        if (accordionValue === country.name) {
                          return;
                        }
                        getGameCountryICAO(country.iso_country)
                          .then((icao) => {
                            getAirportLocation(icao)
                              .then((location) => {
                                setNextLocation({
                                  ICAO: icao,
                                  coordinate: location,
                                });
                                setNextCountry({ ...country, ICAO: icao });
                              })
                              .catch((error: Error) => {
                                setErrorDisplay({
                                  open: true,
                                  title: "Error",
                                  description: `${error.name}: ${error.message}`,
                                });
                              });
                          })
                          .catch((error: Error) => {
                            setErrorDisplay({
                              title: "Error",
                              description: `${error.name}: ${error.message}`,
                              open: true,
                            });
                          });
                      }}
                    >
                      {country.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Button
                        onClick={() => {
                          console.log(nextLocation);
                          setCurrentCountry({
                            ...country,
                            ICAO: nextLocation!.ICAO,
                          });
                          getAirportLocation(nextCountry!.ICAO!).then(
                            (location) => {
                              setCurrentLocation(location);
                            }
                          );
                          setAccordianValue("");
                          setSearchInput("");
                        }}
                      >
                        Go to {country.name}
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </div>
        <footer className="fixed border-[0.5px] flex flex-row p-[1rem] justify-center items-center bg-white border-slate-200 w-full bottom-0 h-[12rem]">
          <Card className="p-[1rem]">
            <CardHeader>
              <CardTitle>Current Country:</CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-xl font-bold text-nowrap text-ellipsis">
                {currentCountry?.name}
              </h1>
            </CardContent>
          </Card>
          <Card className="max-h-[10rem] m-[1rem]">
            <CardHeader>
              {/* <CardTitle>
                                Status
                            </CardTitle> */}
            </CardHeader>
            <CardContent className="flex flex-row justify-center items-center">
              <StatusChart
                chartConfig={carbonChartConfig}
                data={carbonEmissionData}
                color="#dc2626"
              />
              <StatusChart
                chartConfig={cluePointChartConfig}
                data={cluePointData}
                color="#4ade80"
                className="ml-[1rem]"
              />
              <StatusChart
                chartConfig={capabilityChartConfig}
                data={capabilityData}
                color="#0891b2"
                className="ml-[1rem]"
              />
            </CardContent>
          </Card>
        </footer>
      </section>
      <div className="flex flex-1 justify-center items-center h-prevent-footer h-full w-full bg-black text-white">
        {accordionValue.length !== 0 ? (
          <p>{`[${currentLocation[0]}, ${currentLocation[1]}] -> [${nextLocation?.coordinate[0]}, ${nextLocation?.coordinate[1]}]`}</p>
        ) : !currentCountry ? (
          <p>Map Placeholder</p>
        ) : (
          <p>
            At {currentCountry.ICAO}{" "}
            {`[${currentLocation[0]}, ${currentLocation[1]}]`}
          </p>
        )}
      </div>
      {/* <Map className="flex flex-1 h-prevent-footer" positions={twoLocations} width={5} material={Color.RED}
                polyline={isPolyline}></Map> */}
    </div>
  );
};

export default Main;
