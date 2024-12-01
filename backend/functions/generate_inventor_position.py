# generate a position to the inventor selected randomly

def generate_inventor_position(connection,inventor_id):
   cursor = connection.cursor()
   sql = ('UPDATE inventor SET inventor.position = '
          '(SELECT target_airport_ident FROM game_country ORDER BY RAND() LIMIT 1) '
          'WHERE inventor_id = %s')
   cursor.execute(sql,(inventor_id,))
   position = cursor.fetchall()
   connection.commit()
   return position