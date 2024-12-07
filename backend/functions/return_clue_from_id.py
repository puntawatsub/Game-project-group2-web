from mysql.connector.connection_cext import CMySQLConnection

def return_clue_from_id(connection: CMySQLConnection, clue_id: int) -> tuple:
    cursor = connection.cursor()
    sql = ("SELECT clue.clue_id, clue.clue_point, clue.clue_type FROM clue "
           "JOIN game_country ON game_country.clue_id = clue.clue_id "
           "WHERE clue.clue_id = %s")
    cursor.execute(sql,(clue_id,))
    result = cursor.fetchone()
    return {
        "clue_id": result[0],
        "clue_point": result[1],
        "clue_type": result[2]
    }