# WORKING
# Add player to database

def add_player(connection,player_name,player_country_id,carbon_limit):
    cursor = connection.cursor()
    sql = ('INSERT INTO player (player_name, player_country_id,carbon_limit) VALUES (%s, %s, %s)')
    cursor.execute(sql,(player_name,player_country_id,carbon_limit))
    connection.commit()
    cursor.close()
    print(f"The spy {player_name} has successfully landed in the mission system!")
