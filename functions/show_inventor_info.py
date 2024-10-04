#after generate a position and update to database,get the position

def show_inventor_info(connection,inventor_id):
    cursor = connection.cursor()
    sql = ('SELECT inventor.inventor_level, inventor.contribution, inventor.position, country.name, game_country.country_id '
           'FROM inventor '
           'JOIN game_country ON inventor.position = game_country.target_airport_ident '
           'JOIN country ON game_country.iso_country = country.iso_country '
           'WHERE inventor.inventor_id = %s;')
    cursor.execute(sql, (inventor_id,))
    result = cursor.fetchone()
    cursor.close()
    return result