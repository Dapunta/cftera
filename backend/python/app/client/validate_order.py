import re, base64, urllib.parse, datetime, random
# from app.utils.security_config import decrypt

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

#----------------------------

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

#------------------------------

#--> Decrypt Payload Dari Client
def decrypted_data(string):
    raw = urllib.parse.unquote(base64.b64decode(string.encode('utf-8')).decode('utf-8')).split('|')
    dec = [decrypt(i) for i in raw]
    data = {**eval(dec[0]), 'ip':dec[1], 'timestamp':dec[2]}
    return(data)

#--> Mengambil Harga Tiap Menu
def get_total_price(cursor, pesan):
    pesanan, total_price = [], 0
    for id_menu, count in pesan.items():
        query = "SELECT name, price, discount FROM menu WHERE id_menu = %s"
        cursor.execute(query, (id_menu,))
        result = cursor.fetchone()
        if result:
            name, price_per_item, discount = str(result['name']), int(result['price']), int(result['discount'])
            price_after_discount = price_per_item - ((discount/100)*price_per_item)
            price_add_item = price_after_discount * count
            total_price += price_add_item
            pesanan.append({'id':id_menu, 'name':name, 'count':count, 'price':int(price_add_item)})
    return (pesanan, int(total_price))

#--> Generate ID Pesanan
def generate_id_pesanan(meja):
    meja = str(meja)

    #--> Front Sign
    if len(meja) > 2: front = meja[-3:]
    else:
        if bool(re.search(r'[A-Za-z]', meja)):
            if len(meja) == 1: front = '{}{}{}'.format(meja[0], random.randint(0,9), random.randint(0,9))
            else: front = '{}0{}'.format(meja[0], meja[-1])
        else:
            if len(meja) == 1: front = '00{}'.format(meja[0])
            else: front = '0{}{}'.format(meja[0], meja[-1])
    
    #--> Middle Sign
    now = datetime.datetime.now()
    day, month = f"{now.day:02}", f"{now.month:02}"
    middle = day + month
    
    #--> Last Sign
    rdl = str(random.randint(0,999))
    if len(rdl) == 1: last = '00' + rdl
    elif len(rdl) == 2: last = '0' + rdl
    else: last = rdl

    #--> Full Sign
    full_sign = f'{front}{middle}{last}'
    return(full_sign)

#--> Deteksi Spam
def spam_detection(cursor, ip) -> bool:
    batas = 10
    query = """
        SELECT COUNT(*) 
        FROM pesanan 
        WHERE ip = %s AND status = 'Belum Diproses'
    """
    cursor.execute(query, (ip,))
    result = cursor.fetchone()
    count = result.get('COUNT(*)',0)
    return(True if int(count) >= batas else False)

#--> Menambah Data Pesanan
def add_order(data):

    #--> DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    #--> Ekstrak Data Dari Client
    pesan = {key:value['count'] for key,value in data['pesanan'].items()}
    payment = data['payment']
    meja = data['meja']
    pesanan, total_price = get_total_price(cursor, pesan)
    id_pesanan = generate_id_pesanan(meja)
    timestamp = int(data['timestamp'])
    status = 'Belum Diproses'
    ip = data['ip']
    
    #--> Anti Spam
    is_spam = spam_detection(cursor, ip)
    if not is_spam and int(total_price) != 0:

        #--> Tambahkan Data Ke Table 'pesanan'
        query_pesanan = """
            INSERT INTO pesanan (id_pesanan, time, status, total_price, meja, ip)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_pesanan, (id_pesanan, timestamp, status, total_price, meja, ip))

        #--> Tambahkan Data Ke Table 'pesanan_menu'
        for item in pesanan:
            id_menu = item['id']
            count = item['count']
            query_pesanan_menu = """
                INSERT INTO pesanan_menu (id_pesanan, id_menu, count)
                VALUES (%s, %s, %s)
            """
            cursor.execute(query_pesanan_menu, (id_pesanan, id_menu, count))
        
        response = {'status':'success', 'message':'', 'id_pesanan':id_pesanan}
    
    #--> Jika Spam
    else: response = {'status':'failed', 'message':'spam', 'id_pesanan':''}

    #--> Commit & Close
    connection.commit()
    cursor.close()
    connection.close()

    return(response)

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

enc_string = 'SlVSQkpVSTBKVVE1SlRsQ0pVUkJKVUU1SlVSQkpUbEZKVVJCSlVGREpVUkJKVGxCSlVSQkpVRTNKVVJCSlRsQkpVUkJKVUUzSlVRNUpUbENKVVE1SlVJekpVUkJKVUkwSlVRNUpUbENKVVE1SlVKQ0pVUkJKVGcwSlVRNUpVSkNKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGQ0pVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZDSlVRNUpVSXdKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUTVKVUUxSlVRNUpUbENKVVJCSlRnd0pVUkJKVGhGSlVSQkpUZzFKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVE1SlVGRUpVUTVKVGxDSlVRNUpVSXpKVVJCSlVJMEpVUTVKVGxDSlVSQkpUbERKVVJCSlVFNEpVUkJKVUZGSlVSQkpVRTNKVVJCSlVGRUpVUTVKVGxDSlVRNUpVSXpKVVE1SlVGQkpVUTVKVUUxSlVRNUpUbENKVVJCSlVFNUpVUkJKVUZDSlVSQkpVRXlKVVJCSlRsREpVUkJKVGxGSlVRNUpUbENKVVE1SlVJekpVUTVKVUZDSlVRNUpVRkVKVVE1SlVFNUpVUTVKVUU1SlVRNUpVRTVKVVJCSlVJMkpVUkJKVUkySlVRNUpVRTFKVVE1SlRsQ0pVUkJKVUUySlVSQkpUbEZKVVJCSlVFekpVUkJKVGxCSlVRNUpUbENKVVE1SlVJekpVUTVKVGxDSlVRNUpVSkJKVVE1SlVGQ0pVUTVKVGxDSlVRNUpVRTFKVVE1SlRsQ0pVUkJKVUU1SlVSQkpUbEJKVVJCSlVJeUpVUkJKVUUySlVSQkpUbEZKVVJCSlVFM0pVUkJKVUZFSlVRNUpUbENKVVE1SlVJekpVUTVKVGxDSlVRNUpVSkNKVVJCSlRreUpVUkJKVGhDSlVRNUpVRTVKVVE1SlVGQkpVUTVKVGxDSlVSQkpVSTIlN0NKVVE1SlVGQkpVUTVKVUl4SlVRNUpVRkNKVVE1SlVFM0pVUTVKVUZCSlVRNUpVRTNKVVE1SlVGR0pVUTVKVUl3SlVRNUpVRTNKVVE1SlVGRUpVUTVKVUZFJTdDSlVRNUpVRkJKVVE1SlVJd0pVUTVKVUZESlVRNUpVRkRKVVE1SlVGQkpVUTVKVUZFSlVRNUpVSXlKVVE1SlVGRkpVUTVKVUl3SlVRNUpVRkY=='

if __name__ == '__main__':
    
    #--> Buat Pesanan
    # payload = decrypted_data(enc_string)
    # buat_pesanan = add_order(payload)
    
    #--> Hapus Pesanan Berdasar ID & Belum Diproses
    # id_pesanan = 'XXXXXXXXXX'
    # delete_order_by_id(id_pesanan)

    #--> Hapus Semua Pesanan Belum Diproses
    # id_pesanan = 'XXXXXXXXXX'
    # delete_all_order()
    
    pass