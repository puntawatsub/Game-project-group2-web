import random

import mysql.connector
from functions.choose_country import choose_player_country
from functions.add_player import add_player
from functions.destination_options import destination_options
from functions.get_ap_co_5 import get_ap_co_5
from functions.get_ap_co_20 import get_airport_coordinate_game_country
from functions.get_distance import get_distance
from functions.get_clue import get_clue
import os
from dotenv import load_dotenv
from mysql.connector.connection_cext import CMySQLConnection

from functions.randomize_clue import randomize_clue
from functions.get_inventor import get_inventor
from functions.generate_inventor_position import generate_inventor_position
from functions.show_inventor_info import show_inventor_info
from functions.get_initial_capa_value import get_initial_capa_value

load_dotenv()

invention_point = dict()

# function to establish new db connection
def db_connection() -> CMySQLConnection:
    connection = mysql.connector.connect(
        host=f"{os.getenv('DB_HOST')}",
        user=f"{os.getenv('DB_USER')}",
        password=f"{os.getenv('DB_PASSWORD')}",
        database=f"{os.getenv('DB_NAME')}"
    )
    # print(type(connection_1))
    return connection

if __name__ == "__main__":

    # Initialize variable(s)
    current_coordinate = []

    # Established DB Connection
    connection = db_connection()

    # prompt for player name
    player_name = input("Enter player name: ")

    # prompt player to choose a country
    player_country_options = choose_player_country(connection)
    player_country_id = int(input('Enter number to choose your country (1-5): '))

    # get player's home country coordinate
    initial_ap_co = get_ap_co_5(connection, player_country_id)

    # set the initial carbon_limit (for now every player is the same)
    carbon_limit = 7000

    # Add player to database
    add_player(connection,player_name,player_country_id,carbon_limit)

    # Add in-game countries into dictionary {country_name: capacity}
    destinations = destination_options(connection)
    for player_country_option in player_country_options:
        # print(player_country_option[2])
        initial_capacity = get_initial_capa_value(connection, player_country_option[2], "country")
        if len(initial_capacity) > 0:
            invention_point[f"{player_country_option[2]}"] = initial_capacity[0][1]

    # print(invention_point)

    # get all possible destinations
    # choose_destination = player_country_id
    #
    # # Find target airport coordinate of the selected country
    # destination_airport_coordinate = get_airport_coordinate_game_country(connection,choose_destination)


    # set initial airport coordinate as current airport coordinate
    destination_airport_coordinate = initial_ap_co



    #
    # # add current airport coordinate as current player coordinate
    # current_coordinate.append(destination_airport_coordinate)
    #
    # # firstly get the distance from the initial country to the destination country
    # dis_ini = get_distance(initial_ap_co,destination_airport_coordinate)

    # Initialize total_clue_point variable
    total_clue_point = 0

    # player country name
    player_country_name = list(invention_point.keys())[player_country_id - 1]


    while True:

        should_break = False

        # if anyone has score of greater or equal to 200, that person wins.
        for key in invention_point.keys():
            if invention_point[key] >= 200:
                print(f"{key} won!")
                should_break = True
                break
        if should_break:
            break

        # Loop asking user for the next destination until clue point is >= 20
        while total_clue_point < 20:

            # Randomize clues locations
            randomize_clue(connection)

            # prompt user for the next destination
            destinations = destination_options(connection)

            # Prompt user for the next destinations
            if len(destinations) >= 1:
                for game_country in destinations:
                    print(f"{game_country[0]}：{game_country[2]}")
            choose_destination = int(input('Enter number to choose your next destination: '))

            # Get destination airport coordinates
            new_des_airport_coordinate = get_airport_coordinate_game_country(connection,choose_destination)

            # Get distance from current airport to the new destination airport
            game_country_distance = get_distance(destination_airport_coordinate,new_des_airport_coordinate)

            # Check if player moved
            if game_country_distance > 0:
                print(f"Distance: {game_country_distance}")

                # Change current airport coordinate to the new selected airport
                destination_airport_coordinate = new_des_airport_coordinate


                # current_coordinate.append(new_des_airport_coordinate)


                # Get clue from that airport
                clue = get_clue(connection, choose_destination)


                # Check if the clue exist in the selected country
                if clue:
                    # If clue exist, print clue type and points associated to it
                    print(f"You've met {clue[2]} with {clue[1]} clue points!")
                    total_clue_point += clue[1]

                    # print current player's clue point
                    print(f"Current clue point: {total_clue_point}")

                    # prompt user to enter to continue
                    input("Press enter to continue...")
                else:
                    # If clue does not exist, tell user they've not met anyone.
                    print("You've met no one.")

                    # print current player's clue point
                    print(f"Current clue point: {total_clue_point}")

                    # prompt user to enter to continue
                    input("Press enter to continue...")
            else:
                # If player doesn't move, warn player. With penalty.
                print("You cannot select the same location. Taxiing around the same airport cost your carbon credit and a fine!: +140 Carbon Emission")
                input("Press enter to continue...")
    # end loop

        # after 20 points of clue, get one inventor randomly from inventor table.
        inventor_id = get_inventor(connection)[0]
        # print(find_inventor)
        # generate a position information (at game_country)

        # generate new inventor position
        generate_inventor_position(connection,inventor_id)
        inventor_position = show_inventor_info(connection,inventor_id)

        # Tell user to find the inventor in the provided location
        print(f"You find a {inventor_position[0]} inventor team with {inventor_position[1]} capability value. Go! They are in {inventor_position[3]}.")
        input("Press enter to continue...")

        inventor_location, inventor_value = inventor_position[4], inventor_position[1]

        # Prompt user for the next destination
        total_clue_point = 0
        if len(destinations) >= 1:
            for game_country in destinations:
                print(f"{game_country[0]}：{game_country[2]}")
        choose_destination = int(input('Enter number to choose your next destination: '))

        # Get destination airport coordinates
        new_des_airport_coordinate = get_airport_coordinate_game_country(connection, choose_destination)

        # Get distance from current airport to the new destination airport
        game_country_distance = get_distance(destination_airport_coordinate, new_des_airport_coordinate)
        print(f"Distance: {game_country_distance}")

        if inventor_location == choose_destination:
            inventor_choice = random.choices([False, True], weights=(6, 4))
            if inventor_choice[0]:
                print(f"Congratulations! You've found inventor which chose to cooperate with your work! You've got {inventor_value} points!")
                invention_point[player_country_name] += int(inventor_value)
                print(f"Current invention point: {invention_point[player_country_name]}")
                input("Press enter to continue...")
            else:
                print("Inventor chose not to cooperate with your work!")
                input("Press enter to continue...")
        else:
            print("You've missed your chances, inventor had changed their location.")
            input("Press enter to continue...")

        inventor_location = None
































    # Obsolete
    # initial_capability_value: int = get_initial_capa_value(connection, player_name)[0][1]
    # # print(type(initial_capability_value))
    # # number = int(initial_capability_value)
    # capability_value_goal: int = 200
    # capability_value_found: int = int(show_inventor_info(connection,inventor_id)[1])
    # # print(type(capability_value_goal))
    # # print(type(capability_value_found))
    # capability_value_left: int = initial_capability_value + capability_value_found - capability_value_goal
    # while True:
    #     if initial_capability_value + capability_value_found - capability_value_goal >= 0:
    #         print(f'win')
    #     else:
    #         print(f'continue')

## add inventor value to initial_capa_value to player_country.

## Loop: initial_capa_value > 200

## update carbon_emission
