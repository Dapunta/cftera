import base64, urllib.parse

key = 'fppweb2024dapunta'

def get_increment():
    increment = sum(ord(c) for c in key)
    return increment

def encrypt(string):
    increment = get_increment()
    raw = ''.join([chr(ord(c) + increment) for c in string])
    result = base64.b64encode(urllib.parse.quote(raw).encode('utf-8')).decode('utf-8')
    return result

def decrypt(string) -> str:
    increment = get_increment()
    raw = base64.b64decode(string.encode('utf-8')).decode('utf-8')
    unq = urllib.parse.unquote(raw)
    result = ''.join([chr(ord(j) - increment) for j in unq])
    return(result)

# ----------------------------

import json
import mysql.connector

#--> Load MySQL config from JSON
def load_mysql_config():
    with open('backend/database/mysql_config.json') as f:
        return json.load(f)

#--> Connect to MySQL Database
def get_db_connection():
    config = load_mysql_config()
    connection = mysql.connector.connect(
        host=config['host'],
        user=config['user'],
        password=config['password'],
        database=config['database'],
        port=config['port'],
        charset=config['charset']
    )
    return connection

# ------------------------------

#--> Menghapus Data Pesanan Berdasar id_pesanan dan Belum Diproses
def delete_order_by_id(id_pesanan):

    #--> DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    #--> Cek apakah pesanan dengan id_pesanan dan status 'Belum Diproses' ada
    query_check = "SELECT id_pesanan FROM pesanan WHERE id_pesanan = %s AND status = 'Belum Diproses'"
    cursor.execute(query_check, (id_pesanan,))
    result = cursor.fetchone()

    #--> Hapus Pesanan
    if result:
        query_delete = "DELETE FROM pesanan WHERE id_pesanan = %s"
        cursor.execute(query_delete, (id_pesanan,))

    #--> Commit & Close
    connection.commit()
    cursor.close()
    connection.close()

#--> Menghapus Semua Data Pesanan Belum Diproses
def delete_all_order():

    #--> DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    #--> Cek apakah ada pesanan dengan status 'Belum Diproses'
    query_check = "SELECT id_pesanan FROM pesanan WHERE status = 'Belum Diproses'"
    cursor.execute(query_check)
    result = cursor.fetchall()

    #--> Hapus Pesanan
    if result:
        query_delete = "DELETE FROM pesanan WHERE status = 'Belum Diproses'"
        cursor.execute(query_delete)

    #--> Commit & Close
    connection.commit()
    cursor.close()
    connection.close()

enc_string = 'SlVSQkpVSTBKVVE1SlRsQ0pVUkJKVUU1SlVSQkpUbEZKVVJCSlVGREpVUkJKVGxCSlVSQkpVRTNKVVJCSlRsQkpVUkJKVUUzSlVRNUpUbENKVVE1SlVJekpVUkJKVUkwSlVRNUpUbENKVVE1SlVKQkpVUkJKVGt5SlVSQkpUZ3dKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGQkpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZCSlVRNUpVSXdKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVE1SlVKQkpVUkJKVGt5SlVSQkpUZzVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGREpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZCSlVRNUpVSXlKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVJCSlRoREpVUkJKVGhFSlVSQkpUZzBKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGREpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZESlVRNUpVRkdKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVJCSlRoQ0pVUTVKVUpFSlVSQkpUZ3dKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGQkpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZDSlVRNUpVSXhKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUkJKVUkySlVRNUpVRTFKVVE1SlRsQ0pVUkJKVUUySlVSQkpUbEZKVVJCSlVFekpVUkJKVGxCSlVRNUpUbENKVVE1SlVJekpVUTVKVGxDSlVRNUpVSkJKVVE1SlVGQkpVUTVKVGxDSlVRNUpVRTFKVVE1SlRsQ0pVUkJKVUU1SlVSQkpUbEJKVVJCSlVJeUpVUkJKVUUySlVSQkpUbEZKVVJCSlVFM0pVUkJKVUZFSlVRNUpUbENKVVE1SlVJekpVUTVKVGxDSlVRNUpVSkNKVVJCSlRreUpVUkJKVGhDSlVRNUpVRTVKVVE1SlVGQkpVUTVKVGxDSlVSQkpVSTIlN0NKVVE1SlVGQkpVUTVKVUZCSlVRNUpVRkVKVVE1SlVFM0pVUTVKVUZCSlVRNUpVRkNKVVE1SlVGRkpVUTVKVUUzSlVRNUpVRkJKVVE1SlVFNUpVUTVKVUl4SlVRNUpVRTNKVVE1SlVGQ0pVUTVKVUZESlVRNUpVRkQlN0NKVVE1SlVGQkpVUTVKVUl3SlVRNUpVRkRKVVE1SlVGREpVUTVKVUZCSlVRNUpVSXlKVVE1SlVJeUpVUTVKVUl5SlVRNUpVSXdKVVE1SlVGQw=='

if __name__ == '__main__':
    
    #--> Hapus Pesanan Berdasar ID & Belum Diproses
    # id_pesanan = 'XXXXXXXXXX'
    # delete_order_by_id(id_pesanan)

    #--> Hapus Semua Pesanan Belum Diproses
    delete_all_order()
    
    pass