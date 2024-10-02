import mysql.connector
from functions.choose_country import choose_player_country
from functions.add_player import add_player
from functions.destination_options import destination_options
from functions.get_ap_co_5 import get_ap_co_5
from functions.get_ap_co_20 import get_ap_co_20
from functions.get_distance_1st import get_distance_1st
from functions.get_distance_loop import get_distance_loop
from functions.get_clue import get_clue

def db_connection():
    connection_1 = mysql.connector.connect(
    host="localhost",
    user="spy",
    password="spy",
    database="spy")
    return connection_1

if __name__ == "__main__":
    connection = db_connection()
    player_name = input("Enter player name: ")

    player_country_options = choose_player_country(connection)
    player_country_id = int(input('Enter number to choose your country (1-5)'))

    # to get player's initial coordinate after they choose their home country
    initial_ap_co = get_ap_co_5(connection, player_country_id)

    # set the initial carbon_limit (for now every player is the same)
    carbon_limit = 500
    add_player(connection,player_name,player_country_id,carbon_limit)

    destinations = destination_options(connection)
    #ask user to type 1-20 to choose the next destination
    #through country info to find the target airport in that country and get the lng and lat
    choose_destination = int(input('Enter number to choose your next destination'))
    des_ap_co = get_ap_co_20(connection,choose_destination)

    # firstly get the distance from the initial country to the destination country
    dis_ini = get_distance_1st(initial_ap_co,des_ap_co)

    total_clue_point = 0
    while total_clue_point < 20:
        destinations = destination_options(connection)
        choose_destination = int(input('Enter number to choose your next destination'))
        new_des_ap_co = get_ap_co_20(connection,choose_destination)
        game_ct_dis = get_distance_loop(des_ap_co,new_des_ap_co)

        #check if the airport has clue
        check_clue = get_clue(connection,choose_destination)
        if check_clue:
## "you have found xx point"

## after 20 point end loop, trigger inventor information.

## add inventor value to initial_capa_value to player_country.

## Loop: initial_capa_value > 200

## update carbon_emission
