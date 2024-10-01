import mysql.connector
import random
from geopy import distance

connection = mysql.connector.connect(
    host="localhost",
    user="spy",
    password="spy",
    database="spy")

cursor = connection.cursor()

def choose_country():
    sql = ('SELECT player_country.player_country_id,player_country.initial_capa_value, country.name FROM player_country'
           'JOIN country ON player_country.iso_country = country.iso_country')
    cursor.execute(sql)
    result = cursor.fetchall()
    if len(result) == 5:
        # player_country1 = cp1, player_country2 = cp2 ....
        cp1 = result[0]
        cp2 = result[1]
        cp3 = result[2]
        cp4 = result[3]
        cp5 = result[4]
        for cp in [cp1, cp2, cp3, cp4,cp5]:
            print(f"{cp[0]}:{cp[2]}, with the initial capability value {cp[1]}");

def add_player(player_name,player_country):
    sql = ('UPDATE game_carbon SET player_id = 1, player_name = %s, player_country_id = %s')
    cursor.execute(sql,(player_name,player_country))
    connection.commit()

def choose_destination():
    sql = ('SELECT game_country.country_id,game_country.clue_id, country.name FROM game_country'
           'JOIN country ON game_country.iso_country = country.iso_country')
    cursor.execute(sql)
    result = cursor.fetchall()
    if len(result) == 20:
        # gc represent the 20 destination choice.
        for gc in result:
            print(f"{gc[0]}：{gc[1]}")
    return result

def get_country_coordinates(country_name):
    sql = ("Select latitude_deg,longitude_deg FROM airport "
           "JOIN game_country ON airport.iso_country = game_country.iso_country"
           "WHERE game_country.country_name = %s")
    cursor.execute(sql, (country_name,))
    result = cursor.fetchone()
    return result

def calculate_distance():
    sql = ("Select latitude_deg,longitude_deg FROM airport "
           "JOIN game_country ON airport.iso_country = game_country.iso_country"
           "WHERE name IN (%s,%s)")
    cursor.execute(sql)
    result = cursor.fetchall()
    if len(result) == 2:
        latitude1, longitude1 = result[0]
        latitude2, longitude2 = result[1]
        airport1 = (latitude1, longitude1)
        airport2 = (latitude2, longitude2)
        distance_airports = distance.distance(airport1, airport2).km
        return distance_airports

# LTO period cost 2.5 times fuel than cruise period, every flight will take 30 min approximately no matter the distance.
# Total cost = cruise_time * fuel_cost + LOT_time * 2.5 * fuel cost
# fuel cost per hour 2.4 tons
def emission_cost():
    avager_speed_aircraft = 800 # km/h
    lot_time = 0.5 #30min
    unit_fuel_cost = 2.4 #tons
    total_fuel_cost = ((distance_airports / avager_speed_aircraft - lot_time) * unit_fuel_cost +
                       lot_time * unit_fuel_cost * 2.5)
    emission_cost = total_fuel_cost * 10
    return emission_cost

def update_carbon_used(player_name,carbon_cost):
    sql = "SELECT carbon_limit from game_carbon WHERE player_name = %s"
    cursor.execute(sql,(player_name))
    result = cursor.fetchone()
    updated_limit = result[0] - emission_cost
    if updated_limit <= 0:
        print("You are run out of your limit, game over")
        return False

    sql = "UPDATE game_carbon SET carbon_limit = updated_limit WHERE player_name = %s"
    cursor.execute(sql,(update_limit,player_name))
    connection.commit()
    print(f"You have {update_limit:d} left")
    return True

def find_clue(iso_country):
    sql = "SELECT clue_id,clue_value from clue WHERE iso_conutry = %s"
    cursor.execute(sql, (iso_country))
    clue_found = 0
    clue_id = cursor.fetchone()
    if clue_id[0] != None:
        clue_found= clue_found + clue_id[1]
        print("You find one clue valued ")

def find_inventor():
    sql = "SELECT * FROM inventor ORDER BY RAND() LIMIT 1"
    cursor.execute(sql)
    inventor = cursor.fetchall()
    return inventor


player_name = input("Welcome to Spy! What is your name? : ")
print("You can choose which country you are belong to from below:\n")
choose_country()
player_country = int(input("Enter 1-5"))
add_player(player_name,player_country)

sql = "SELECT iso_country FROM player_country WHERE player_country_id = %s "
cursor.execute(sql)
player_country = cursor.fetchone()

total_clue_point = 0
while total_clue_point < 20:
    print(f"You can choose which country to go below:\n")
    destination = choose_destination()
    print(f"Enter 1-20 to choose a country")
    distination_country_id = int(input("Enter 1-20 to choose a country"))
