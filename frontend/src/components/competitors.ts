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

const competitors = (
  clue_target: number,
  carbon_limit: number,
  invention_target: number
): CompetitorResponse[] | ["winner", string] => {
  if (!localStorage.getItem("countriesLocation")) {
    if (localStorage.getItem("playerCountry")) {
      let countriesLocation: CountryLocation[] = [];
      const playerCountry: PlayerCountry[] = JSON.parse(
        localStorage.getItem("playerCountry")!
      );
      playerCountry.forEach((country) => {
        getAirportLocation(country.ICAO)
          .then((location) => {
            countriesLocation.push({
              iso_country: country.iso_country,
              location: location,
            });
          })
          .catch((error: Error) => {
            console.error(error.message);
          });
      });
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
    "currenPlayerCountry"
  )!;
  const gameCountries: Country[] = JSON.parse(
    localStorage.getItem("gameCountries")!
  );

  let result_construct: CompetitorResponse[] = [];

  playerCountries.forEach((country) => {
    if (country.iso_country !== currentPlayerCountry_iso) {
      // declare all vars that will be modified

      // MARK: Calculated: Carbon result
      let carbon_result = 0;
      // MARK:
      let ICAO_result = "";
      let invention_result = 0;
      let clue_result = 0;
      let message: string[] = [];
      // competitor mechanism here
      // let competitor choose one random country
      let targetCountry =
        gameCountries[Math.floor(Math.random() * gameCountries.length)];

      // get clue
      if (targetCountry.clue_id !== null) {
        getClueFromId(targetCountry.clue_id)
          .then((clue) => {
            getGameCountryICAO(targetCountry.iso_country)
              .then(async (ICAO) => {
                try {
                  const country_location = await getAirportLocation(
                    country.ICAO
                  );
                  const target_location = await getAirportLocation(ICAO);
                  const carbon_emission =
                    ICAO !== country.ICAO
                      ? await getCarbonEmission(
                          country_location,
                          target_location
                        )
                      : 1400;
                  carbon_result = country.carbon + carbon_emission;
                  if (ICAO !== country.ICAO) {
                    message.push(
                      `${country.name} went to ${targetCountry.name} with ${carbon_emission} carbon emission, total carbon emission is now ${carbon_result}`
                    );
                  } else {
                    message.push(
                      `${country.name} taxied around in the same airport and released ${carbon_emission} carbon emission, total carbon emission is now ${carbon_result}`
                    );
                  }

                  if (carbon_result <= carbon_limit) {
                    // carbon within limits
                    clue_result = clue.points + country.clue;
                    if (clue_result >= clue_target) {
                      // clue target passed
                      message.push(
                        `${country.name} has reached the clue target.`
                      );
                      targetCountry =
                        gameCountries[
                          Math.floor(Math.random() * gameCountries.length)
                        ];
                      getGameCountryICAO(targetCountry.iso_country).then(
                        async (ICAO_inventor) => {
                          const country_location_inventor = target_location;
                          const target_location_inventor =
                            await getAirportLocation(ICAO);
                          const carbon_emission_inventor =
                            await getCarbonEmission(
                              country_location_inventor,
                              target_location_inventor
                            );
                          const didCooperate = Math.random() < 0.5;

                          if (didCooperate) {
                            // inventors did coorperate
                            const inventors: Inventor[] = await getInventors();
                            const random_inventor: Inventor =
                              inventors[
                                Math.floor(Math.random() * gameCountries.length)
                              ];
                            invention_result =
                              country.invention + random_inventor.contribution;
                            message.push(
                              `${country.name} has met ${random_inventor.name} with ${random_inventor.contribution} invention points`
                            );
                            if (invention_result >= invention_target) {
                              // we have a winner
                              winner.push(country.name);
                              message.push(
                                `${country.name} is now the winner!`
                              );
                              return ["winner", country.name];
                            }
                          } else {
                            // inventors did not coorperate
                            message.push(
                              `${country.name} has met an inventor, but they chose not to cooperate.`
                            );
                          }
                          ICAO_result = ICAO_inventor;
                          carbon_result += carbon_emission_inventor;
                        }
                      );
                    } else {
                      // clue not reached (already calculated carbon)
                      ICAO_result = ICAO;
                      invention_result = country.invention;
                    }
                  } else {
                    // carbon exceeds (already calculated carbon)
                    ICAO_result = ICAO;
                    invention_result = country.invention;
                    clue_result = country.clue;
                    // add to losers
                    loser.push(country.name);
                    message.push(
                      `${country.name} exceeded carbon limit and loses the game.`
                    );
                  }
                } catch (error) {
                  throw error;
                }
              })
              .catch((error) => {
                throw error;
              });
          })
          .catch((error) => {
            throw error;
          });
      } else {
        // did not find a clue
        getGameCountryICAO(targetCountry.iso_country).then(async (icao) => {
          ICAO_result = icao;
          invention_result = country.invention;
          const target_location = await getAirportLocation(icao);
          const country_location = await getAirportLocation(
            country.iso_country
          );
          const this_emission = await getCarbonEmission(
            country_location,
            target_location
          );
          carbon_result = country.carbon + this_emission;
          if (carbon_result <= carbon_limit) {
            // carbon within limit
            message.push(
              `${country.name} went to ${targetCountry.name} with ${this_emission} and found nothing.`
            );
          } else {
            message.push(
              `${country.name} exceeded carbon limit and loses the game.`
            );
            loser.push(country.name);
          }
        });
      }
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
    }
  });
  return result_construct;
};

export default competitors;
