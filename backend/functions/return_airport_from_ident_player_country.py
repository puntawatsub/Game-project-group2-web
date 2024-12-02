# SELECT start_airport_ident as ICAO FROM player_country WHERE iso_country = 'CN';
from mysql.connector import CMySQLConnection


def return_airport_from_ident_player_country(connection: CMySQLConnection, iso_country: str) -> dict:
    # define cursor
    cursor = connection.cursor()
    
    # define sql code
    sql = "SELECT start_airport_ident as ICAO FROM player_country WHERE iso_country = %s"
    payload = (iso_country, )
    
    # execute sql
    cursor.execute(sql, payload)
    result = cursor.fetchall()

    print(result)

    return {
        "ICAO": result[0][0]
        }