# to get the airport latitude and longitude in the destination country
# ap represent airport

def get_airport_coordinate_game_country(connection,choose_destination):
    cursor = connection.cursor()
    sql = ("SElECT latitude_deg,longitude_deg FROM airport "
           "JOIN game_country ON airport.ident = game_country.target_airport_ident "
           "WHERE game_country.country_id = %s")
    cursor.execute(sql, (choose_destination,))
    result = cursor.fetchone()
    # print(result)
    return result