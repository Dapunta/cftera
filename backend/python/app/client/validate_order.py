import re, base64, urllib.parse, datetime, random
from ..utils.security_config import decrypt
from ..utils.connect_db import get_db_connection

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

#--> Mengecek Apakah id_pesanan Sudah Ada
def check_order_exists(cursor, id_pesanan) -> bool:
    query = "SELECT id_pesanan FROM pesanan WHERE id_pesanan = %s"
    cursor.execute(query, (id_pesanan,))
    result = cursor.fetchone()
    return result is not None

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
    is_exists = check_order_exists(cursor, id_pesanan)
    if not is_spam and not is_exists and int(total_price) != 0:

        #--> Tambahkan Data Ke Table 'pesanan'
        query_pesanan = """
            INSERT INTO pesanan (id_pesanan, time, status, total_price, meja, ip, payment)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_pesanan, (id_pesanan, timestamp, status, total_price, meja, ip, payment))

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