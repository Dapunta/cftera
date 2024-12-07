import os
from ..utils.connect_db import get_db_connection

def get_all_order():

    #--> DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    #--> SQL Query to Get All Orders and their related Menus
    query = """
    SELECT 
        pesanan.id_pesanan, 
        pesanan.time, 
        pesanan.status, 
        pesanan.total_price, 
        pesanan.meja, 
        pesanan.ip, 
        pesanan.payment, 
        menu.id_menu, 
        menu.name AS menu_name, 
        menu.price, 
        menu.discount, 
        menu.category, 
        menu.is_available, 
        menu.is_popular, 
        menu.image, 
        pesanan_menu.count 
    FROM pesanan
    JOIN pesanan_menu ON pesanan.id_pesanan = pesanan_menu.id_pesanan
    JOIN menu ON pesanan_menu.id_menu = menu.id_menu
    ORDER BY pesanan.time DESC
    """

    #--> Fetch all
    cursor.execute(query)
    orders = cursor.fetchall()
    
    #--> Grouping Orders by id_pesanan
    grouped_orders = {}
    for order in orders:
        id_pesanan = order['id_pesanan']
        if id_pesanan not in grouped_orders:
            # Initialize order data
            grouped_orders[id_pesanan] = {
                "id_pesanan": id_pesanan,
                "time": order['time'],
                "status": order['status'],
                "total_price": int(order['total_price']),
                "meja": order['meja'],
                "ip": order['ip'],
                "payment": order['payment'],
                "pesanan": []
            }
        # Handle image path and save it to static folder
        if order['image']:
            image_file_path = f"static/images/{order['id_menu']}.jpg"
            os.makedirs(os.path.dirname(image_file_path), exist_ok=True)
            with open(image_file_path, "wb") as image_file:
                image_file.write(order['image'])
            order['image'] = f"/static/images/{order['id_menu']}.jpg"

        # Append menu data to the pesanan list
        grouped_orders[id_pesanan]["pesanan"].append({
            "id_menu": order['id_menu'],
            "name": order['menu_name'],
            "price": int(order['price']),
            "discount": order['discount'],
            "category": order['category'],
            "is_available": order['is_available'],
            "is_popular": order['is_popular'],
            "image": order['image'],
            "count": order['count']
        })

    #--> Prepare final response
    response = list(grouped_orders.values())
    
    #--> Close connection
    cursor.close()
    connection.close()
    
    return(response)