/* 

When user select a country
Fetch carbon emission between two locations
Send the clue json back, let python calculate whether to update score or not
Let other countries play (again, using the previous clue json sent back to python)
Update the data (carbon, clue_points, invention)
Display the stats (as a popup for every player)

*/

import Country from "@/types/Country";
import backendURL from "./backendURL";
import { getCarbonEmission, getAirportLocation } from "./getFetch";
import PlayerCountry from "@/types/PlayerCountry";

const onUserSelectCountry = async (
  targetCountry: Country,
  currentCountryLocation: number[],
  targetCountryLocation: number[],
  countries: Country[]
) => {
  if (localStorage.getItem("playerCountry")) {
    const playerCountry: PlayerCountry[] = JSON.parse(
      localStorage.getItem("playerCountry")!
    );
    if (localStorage.getItem("currentCountry")) {
      const currentCountry: Country = JSON.parse(
        localStorage.getItem("currentCountry")!
      );
      // make sure to have ICAO in the country
      // const currentCountryLocation: number[] = await getAirportLocation(
      //   currentCountry.ICAO!
      // );
      // const targetCountryLocation: number[] = await getAirportLocation(
      //   targetCountry.ICAO!
      // );
      try {
        const carbonEmission: number = await getCarbonEmission(
          currentCountryLocation,
          targetCountryLocation
        );
        // after that returns carbonEmission
      } catch (error: any) {
        throw error;
      }
    } else {
      throw Error("Current country not found from localStorage.");
    }
  } else {
    throw Error("playerCountry not found in localStorage.");
  }
};

export default onUserSelectCountry;
