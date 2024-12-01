# to get the airport latitude and longitude in player's initial country
# ap represent airport

def get_ap_co_5(connection,player_country_id) -> tuple:
    cursor = connection.cursor()
    sql = ("SElECT latitude_deg,longitude_deg FROM airport "
           "JOIN player_country ON airport.ident = player_country.start_airport_ident "
           "WHERE player_country.player_country_id = %s")
    cursor.execute(sql, (player_country_id,))
    result = cursor.fetchone()
    # print(result)
    return result
