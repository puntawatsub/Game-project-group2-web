from mysql.connector.connection_cext import CMySQLConnection

def return_player_country(connection: CMySQLConnection) -> dict:

    # Get player_country from database
    cursor = connection.cursor()
    cursor.execute('SELECT player_country.player_country_id, player_country.iso_country, player_country.initial_capa_value, player_country.start_airport_ident, country.name FROM player_country, country WHERE country.iso_country = player_country.iso_country')
    player_country_result = cursor.fetchall()

    # define list dictionary
    player_countries = []

    # iterate
    for player_country in player_country_result:
        temp_dict = {
            "player_country_id": player_country[0],
            "iso_country": player_country[1],
            "initial_capa_value": player_country[2],
            "start_airport_ident": player_country[3],
            "name": player_country[4]
        }
        player_countries.append(temp_dict)

    return player_countries
