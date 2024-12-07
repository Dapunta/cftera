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

if __name__ == '__main__':
    
    #--> Hapus Pesanan Berdasar ID & Belum Diproses
    # id_pesanan = 'XXXXXXXXXX'
    # delete_order_by_id(id_pesanan)

    #--> Hapus Semua Pesanan Belum Diproses
    delete_all_order()
    
    pass