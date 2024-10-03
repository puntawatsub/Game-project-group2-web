from mysql.connector.connection_cext import CMySQLConnection

def get_clue(connection: CMySQLConnection, choose_destination: int) -> tuple:
    cursor = connection.cursor()
    sql = ("SELECT clue.clue_id, clue.clue_point, clue.clue_type FROM clue "
           "JOIN game_country ON game_country.clue_id = clue.clue_id "
           "WHERE game_country.country_id = %s")
    cursor.execute(sql,(choose_destination,))
    result = cursor.fetchone()
    return result