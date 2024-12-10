"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "../components/Map";
import { Color, UrlTemplateImageryProvider } from "cesium";
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
import {
  getAirportLocation,
  getCarbonEmission,
  getClueFromId,
  getGameCountryICAO,
  getInventors,
  getNewPlayerCountry,
  getPlayerCountryICAO,
} from "@/components/getFetch";
import competitors from "@/components/competitors";
import { loser } from "@/components/winner_loser";
import Cesium from "@/components/Cesium";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface LimitFetch {
  carbon_limit: number;
  clue_target: number;
  invention_target: number;
}

interface NumberChartData {
  number: number;
  total: number;
}

interface ConfirmDisplay {
  open: boolean;
  title: string;
  description: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

interface CompetitorResponse {
  data: PlayerCountry;
  message: string[];
}

interface PlayerScore {
  clue: number;
  invention: number;
  carbon: number;
}

interface PlayerLocation {
  iso_country: string;
  location: number[];
}

const LazyMain = () => {
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

  const [confirmDisplay, setConfirmDisplay] = useState<ConfirmDisplay>({
    open: false,
    title: "",
    description: "",
    onClose: () => {},
    onConfirm: () => {},
  });

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

  // Chart data
  const [carbonEmissionData, setCarbonEmissionData] = useState<
    NumberChartData[]
  >([{ number: 0, total: 0 }]);
  const [cluePointData, setCluePointData] = useState<NumberChartData[]>([
    { number: 0, total: 0 },
  ]);
  const [capabilityData, setCapabilityData] = useState<NumberChartData[]>([
    { number: 0, total: 0 },
  ]);

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

  const [nextCountry, setNextCountry] = useState<Country>();

  const [nextLocation, setNextLocation] = useState<NextLocation>();

  const [playerCountries, setPlayerCountries] = useState<PlayerCountry[]>([]);

  const [playerLocations, setPlayerLocations] = useState<PlayerLocation[]>([]);

  const [isStatusShowOpen, setIsStatusShowOpen] = useState(false);
  const imageryProvider = new UrlTemplateImageryProvider({
    url: "https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}",
  });

  const [turn, setTurn] = useState(0);

  // limits
  const [carbonLimit, setCarbonLimit] = useState<number>(0);
  const [inventionTarget, setInventionTarget] = useState<number>(0);
  const [clueTarget, setClueTarget] = useState<number>(0);

  const setCurrentCountry = (value: Country) => {
    localStorage.setItem("currentCountry", JSON.stringify(value));
    setCurrentCountryState(value);
  };

  const getClueCountries = () => {
    fetch(`${backendURL}/random_clue`)
      .then(async (value) => {
        const results: Country[] = await value.json();
        setCountries(results);
        sessionStorage.setItem("gameCountries", JSON.stringify(results));
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
  };

  const updateScore = () => {
    const temp_json = {
      carbon: carbonEmissionData[0].number,
      invention: capabilityData[0].number,
      clue: cluePointData[0].number,
    };
    localStorage.setItem("score", JSON.stringify(temp_json));
  };

  const getScore = () => {
    if (localStorage.getItem("score")) {
      const temp_json: { carbon: number; invention: number; clue: number } =
        JSON.parse(localStorage.getItem("score")!);
      setCarbonEmissionData([{ number: temp_json.carbon, total: 0 }]);
    }
  };

  const getPlayersLocation = async () => {
    let return_construct: PlayerLocation[] = [];
    const promise = playerCountries.map(async (playerCountry) => {
      const location = await getAirportLocation(playerCountry.ICAO);
      return_construct.push({
        location: location,
        iso_country: playerCountry.iso_country,
      });
      return;
    });
    await Promise.all(promise);
    setPlayerLocations(return_construct);
  };

  const onPlayerSelectCountry = async (country: Country) => {
    async function calculateClue() {
      if (clue_result >= clueTarget) {
        // reached clue target
        message.push(`You've reached the clue target.`);
        const inventor_country =
          countries[Math.floor(Math.random() * countries.length)];
        let confirm = false;
        setConfirmDisplay({
          open: true,
          title: "Clue target reached",
          description:
            "You've reached the clue target. Do you want to use it now?",
          onClose: () => {
            confirm = false;
            setConfirmDisplay({ ...confirmDisplay, open: false });
            finishing();
          },
          onConfirm: () => {
            confirm = true;
            setConfirmDisplay({ ...confirmDisplay, open: false });
            if (confirm) {
              // user confirmed to use clue points
              setConfirmDisplay({
                open: true,
                title: "Inventor found",
                description: `Inventor found at ${inventor_country.name}. Do you wish to go?`,
                onClose: () => {
                  confirm = false;
                  setConfirmDisplay({ ...confirmDisplay, open: false });
                  finishing();
                },
                onConfirm: async () => {
                  confirm = true;
                  setConfirmDisplay({ ...confirmDisplay, open: false });
                  if (true) {
                    // user confirm to go to the inventors country
                    const didCooperate = Math.random() < 0.6;
                    const inventor_icao = await getGameCountryICAO(
                      inventor_country.iso_country
                    );
                    const inventor_location = await getAirportLocation(
                      inventor_icao
                    );

                    // get carbon emission
                    const inventor_carbon_emission = await getCarbonEmission(
                      currentLocation,
                      inventor_location
                    );

                    // set current location to inventor_location
                    setCurrentLocation(inventor_location);
                    setCurrentCountry(inventor_country);
                    ICAO_result = inventor_icao;

                    // add carbon emission
                    carbon_result += inventor_carbon_emission;

                    // reset clue points
                    clue_result = 0;

                    if (didCooperate) {
                      // if inventor chooses to cooperate
                      const inventors = await getInventors();
                      const random_inventor =
                        inventors[Math.floor(Math.random() * inventors.length)];
                      invention_result += random_inventor.contribution;
                      message.push(
                        `You've met ${random_inventor.name} with ${random_inventor.contribution} invention points.`
                      );
                      if (invention_result >= inventionTarget) {
                        console.log(
                          `invention result: ${invention_result} and target ${inventionTarget}`
                        );
                        // player wins
                        setErrorDisplay({
                          open: true,
                          title: "You've won!",
                          description: `Congratulations! You've won this game, You've met ${random_inventor.name} with ${random_inventor.contribution} invention points.`,
                          onClose: () => {
                            setErrorDisplay({ ...errorDisplay, open: false });
                            localStorage.clear();
                            location.reload();
                          },
                        });
                      } else {
                        finishing();
                      }
                    } else {
                      // inventor chooses not to cooperate
                      message.push(
                        `You've met an inventor but they chose not to cooperate.`
                      );
                      setErrorDisplay({
                        open: true,
                        title: "Failure to convince inventor",
                        description:
                          "You've met an investor, but they chose not to cooperate.",
                        onClose: () => {
                          setErrorDisplay({ ...errorDisplay, open: false });
                          finishing();
                        },
                      });
                    }
                  }
                },
              });
            }
          },
        });
      } else {
        finishing();
      }
    }
    let result_construct: PlayerCountry[] = [];

    setAccordianValue("");
    setSearchInput("");
    let carbon_emission = 0;
    const isSameLocation =
      currentLocation[0] === nextLocation!.coordinate[0] &&
      currentLocation[1] === nextLocation!.coordinate[1];
    if (isSameLocation) {
      carbon_emission = 1400;
    } else {
      carbon_emission = await getCarbonEmission(
        currentLocation,
        nextLocation!.coordinate
      );
    }
    if (!localStorage.getItem("currentPlayerCountry")) {
      throw Error("currentPlayerCountry not found.");
    }
    const currentPlayerCountry_iso = localStorage.getItem(
      "currentPlayerCountry"
    );
    const this_playerCountry = playerCountries.find((country_list) => {
      return country_list.iso_country === currentPlayerCountry_iso;
    });
    if (this_playerCountry === undefined) {
      throw Error("Country that current player is playing is now invalid.");
    }
    getAirportLocation(nextCountry!.ICAO!).then((location) => {
      setCurrentLocation(location);
    });
    setAccordianValue("");
    setSearchInput("");

    // start mechanism
    let carbon_result = this_playerCountry.carbon;
    let ICAO_result = this_playerCountry.ICAO;
    let invention_result = this_playerCountry.invention;
    let clue_result = this_playerCountry.clue;
    let message: string[] = [];

    carbon_result = this_playerCountry.carbon + carbon_emission;

    if (carbon_result > carbonLimit) {
      // carbon exceeds
      alert("You've exceed carbon limit!");
      localStorage.clear();
      location.reload();
    }
    ICAO_result = nextCountry!.ICAO!;

    message.push(
      `${
        isSameLocation
          ? "You taxied around the same runway and emitted"
          : `You went to ${nextCountry!.name} with`
      } ${
        Number.isInteger(carbon_emission)
          ? carbon_emission
          : carbon_emission.toFixed(3)
      } carbon emission, total carbon emission is now ${
        Number.isInteger(carbon_result)
          ? carbon_result
          : carbon_result.toFixed(3)
      }`
    );
    setErrorDisplay({
      open: true,
      title: "Travel",
      description: `You went to ${nextCountry!.name} with ${
        Number.isInteger(carbon_emission)
          ? carbon_emission
          : carbon_emission.toFixed(3)
      } carbon emission, total carbon emission is now ${
        Number.isInteger(carbon_emission)
          ? carbon_emission
          : carbon_emission.toFixed(3)
      }`,
      onClose: () => {
        setErrorDisplay({ ...errorDisplay, open: false });
      },
    });
    if (nextCountry!.clue_id === null) {
      // met no clue
      message.push(`You've met no one`);
      setErrorDisplay({
        open: true,
        title: "Met no one",
        description: `You've met no one`,
        onClose: () => {
          setErrorDisplay({ ...errorDisplay, open: false });
          calculateClue();
        },
      });
    } else {
      const fetched_clue: Clue = await getClueFromId(nextCountry!.clue_id!);
      clue_result = this_playerCountry.clue + fetched_clue.points;
      message.push(
        `You've met ${fetched_clue.type} with ${fetched_clue.points} clue points`
      );
      setErrorDisplay({
        open: true,
        title: "Met clue",
        description: `You've met ${fetched_clue.type} with ${fetched_clue.points} clue points`,
        onClose: () => {
          setErrorDisplay({ ...errorDisplay, open: false });
          calculateClue();
        },
      });
    }
    async function finishing() {
      if (invention_result >= inventionTarget) {
        console.log("You win the game, implement it here");
      }
      if (carbon_result > carbonLimit) {
        console.log("You loses");
        setErrorDisplay({
          open: true,
          title: "Game Over",
          description: "Carbon limit exceeded! Game over.",
          onClose: () => {
            setErrorDisplay({ ...errorDisplay, open: false });
            localStorage.clear();
            location.reload();
          },
        });
      }
      if (clue_result > 20) {
        clue_result = 20;
      }
      result_construct.push({
        invention: invention_result,
        iso_country: this_playerCountry!.iso_country,
        player_country_id: this_playerCountry!.player_country_id,
        ICAO: ICAO_result,
        name: this_playerCountry!.name,
        clue: clue_result,
        carbon: carbon_result,
      });
      setCarbonEmissionData([
        {
          ...carbonEmissionData[0],
          number: carbon_result,
        },
      ]);
      setCluePointData([
        {
          ...cluePointData[0],
          number: clue_result,
        },
      ]);
      setCapabilityData([
        {
          ...capabilityData[0],
          number: invention_result,
        },
      ]);

      localStorage.setItem(
        "playerScore",
        JSON.stringify({
          clue: clue_result,
          invention: invention_result,
          carbon: carbon_result,
        })
      );

      const competitor_response = await competitors(
        clueTarget,
        carbonLimit,
        inventionTarget
      );
      console.log(competitor_response.length);
      if (competitor_response[0] === "winner") {
        console.log("wins");
        // someone wins
        setErrorDisplay({
          open: true,
          title: "A country wins",
          description: `${competitor_response[1]} wins the game!`,
          onClose: () => {
            setErrorDisplay({ ...errorDisplay, open: false });
            localStorage.clear();
            location.reload();
          },
        });
      } else {
        // no one wins yet
        for (const response of competitor_response as any[]) {
          const competitor: CompetitorResponse = response;
          if (!loser.includes(competitor.data.name)) {
            result_construct.push(competitor.data);
            console.log(competitor.data);
            console.log(competitor.message);
            console.log(`${competitor.data.name} is not a loser`);
            console.log(loser);
          }
          message = message.concat(competitor.message);
        }
        setCurrentCountry({
          ...country,
          ICAO: nextLocation!.ICAO,
        });
        setPlayerCountries(result_construct);
        localStorage.setItem("playerCountry", JSON.stringify(result_construct));
        let all_messages = "";
        for (const m of message) {
          if (message.indexOf(m) === 0) {
            all_messages = m;
          } else {
            all_messages += `\n\n${m}`;
          }
        }
        setErrorDisplay({
          open: true,
          title: "Turn Summary",
          description: all_messages,
          onClose: () => {
            setErrorDisplay({ ...errorDisplay, open: false });
          },
        });
      }
      if (localStorage.getItem("message")) {
        let temp_message: string[] = JSON.parse(
          localStorage.getItem("message")!
        );
        temp_message = temp_message.concat(message);
        localStorage.setItem("message", JSON.stringify(temp_message));
      } else {
        localStorage.setItem("message", JSON.stringify(message));
      }
      getClueCountries();
      await getPlayersLocation();
      setTurn(turn + 1);
    }
  };

  useEffect(() => {
    // fetch countries and randomize clues
    const init = async () => {
      fetch(`${backendURL}/random_clue`)
        .then(async (value) => {
          const results: Country[] = await value.json();
          setCountries(results);
          sessionStorage.setItem("gameCountries", JSON.stringify(results));
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

      fetch(`${backendURL}/get_limit`)
        .then(async (response) => {
          const limit_json: LimitFetch = await response.json();
          if (localStorage.getItem("playerScore")) {
            const playerScore: PlayerScore = JSON.parse(
              localStorage.getItem("playerScore")!
            );
            setCluePointData([
              { total: limit_json.clue_target, number: playerScore.clue },
            ]);
            setCapabilityData([
              {
                total: limit_json.invention_target,
                number: playerScore.invention,
              },
            ]);
            setCarbonEmissionData([
              { total: limit_json.carbon_limit, number: playerScore.carbon },
            ]);
          } else {
            setCluePointData([
              { ...cluePointData[0], total: limit_json.clue_target },
            ]);
            setCapabilityData([
              { ...capabilityData[0], total: limit_json.invention_target },
            ]);
            setCarbonEmissionData([
              { ...carbonEmissionData[0], total: limit_json.carbon_limit },
            ]);
          }
          setCarbonLimit(limit_json.carbon_limit);
          setClueTarget(limit_json.clue_target);
          setInventionTarget(limit_json.invention_target);
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
      if (localStorage.getItem("playerCountry")) {
        setPlayerCountries(JSON.parse(localStorage.getItem("playerCountry")!));
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

  // useEffect(() => {
  //   console.log("run location finder");
  //   const init = async () => {
  //     await getPlayersLocation();
  //   };
  //   const interval = setInterval(async () => {
  //     if (
  //       localStorage.getItem("user") &&
  //       playerLocations.length !==
  //         JSON.parse(localStorage.getItem("playerCountry")!).length
  //     ) {
  //       await init();
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // });
  useEffect(() => {
    const init = async () => {
      await getPlayersLocation();
    };
    const interval = setInterval(async () => {
      await init();
    }, 1000);
    return () => clearInterval(interval);
  });

  // useEffect(() => {
  //   console.log("run location finder");
  //   const init = async () => {
  //     await getPlayersLocation();
  //   };
  //   const interval = setInterval(async () => {
  //     if (
  //       localStorage.getItem("user") &&
  //       playerLocations.length !==
  //         JSON.parse(localStorage.getItem("playerCountry")!).length
  //     ) {
  //       await init();
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // });
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
      <Dialog
        open={isStatusShowOpen}
        onOpenChange={(open) => setIsStatusShowOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Countries Status</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="score">
            <TabsList className="w-full flex flex-row justify-around">
              <TabsTrigger value="score" className="flex-1">
                Score
              </TabsTrigger>
              <TabsTrigger value="message" className="flex-1">
                Messages
              </TabsTrigger>
            </TabsList>
            <TabsContent value="score">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Country</TableHead>
                    <TableHead>Carbon Emission</TableHead>
                    <TableHead>Clue Points</TableHead>
                    <TableHead className="text-right">
                      Invention Points
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerCountries
                    .filter((e) => {
                      if (localStorage.getItem("currentPlayerCountry")) {
                        return (
                          localStorage.getItem("currentPlayerCountry") !==
                          e.iso_country
                        );
                      }
                      return true;
                    })
                    .map((playerCountry, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {playerCountry.name} ({playerCountry.iso_country})
                          </TableCell>
                          <TableCell>
                            <span className="inline text-gray-500 font-light">
                              <span className="font-bold text-[18px] text-black">
                                {playerCountry.carbon.toFixed(3)}
                              </span>
                              /{carbonLimit}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline text-gray-500 font-light">
                              <span className="font-bold text-[18px] text-black">
                                {playerCountry.clue}
                              </span>
                              /{clueTarget}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="inline text-gray-500 font-light">
                              <span className="font-bold text-[18px] text-black">
                                {playerCountry.invention}
                              </span>
                              /{inventionTarget}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent
              value="message"
              className="max-h-[50vh] overflow-y-auto"
            >
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Messages</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localStorage.getItem("message") &&
                    (JSON.parse(localStorage.getItem("message")!) as string[])
                      .reverse()
                      .map((message, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{message}</TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Alert
        title={confirmDisplay.title}
        description={confirmDisplay.description}
        open={confirmDisplay.open}
      >
        <Button
          onClick={() => {
            confirmDisplay.onConfirm && confirmDisplay.onConfirm();
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            confirmDisplay.onClose && confirmDisplay.onClose();
          }}
          variant="outline"
        >
          Cancel
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
            getNewPlayerCountry()
              .then((playerCountry) => {
                const temp_userCountry: Country = {
                  name: playerCountry.find((e) => {
                    return e.iso_country === result.iso_country;
                  })!.name,
                  iso_country: result.iso_country,
                  ICAO: ICAO_result,
                  clue_id: null,
                };
                setCluePointData([
                  {
                    ...cluePointData[0],
                    number: playerCountry.find((e) => {
                      return e.iso_country === result.iso_country;
                    })!.clue,
                  },
                ]);
                setCapabilityData([
                  {
                    ...capabilityData[0],
                    number: playerCountry.find((e) => {
                      return e.iso_country === result.iso_country;
                    })!.invention,
                  },
                ]);
                setCarbonEmissionData([
                  {
                    ...carbonEmissionData[0],
                    number: playerCountry.find((e) => {
                      return e.iso_country === result.iso_country;
                    })!.carbon,
                  },
                ]);
                const temp_score: PlayerScore = {
                  clue: playerCountry.find((e) => {
                    return e.iso_country === result.iso_country;
                  })!.clue,
                  invention: playerCountry.find((e) => {
                    return e.iso_country === result.iso_country;
                  })!.invention,
                  carbon: playerCountry.find((e) => {
                    return e.iso_country === result.iso_country;
                  })!.carbon,
                };
                localStorage.setItem("playerScore", JSON.stringify(temp_score));
                setUserCountry(temp_userCountry);
                setCurrentCountry(temp_userCountry);
                localStorage.setItem(
                  "currentPlayerCountry",
                  result.iso_country
                );
                getAirportLocation(ICAO_result).then((location_result) => {
                  setCurrentLocation(location_result);
                });
                setIsDialogOpen(false);
              })
              .catch((error: Error) => {
                setErrorDisplay({
                  open: true,
                  title: "Error",
                  description: error.message,
                  onClose: () => {
                    setErrorDisplay({ ...errorDisplay, open: false });
                  },
                });
              });
          });
          setPlayerCountries(
            JSON.parse(localStorage.getItem("playerCountry")!)
          );
        }}
      />
      {/* End if user is not logged in */}
      <section className="flex flex-col flex-none w-[18rem] h-full">
        <div className="p-[1rem]">
          <div className="w-full font-semibold mb-[0.5rem] h-[50px] justify-between flex items-center">
            <h1 className="text-[16px]">
              Hello, Spy {username.length < 11 ? username : ""}
            </h1>
            <Button
              variant="ghost"
              onClick={() => setIsStatusShowOpen(true)}
              className="outline-none"
            >
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
                          // console.log(nextLocation);
                          onPlayerSelectCountry(country);
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
          <Card className="p-[1rem]">
            <CardHeader>
              <CardTitle>Player Country:</CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-xl font-bold text-nowrap text-ellipsis">
                {localStorage.getItem("currentPlayerCountry") &&
                  playerCountries.find((e) => {
                    return (
                      e.iso_country ===
                      localStorage.getItem("currentPlayerCountry")
                    );
                  })?.name}
              </h1>
            </CardContent>
          </Card>
        </footer>
      </section>
      {/* <div className="flex flex-1 justify-center items-center h-prevent-footer h-full w-full bg-black text-white">
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
      </div> */}
      <div className="flex flex-1 h-prevent-footer">
        {accordionValue.length !== 0 && nextLocation?.coordinate ? (
          <Map
            className="flex flex-1 h-prevent-footer"
            positions={[
              {
                position: [currentLocation[1], currentLocation[0]],
                name: localStorage.getItem("currentPlayerCountry")!,
              },
              {
                position: [
                  nextLocation!.coordinate[1],
                  nextLocation!.coordinate[0],
                ],
                name: localStorage.getItem("currentPlayerCountry")!,
              },
            ]}
            polyline={true}
            width={2}
            material={Color.RED}
          ></Map>
        ) : (
          <Map
            className="flex flex-1 h-prevent-footer"
            positions={
              playerLocations.length > 0
                ? playerCountries.map((country) => {
                    const positions = playerLocations.find((e) => {
                      return e.iso_country === country.iso_country;
                    })!.location;
                    return {
                      name: country.iso_country,
                      position: [positions[1], positions[0]],
                    };
                  })
                : []
            }
          ></Map>
        )}
      </div>
    </div>
  );
};

export default LazyMain;
