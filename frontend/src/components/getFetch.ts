import Country from "@/types/Country";
import backendURL from "./backendURL";
import PlayerCountry from "@/types/PlayerCountry";

export const getPlayerCountryICAO = async (
  iso_country: string
): Promise<string> => {
  let formData = new FormData();
  formData.append("iso_country", iso_country);
  try {
    const fetch_result = await fetch(`${backendURL}/get_ident_player_country`, {
      method: "POST",
      body: formData,
    });
    const json_result = await fetch_result.json();
    return json_result["ICAO"];
  } catch (error) {
    throw error;
  }
};

export const getGameCountryICAO = async (
  iso_country: string
): Promise<string> => {
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

export const getAirportLocation = async (icao: string): Promise<number[]> => {
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

export const getCarbonEmission = async (
  location1: number[],
  location2: number[]
): Promise<number> => {
  let temp_data = new FormData();
  temp_data.append("latitude1", location1[0].toString());
  temp_data.append("longitude1", location1[1].toString());
  temp_data.append("latitude2", location2[0].toString());
  temp_data.append("longitude2", location2[1].toString());
  try {
    const resolve = await fetch(`${backendURL}/calculate_carbon`, {
      method: "POST",
      body: temp_data,
    });
    const result = await resolve.json();
    return parseFloat(result["emission"]);
  } catch (error: any) {
    throw error;
  }
};

export const getNewPlayerCountry = async (): Promise<PlayerCountry[]> => {
  try {
    const resolve = await fetch(`${backendURL}/player_country`);
    const result: PlayerCountry[] = await resolve.json();
    return result;
  } catch (error: any) {
    throw Error("Cannot fetch player country data");
  }
};

export const getGameCountry = () => {
  fetch(`${backendURL}/random_clue`)
    .then(async (value) => {
      const results: Country[] = await value.json();
      sessionStorage.setItem("gameCountries", JSON.stringify(results));
    })
    .catch((error: Error) => {
      throw error;
    });
};

export const getClueFromId = async (clue_id: number): Promise<Clue> => {
  interface ClueFetchResult {
    clue_id: number;
    clue_point: number;
    clue_type: "Key Person" | "General Informants" | "Passer-by";
  }
  try {
    const formBody: FormData = new FormData();
    formBody.append("id", clue_id.toString());

    const resolve = await fetch(`${backendURL}/get_clue_from_id`, {
      method: "POST",
      body: formBody,
    });
    const result: ClueFetchResult = await resolve.json();
    const return_construct: Clue = {
      type: result.clue_type,
      points: result.clue_point,
    };
    return return_construct;
  } catch (error) {
    throw error;
  }
};

export const getInventors = async (): Promise<Inventor[]> => {
  try {
    const resolve = await fetch(`${backendURL}/get_inventor`);
    const result: Inventor[] = await resolve.json();
    return result;
  } catch (error) {
    throw error;
  }
};
