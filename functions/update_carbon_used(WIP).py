
def update_carbon_used(connection,player_id):
    cursor = connection.cursor()
    # need to be changed
    sql = "SELECT carbon_used FROM player WHERE player_id = %s"
    #### questions here
    cursor.execute(sql,(player_id,))
    result = cursor.fetchone()
    if carbon_limit - updated_limit <= 0:
        print("You are run out of your limit, game over")
        return False
    else:
        sql = "UPDATE game_carbon SET carbon_limit = updated_limit WHERE player_name = %s"
    cursor.execute(sql,(update_limit,player_name))
    connection.commit()
    print(f"You have {update_limit:d} left")
    return True