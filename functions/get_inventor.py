# to choose an inventor team randomly

def get_inventor(connection):
    cursor = connection.cursor()
    sql = "SELECT inventor_id FROM inventor ORDER BY RAND() LIMIT 1"
    cursor.execute(sql)
    inventor = cursor.fetchone()
    return inventor