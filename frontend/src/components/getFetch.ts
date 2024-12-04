import backendURL from "./backendURL";

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

export const fetchCarbonEmission = async (
  location1: number[],
  location2: number[]
): Promise<number> => {
  let temp_data = new FormData();
  temp_data.append("latitude1", location1[0].toString());
  temp_data.append("longitude1", location1[1].toString());
  temp_data.append("latitude2", location2[0].toString());
  temp_data.append("longtitude2", location2[1].toString());
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
