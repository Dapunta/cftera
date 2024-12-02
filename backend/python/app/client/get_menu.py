import os
from decimal import Decimal
from ..utils.connect_db import get_db_connection

#--> Get All Menu To Display
def get_all_menu():

    #--> Execute Query
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM menu')

    #--> Result
    result = cursor.fetchall()
    for row in result:
        for key, value in row.items():
            if isinstance(value, Decimal):
                row[key] = float(value)
        if row['image']:
            image_file_path = f"static/images/{row['id_menu']}.jpg"
            os.makedirs(os.path.dirname(image_file_path), exist_ok=True)
            with open(image_file_path, "wb") as image_file:
                image_file.write(row['image'])
            row['image'] = f"/static/images/{row['id_menu']}.jpg"
    
    #--> Close Connection
    cursor.close()
    connection.close()
    
    #--> Return
    sorted_result = sorted(result, key=lambda x: x['name'])
    return(sorted_result)