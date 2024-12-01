
def destination_options(connection):
    cursor = connection.cursor()
    sql = ('SELECT game_country.country_id,game_country.clue_id, country.name FROM game_country '
           'JOIN country ON game_country.iso_country = country.iso_country')
    cursor.execute(sql)
    result = cursor.fetchall()
    # if len(result) == 20:
    #     # gc represent the 20 destination choice.
    #     for gc in result:
    #         print(f"{gc[0]}：{gc[2]}")
    cursor.close()
    return result