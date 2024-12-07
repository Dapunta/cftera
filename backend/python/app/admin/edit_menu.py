from decimal import Decimal
from ..utils.connect_db import get_db_connection

def edit_menu(data):
    response = {'status':'failed', 'data':{}}
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = """
        UPDATE menu
        SET name = %s,
            price = %s,
            discount = %s,
            category = %s,
            is_available = %s,
            is_popular = %s
        WHERE id_menu = %s
    """
    values = (data['name'], Decimal(data['price']), data['discount'], data['category'], data['is_available'], data['is_popular'], data['id_menu'])
    cursor.execute(query, values)
    connection.commit()
    # print(cursor.rowcount)
    if cursor.rowcount > 0:
        query_select = """
            SELECT id_menu, name, price, discount, category, is_available, is_popular
            FROM menu WHERE id_menu = %s
        """
        cursor.execute(query_select, (data['id_menu'],))
        updated_data = cursor.fetchone()
        updated_data['price'] = int(updated_data['price'])
        response = {
            'status':'success',
            'data':updated_data
        }
    cursor.close()
    connection.close()
    return(response)