from mysql.connector import CMySQLConnection

def return_inventor(connection: CMySQLConnection):
    # define cursor
    cursor = connection.cursor()

    # query data
    sql = "SELECT * FROM inventor"
    cursor.execute(sql)
    result = cursor.fetchall()

    inventors = []
    for inventor in result:
        inventors.append({
            "id": inventor[0],
            "name": inventor[1],
            "contribution": int(inventor[2]),
        })
    
    return inventors