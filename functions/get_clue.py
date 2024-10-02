def get_clue(connection,choose_destination):
    cursor = connection.cursor()
    sql = ("SELECT clue.clue_id, clue.points FROM clue "
           "JOIN airport ON airport.ident = clue.airport_ident "
           "WHERE airport.ident = %s")
    cursor.execute(sql,(choose_destination,))
    result = cursor.fetchone()
    return result