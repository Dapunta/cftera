import os, json

#--> Test Rapikan Nama

def rapikanNama(text) -> str:
    list_kata = text.split(' ')
    if 1 < len(list_kata) < 4:
        if   len(list_kata) == 2: nama_menu = text.replace(' ','<br>')
        elif len(list_kata) == 3: nama_menu = f'{list_kata[0]} {list_kata[1]}<br>{list_kata[2]}'
    else:
        nama_menu = text
    return(nama_menu)

def testRapikan():
    rapikanNama('Ayam')
    rapikanNama('Ayam Goreng')
    rapikanNama('Ayam Goreng Kremes')
    rapikanNama('Ayam Goreng Kremes Asli')
    rapikanNama('Ayam Goreng Kremes Asli Wonogiri')

#--> Test Search Input

def searchName(text):
    text = text.lower().strip()
    list_menu = json.loads(open('order/database/menu.json', 'r').read())
    list_keyword = text.split(' ')
    
    item = {
        'category' : 'Sapi',
        'name'     : 'Rendang'
    }

    result = [item for item in list_menu if (
        all([word in str(item['name']).lower() for word in list_keyword]) or
        all([word in str(item['category']).lower().replace('_', ' ') for word in list_keyword]) or
        all([word in str(text) for word in str(item['category']).lower().replace('_', ' ').split(' ')]) or
        all([word in str(text) for word in str(item['name']).lower().replace('_', ' ').split(' ')])
        )]
    print(result)

def testSearch():
    input = 'Sapi'
    searchName(input)
    
#--> Enkripsi & Dekripsi

import base64

key = 'fppweb2024|dapunta'

def getIncrement():
    increment = 0
    for i in key: increment += ord(i)
    return(increment)

def encrypt(string) -> str:
    increment = getIncrement()
    raw = ''.join([chr(ord(j) + increment) for j in string])
    result = base64.b64encode(raw.encode('utf-8')).decode('utf-8')
    return(result)

def decrypt(string) -> str:
    increment = getIncrement()
    raw = base64.b64decode(string.encode('utf-8')).decode('utf-8')
    result = ''.join([chr(ord(j) - increment) for j in raw])
    return(result)

def testEncDec():
    string = 'akusayangkamu123'
    encrypted_string = encrypt(string)
    print(encrypted_string)
    decrypted_string = decrypt(encrypted_string)
    print(decrypted_string)

if __name__ == '__main__':
    testEncDec()