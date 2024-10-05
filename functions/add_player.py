# WORKING
# Add player to database


def add_player(connection,player_name,player_country_id,carbon_limit):
    cursor = connection.cursor()
    # Check if player exists
    cursor.execute('SELECT * FROM player WHERE player_name = %s', (player_name,))
    row = cursor.fetchall()
    if len(row) != 0:
        print("Player Exists")
        print("Restart a game with another player name!")
        exit(1)
    sql = ('INSERT INTO player (player_name, player_country_id,carbon_limit) VALUES (%s, %s, %s)')
    cursor.execute(sql,(player_name,player_country_id,carbon_limit))
    connection.commit()
    cursor.close()
    print(f"The spy {player_name} has successfully landed in the mission system!")
