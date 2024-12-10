from mysql.connector import CMySQLConnection

def return_airport_location(connection: CMySQLConnection, ICAO: str):
    # define the cursor
    cursor = connection.cursor()

    # query sql
    sql = "SELECT ident, latitude_deg, longitude_deg FROM airport WHERE ident = %s"
    payload = (ICAO, )
    cursor.execute(sql, payload)
    result = cursor.fetchall()[0]

    return {
        "ident": result[0],
        "latitude_deg": result[1],
        "longitude_deg": result[2]
    }