from typing import Literal

from mysql.connector import CMySQLConnection


def get_initial_capa_value(connection: CMySQLConnection, player: str, type: Literal["player", "country"]):
    cursor = connection.cursor()
    if type == "player":
        sql = ('SELECT player.player_id, player_country.initial_capa_value FROM player '
               'JOIN player_country ON player_country.player_country_id = player.player_country_id '
               'WHERE player.player = %s')
        cursor.execute(sql, (player,))
        result = cursor.fetchall()
        return result
    else:
        sql = ('SELECT country.name, player_country.initial_capa_value FROM player_country JOIN country ON country.iso_country = player_country.iso_country WHERE country.name = %s')
        cursor.execute(sql, (player,))
        result = cursor.fetchall()
        return result