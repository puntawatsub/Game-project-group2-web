def get_initial_capa_value(connection,player_name):
    cursor = connection.cursor()
    sql = ('SELECT player.player_id, player_country.initial_capa_value FROM player '
           'JOIN player_country ON player_country.player_country_id = player.player_country_id '
           'WHERE player.player_name = %s')
    cursor.execute(sql, (player_name,))
    result = cursor.fetchall()
    return result