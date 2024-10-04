# Player should start with choose their initial country after input their name.

def choose_player_country(connection):
    cursor = connection.cursor()
    sql = ('SELECT player_country.player_country_id,player_country.initial_capa_value, country.name '
           'FROM player_country '
           'JOIN country ON player_country.iso_country = country.iso_country')
    cursor.execute(sql)
    result = cursor.fetchall()
    if len(result) == 5:
        # player_country1 = cp1, player_country2 = cp2 ....
        # cp1, cp2, cp3, cp4, cp5 = result[:5]
        for cp in result:
            print(f"{cp[0]}:{cp[2]}, with the initial capability value {cp[1]}");
    return result
