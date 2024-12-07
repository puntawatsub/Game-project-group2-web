from mysql.connector import CMySQLConnection

def return_ident_game_country(connection: CMySQLConnection, iso_country: str) -> str:
    
    # define cursor
    cursor = connection.cursor()

    # make a query
    sql = "SELECT target_airport_ident as ICAO FROM game_country WHERE iso_country = %s"
    params = (iso_country, )
    cursor.execute(sql, params)
    result = cursor.fetchall()

    return {
        "ICAO": result[0][0]
    }



