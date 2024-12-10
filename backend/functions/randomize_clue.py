from functions.shuffle_array import shuffle_array
from mysql.connector.connection_cext import CMySQLConnection

# from spy import db_connection

# clues: tuple, connection: CMySQLConnection (This used to be the function arguments but no more, kept just for reference
def randomize_clue(connection: CMySQLConnection) -> bool:

    # Get all possible clues
    cursor = connection.cursor()
    cursor.execute("SELECT clue_id FROM clue")
    clue_result = cursor.fetchall()

    # Define clues list
    clues = []

    # Put them into a list (id only)
    for clue in clue_result:
        clues.append(clue[0])

    # Shuffle the array of clues
    shuffled_clues = shuffle_array(clues)

    # Get number of countries
    cursor.execute("SELECT country_id, clue_id FROM game_country")
    country_result = cursor.fetchall()
    country_count = len(country_result)

    # Shuffle country's index
    country_index_shuffle = shuffle_array(list(range(country_count)))

    # Assigned shuffled clues to shuffled countries
    for i in range(len(shuffled_clues)):
        cursor.execute("UPDATE game_country SET clue_id = %s WHERE country_id = %s", (shuffled_clues[i], country_index_shuffle[i] + 1))
        connection.commit()

    # Assigned None to countries out of range
    for i in range(len(shuffled_clues), country_count):
        cursor.execute("UPDATE game_country SET clue_id = %s WHERE country_id = %s", (None, country_index_shuffle[i] + 1))
        connection.commit()

    return True