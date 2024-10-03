def find_inventor(connection):
    cursor = connection.cursor()
    sql = "SELECT * FROM inventor ORDER BY RAND() LIMIT 1"
    cursor.execute(sql)
    inventor = cursor.fetchall()
    return inventor