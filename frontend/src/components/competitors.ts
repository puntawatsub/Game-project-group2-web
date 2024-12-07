import Country from "@/types/Country";
import PlayerCountry from "@/types/PlayerCountry";
import React from "react";
import {
  getAirportLocation,
  getCarbonEmission,
  getClueFromId,
  getGameCountryICAO,
  getInventors,
} from "./getFetch";
import { loser, winner } from "./winner_loser";

interface CompetitorResponse {
  data: PlayerCountry;
  message: string[];
}

// if carbon exceeds, don't add clue point or invention, just go straight to losing.

const competitors = async (
  clue_target: number,
  carbon_limit: number,
  invention_target: number
): Promise<CompetitorResponse[] | ["winner", string]> => {
  let result_winner: string[] = [];

  if (!localStorage.getItem("countriesLocation")) {
    if (localStorage.getItem("playerCountry")) {
      let countriesLocation: CountryLocation[] = [];
      const playerCountry: PlayerCountry[] = JSON.parse(
        localStorage.getItem("playerCountry")!
      );
      for (const country of playerCountry) {
        try {
          const location = await getAirportLocation(country.ICAO);
          countriesLocation.push({
            iso_country: country.iso_country,
            location: location,
          });
        } catch (error: any) {
          console.error("Error fetching airport location:", error.message);
        }
      }
      localStorage.setItem(
        "countriesLocation",
        JSON.stringify(countriesLocation)
      );
    }
  }

  let countriesLocation: CountryLocation[] = JSON.parse(
    localStorage.getItem("countriesLocation")!
  );

  if (!localStorage.getItem("currentPlayerCountry")) {
    throw Error("currentPlayerCountry NOT FOUND");
  }
  if (!localStorage.getItem("playerCountry")) {
    throw Error("playerCountry NOT FOUND");
  }
  if (!sessionStorage.getItem("gameCountries")) {
    throw Error("gameCountry NOT FOUND");
  }

  const playerCountries: PlayerCountry[] = JSON.parse(
    localStorage.getItem("playerCountry")!
  );
  const currentPlayerCountry_iso: string = localStorage.getItem(
    "currentPlayerCountry"
  )!;
  const gameCountries: Country[] = JSON.parse(
    sessionStorage.getItem("gameCountries")!
  );

  let result_construct: CompetitorResponse[] = [];

  const CountryOperation = async () => {
    // Create an array of promises for each country
    let winner = [];
    const promises = playerCountries
      .filter((e) => {
        return e.iso_country !== currentPlayerCountry_iso;
      })
      .map(async (country) => {
        // double checking
        if (country.iso_country !== currentPlayerCountry_iso) {
          console.log(`${country.iso_country} !== ${currentPlayerCountry_iso}`);
          // Declare all vars
          let carbon_result = 0;
          let ICAO_result = "";
          let invention_result = 0;
          let clue_result = 0;
          let message: string[] = [];

          invention_result = country.invention;
          clue_result = country.clue;

          try {
            // Competitor chooses a random country
            let targetCountry =
              gameCountries[Math.floor(Math.random() * gameCountries.length)];

            if (targetCountry.clue_id !== null) {
              // Get clue details
              const clue = await getClueFromId(targetCountry.clue_id);
              const ICAO = await getGameCountryICAO(targetCountry.iso_country);

              const country_location = await getAirportLocation(country.ICAO);
              const target_location = await getAirportLocation(ICAO);

              const carbon_emission =
                ICAO !== country.ICAO
                  ? await getCarbonEmission(country_location, target_location)
                  : 1400;

              carbon_result = country.carbon + carbon_emission;
              ICAO_result = ICAO;
              if (carbon_result <= carbon_limit) {
                message.push(
                  `${country.name} went to ${targetCountry.name} with ${carbon_emission} carbon emission, total carbon emission is now ${carbon_result}`
                );
                message.push(
                  `${country.name} have met ${clue.type} with ${clue.points} clue points`
                );
                clue_result = clue.points + country.clue;
                if (clue_result >= clue_target) {
                  // Clue target reached
                  message.push(`${country.name} has reached the clue target.`);
                  clue_result = 0;

                  // Find inventors
                  const inventors = await getInventors();
                  const random_inventor =
                    inventors[Math.floor(Math.random() * inventors.length)];
                  invention_result =
                    country.invention + random_inventor.contribution;

                  message.push(
                    `${country.name} has met ${random_inventor.name} with ${random_inventor.contribution} invention points`
                  );

                  if (invention_result >= invention_target) {
                    // Winner
                    winner.push(country.name);
                    message.push(`${country.name} is now the winner!`);
                    localStorage.setItem("winner", country.name);
                    result_winner = ["winner", country.name];
                  }
                }
              } else {
                // Carbon exceeded
                message.push(
                  `${country.name} exceeded carbon limit and loses the game.`
                );
                loser.push(country.name);
                localStorage.setItem("losers", JSON.stringify(loser));
              }
            } else {
              // No clue found
              const ICAO = await getGameCountryICAO(targetCountry.iso_country);
              ICAO_result = ICAO;

              const country_location = await getAirportLocation(country.ICAO);
              const target_location = await getAirportLocation(ICAO);

              const carbon_emission = await getCarbonEmission(
                country_location,
                target_location
              );
              carbon_result = country.carbon + carbon_emission;

              if (carbon_result <= carbon_limit) {
                message.push(
                  `${country.name} went to ${targetCountry.name} with ${carbon_emission}, total carbon emission is now ${carbon_result}`
                );
              } else {
                message.push(
                  `${country.name} exceeded carbon limit and loses the game.`
                );
                loser.push(country.name);
                localStorage.setItem("losers", JSON.stringify(loser));
              }
            }

            // Push results to result_construct
            result_construct.push({
              data: {
                player_country_id: country.player_country_id,
                invention: invention_result,
                iso_country: country.iso_country,
                ICAO: ICAO_result,
                name: country.name,
                clue: clue_result,
                carbon: carbon_result,
              },
              message: message,
            });
          } catch (error) {
            console.error("Error processing country:", error);
          }
        }
      });

    // Wait for all promises to resolve
    await Promise.all(promises);
  };

  await CountryOperation();
  if (localStorage.getItem("winner")) {
    console.log("winner should trigger");
    return result_winner as ["winner", string];
  } else {
    return result_construct;
  }
};

export default competitors;
