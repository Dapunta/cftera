from ..utils.connect_db import get_db_connection

#--> Menghapus Data Pesanan Berdasar id_pesanan dan Belum Diproses
def delete_order_by_id(id_pesanan):
    delete_success = False

    #--> DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    #--> Cek apakah pesanan dengan id_pesanan dan status 'Belum Diproses' ada
    query_check = "SELECT id_pesanan FROM pesanan WHERE id_pesanan = %s"
    cursor.execute(query_check, (id_pesanan,))
    result = cursor.fetchone()

    #--> Hapus Pesanan
    if result:
        query_delete = "DELETE FROM pesanan WHERE id_pesanan = %s"
        cursor.execute(query_delete, (id_pesanan,))
        if cursor.rowcount > 0: delete_success = True

    #--> Commit & Close
    connection.commit()
    cursor.close()
    connection.close()
    
    return(delete_success)

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
    
#--> Edit Status Pesanan Berdasar ID
def edit_status_by_id(id_pesanan, status_baru):
    response = {'status':'failed', 'data':{}}
    
    #--> DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    #--> Update Status Pesanan
    query_update = "UPDATE pesanan SET status = %s WHERE id_pesanan = %s"
    cursor.execute(query_update, (status_baru, id_pesanan))
    connection.commit()
    
    #--> Check
    affected_rows = cursor.rowcount
    if affected_rows > 0:
        query_get_status = "SELECT status FROM pesanan WHERE id_pesanan = %s"
        cursor.execute(query_get_status, (id_pesanan,))
        result = cursor.fetchone()
        updated_status = result["status"]
        response = {'status':'success', 'data':{'id_pesanan':id_pesanan, 'status':updated_status}}

    #--> Commit & Close
    cursor.close()
    connection.close()
    
    return(response)

if __name__ == '__main__':
    
    #--> Hapus Pesanan Berdasar ID & Belum Diproses
    # id_pesanan = 'A010312907'
    # uy = delete_order_by_id(id_pesanan)
    # print(uy)

    #--> Hapus Semua Pesanan Belum Diproses
    # delete_all_order()
    
    #--> Edit Status Pesanan Berdasar ID
    # id_pesanan = 'A010312099'
    # status = 'Selesai'
    # uy = edit_status_by_id(id_pesanan, status)
    # print(uy)
    
    pass