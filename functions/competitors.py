import random

from mysql.connector import CMySQLConnection

from functions.calculate_carbon_emission import calculate_carbon_emission
from functions.destination_options import destination_options
from functions.generate_inventor_position import generate_inventor_position
from functions.get_ap_co_20 import get_airport_coordinate_game_country
from functions.get_clue import get_clue
from functions.get_distance import get_distance
from functions.get_inventor import get_inventor
from functions.show_inventor_info import show_inventor_info

# Invention point dictionary key will determine the list of countries
def competitors(clue_target: int, player_country_name: str, invention_point: dict, carbon_emission: dict, competitors_location: dict, competitors_clue_point: dict, connection: CMySQLConnection) -> bool:
    print("")
    countries = list(invention_point.keys())
    countries.remove(player_country_name)
    competitors_location.pop(f"{player_country_name}", None)
    competitors_clue_point.pop(f"{player_country_name}", None)

    for country in countries:
        # Let each individual competing countries do the following


        # Get destination options info
        destinations = destination_options(connection)

        # Choose a random destination country
        choose_destination = random.randint(1, 20)
        selected_country_name = destinations[choose_destination - 1][2]
        print(f"{country} spy went to {selected_country_name}.")

        # Get the destination coordinate
        new_des_airport_coordinate = get_airport_coordinate_game_country(connection, choose_destination)

        # Get the current location to destination distance
        # print(f"{competitors_location[str(country)]}")
        destination_distance = get_distance(competitors_location[f"{country}"], new_des_airport_coordinate)
        if destination_distance == 0:
            print(f"{country} taxied around in the same runway and emitted +1400 carbon")
            turn_carbon_emission = 1400
        else:
            # Get this turn's carbon emission
            turn_carbon_emission = calculate_carbon_emission(destination_distance)

        # Change the current coordinate to the new selected country
        competitors_location[f"{country}"] = new_des_airport_coordinate

        # Modify current carbon emission of the competitor's country
        carbon_emission[f"{country}"] += turn_carbon_emission

        clue = get_clue(connection, choose_destination)

        if clue:
            # If clue exist, print clue type and points associated to it
            print(f"{country} met {clue[2]} with {clue[1]} clue points!")
            competitors_clue_point[f"{country}"] += clue[1]

            # print current competitor's clue point
            print(f"Current clue point for {country}: {competitors_clue_point[str(country)]}")
        else:
            # Print the competitor had met no one
            print(f"{country} have met no one.")
            print(f"Current clue point for {country}: {competitors_clue_point[str(country)]}")
        if competitors_clue_point[str(country)] >= clue_target:
            inventor_id = get_inventor(connection)[0]
            # print(find_inventor)
            # generate a position information (at game_country)

            # generate new inventor position
            generate_inventor_position(connection, inventor_id)
            inventor_position = show_inventor_info(connection, inventor_id)
            inventor_location, inventor_value = inventor_position[4], inventor_position[1]

            # Get this turn's carbon emission
            turn_carbon_emission = 0
            inventor_airport_coordinate = get_airport_coordinate_game_country(connection, inventor_location)
            turn_distance = get_distance(competitors_location[f"{country}"], inventor_airport_coordinate)
            if turn_distance == 0:
                print(f"{country} taxied around in the same runway and emitted +1400 carbon")
                turn_carbon_emission = 1400
            else:
                turn_carbon_emission = calculate_carbon_emission(turn_distance)

            # Change current coordinate to inventor's location
            competitors_location[f"{country}"] = inventor_airport_coordinate

            # Add carbon emission to country
            carbon_emission[f"{country}"] += turn_carbon_emission


            inventor_choice = random.choices([False, True], weights=(4, 10))

            if inventor_choice[0]:
                print(f"\033[31m{country} have found inventor which chose to cooperate with their work! {country} got {inventor_value} points!\033[0m")
                invention_point[country] += int(inventor_value)
                print(f"\033[31mCurrent invention point for {country}: {invention_point[country]}\033[0m")
            else:
                print(f"Inventor chose not to cooperate with {country}!")
            competitors_clue_point[f"{country}"] = 0
        print(f"{country} emitted {carbon_emission[str(country)]:.2f} carbon")
        print("")

    return True
