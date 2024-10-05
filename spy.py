import random

import mysql.connector
from functions.story_telling import story_telling
from functions.calculate_carbon_emission import calculate_carbon_emission
from functions.choose_country import choose_player_country
from functions.add_player import add_player
from functions.competitors import competitors
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
carbon_emission = dict()
competitors_location = dict()
competitors_clue_point = dict()

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

    #show the story behind the game
    story_telling()

    # prompt for player name
    player_name = input("Enter player name: ")
    print("-" * 60)
    # prompt player to choose a country
    print("Choose your country from the list below, different ability values mean that you will face different difficulty challenges")
    player_country_options = choose_player_country(connection)
    player_country_id = int(input('Enter number to choose your country (1-5): '))
    print("=" * 60)

    # get player's home country coordinate
    initial_ap_co = get_ap_co_5(connection, player_country_id)

    # set the initial carbon_limit (for now every player is the same)
    carbon_limit = 10000

    # target clue point
    clue_target = 20

    # invention point target
    invention_target = 200

    # Add player to database
    add_player(connection,player_name,player_country_id,carbon_limit)
    print(f"You have {carbon_limit} points carbon emission to use, if you run out it, you loss your chance!")
    print("=" * 60)
    print(f"Situation of the competitors below:")

    # Add in-game countries into dictionaries {country_name: value}, {country_name: carbon_emission}
    destinations = destination_options(connection)

    for player_country_option in player_country_options:
        # print(player_country_option[2])
        initial_capacity = get_initial_capa_value(connection, player_country_option[2], "country")
        if len(initial_capacity) > 0:
            invention_point[f"{player_country_option[2]}"] = initial_capacity[0][1]
            carbon_emission[f"{player_country_option[2]}"] = 0.0
            competitors_clue_point[f"{player_country_option[2]}"] = 0
            competitors_location[f"{player_country_option[2]}"] = get_ap_co_5(connection, player_country_option[0])
    # print(invention_point)

    # get all possible destinations
    # choose_destination = player_country_id
    #
    # # Find target airport coordinate of the selected country
    # destination_airport_coordinate = get_airport_coordinate_game_country(connection,choose_destination)


    # set initial airport coordinate as current airport coordinate
    destination_airport_coordinate = initial_ap_co


    # add current airport coordinate as current player coordinate
    # current_coordinate.append(destination_airport_coordinate)

    # Initialize total_clue_point variable
    total_clue_point = 0

    # player country name
    player_country_name = list(invention_point.keys())[player_country_id - 1]

    while True:

        should_break = False

        # if anyone has score of greater or equal to 200, that person wins.
        for key in invention_point.keys():
            # print(f"{key}: {invention_point[key]}")
            if invention_point[key] >= invention_target:
                print(f"\033[32m{key} won!\033[0m")
                should_break = True
                exit(0)
        if should_break:
            break

        for key in carbon_emission.keys():
            if carbon_emission[key] >= carbon_limit:
                print(f"\033[31m{key} exceeded carbon emission limit!\033[0m")
                if key == player_country_name:
                    print(f"\033[31mYou lost!\033[0m")
                    should_break = True
                    exit(0)
                else:
                    invention_point.pop(key, None)
        if should_break:
            break

        # Loop asking user for the next destination until clue point is >= 20
        while total_clue_point < clue_target:
            should_break = False

            # if anyone has score of greater or equal to 200, that person wins.
            for key in invention_point.keys():
                print(f"{key}: {invention_point[key]}")
                if invention_point[key] >= invention_target:
                    print(f"\033[31m{key} won!\033[0m")
                    should_break = True
                    exit(0)
            if should_break:
                break

            for key in carbon_emission.keys():
                if carbon_emission[key] >= carbon_limit:
                    print(f"\033[31m{key} exceeded carbon emission limit!\033[0m")
                    if key == player_country_name:
                        print(f"\033[31mYou lost!\033[0m")
                        should_break = True
                        exit(0)
                    else:
                        invention_point.pop(key, None)
            if should_break:
                break

            # Randomize clues locations
            randomize_clue(connection)

            # prompt user for the next destination
            print("-" * 60)
            print("Choose your next destination.")

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

                # Print distance
                print(f"Flight Distance: {game_country_distance:.2f}")

                # Calculate the carbon emission using the distance
                carbon_emission_flight = calculate_carbon_emission(game_country_distance)
                # Print the carbon emission
                print(f"Flight Carbon Emission: {carbon_emission_flight:.2f}")
                # Save carbon emission to the dictionary
                carbon_emission[f"{player_country_name}"] += carbon_emission_flight
                # Print current carbon emission of the player's country
                print(f"Total Emission: {carbon_emission[str(player_country_name)]:.2f}")
                # Print carbon emission left
                carbon_left = carbon_limit - carbon_emission[str(player_country_name)]
                print(f"\033[33mYou have {carbon_left:.2f} carbon emission left.\033[0m")
                print("-" * 60)

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
                    print("-" * 60)
                else:
                    # If clue does not exist, tell user they've not met anyone.
                    print("You've met no one.")

                    # print current player's clue point

                    print(f"Current clue point: {total_clue_point}")
                    print("-" * 60)
                    # prompt user to enter to continue
                    input("Press enter to continue...")
            else:
                # If player doesn't move, warn player. With penalty.
                print("Taxiing around the same airport cost your carbon credit and a fine!: +1400 Carbon Emission")
                input("Press enter to continue...")

            # run competitors turn
            competitors(clue_target, player_country_name, invention_point, carbon_emission, competitors_location, competitors_clue_point, connection)
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
        print(f"\033[31mYou find a {inventor_position[0]} inventor team with {inventor_position[1]} capability value. Go! They are in {inventor_position[3]}.\033[0m")
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

        if game_country_distance > 0:
            # Calculate the carbon emission using the distance
            carbon_emission_flight = calculate_carbon_emission(game_country_distance)
            # Print the carbon emission
            print(f"Flight Carbon Emission: {carbon_emission_flight:.2f}")
            # Save carbon emission to the dictionary
            carbon_emission[f"{player_country_name}"] += carbon_emission_flight
            # Print current carbon emission of the player's country
            print(f"Total Emission: {carbon_emission[str(player_country_name)]}")
            # Print carbon emission left
            carbon_left = carbon_limit - carbon_emission[str(player_country_name)]
            print(f"you have {carbon_left:.2f} carbon emission left.")

            # Change current airport coordinate to the new selected airport
            destination_airport_coordinate = new_des_airport_coordinate
        else:
            print("Taxiing around the same airport cost your carbon credit and a fine!: +1400 Carbon Emission")
            carbon_emission_flight = 1400
            carbon_emission[f"{player_country_name}"] += carbon_emission_flight
            print(f"Total Emission: {carbon_emission[str(player_country_name)]}")



        if inventor_location == choose_destination:
            inventor_choice = random.choices([False, True], weights=(4, 6))
            if inventor_choice[0]:
                print(f"\033[36mCongratulations! You've found inventor which chose to cooperate with your work! You've got {inventor_value} points!\033[0m")
                invention_point[player_country_name] += int(inventor_value)
                print(f"Current invention point: {invention_point[player_country_name]}")
                input("Press enter to continue...")
            else:
                print("\033[33mInventor chose not to cooperate with your work!\033[0m")
                input("Press enter to continue...")
        else:
            print("\033[33mYou've missed your chances, inventor had changed their location.\033[0m")
            input("Press enter to continue...")

        inventor_location = None
