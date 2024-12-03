from ..utils.connect_db import get_db_connection

payment_string: dict[str,str] = {
    'BYR01' : 'Cash',
    'BYR02' : 'E-Wallet',
    'BYR03' : 'M-Banking'
}

def get_invoice(id_invoice):

    #--> Execute Query
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    #--> Get data pesanan
    query_invoice = """
        SELECT * 
        FROM pesanan 
        WHERE id_pesanan = %s
    """
    cursor.execute(query_invoice, (id_invoice,))
    invoice = cursor.fetchone()

    if not invoice:
        return {'status':'failed', 'message':'Invoice not found', 'data':{}}
    
    else:
        query_menu_items = """
            SELECT pm.id_menu, m.name, m.price, m.discount, pm.count
            FROM pesanan_menu pm
            JOIN menu m ON pm.id_menu = m.id_menu
            WHERE pm.id_pesanan = %s
        """
        cursor.execute(query_menu_items, (id_invoice,))
        menu_items = cursor.fetchall()

        #--> Rapikan Response
        pesanan = [
            {
                'id_menu' : str(item['id_menu']),
                'name'    : str(item['name']),
                'count'   : int(item['count']),
                'price'   : int( int(item['price']) - (int(item['price']) * (int(item['discount'])/100)) )
            } for item in menu_items
        ]
        response_structure = {
            "status"  : "success",
            "message" : "",
            "data"    : {
                "id_pesanan"  : str(invoice['id_pesanan']),
                "meja"        : str(invoice['meja']),
                "timestamp"   : int(invoice['time']),
                "payment"     : str(payment_string[invoice['payment']]),
                "pesanan"     : pesanan,
                "total_price" : int(invoice['total_price'])
            }
        }

        return(response_structure)

# if __name__ == '__main__':
#     id_invoice = 'A100312814'
#     response = get_invoice(id_invoice)
#     print(response)