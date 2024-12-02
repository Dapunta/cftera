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