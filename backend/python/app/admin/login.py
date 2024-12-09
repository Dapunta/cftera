import jwt, time, datetime
from ..utils.connect_db import get_db_connection
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

# Menghasilkan pasangan kunci RSA
def generate_rsa_keys():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )
    public_key = private_key.public_key()
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return private_pem, public_pem

# Menghasilkan JWT Token
def generate_token(username, password):
    timestamp = int(time.time())

    # Payload data
    exp_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24) # Token expired dalam 24 jam
    payload = {
        "username": username,
        "password": password,
        "timestamp": timestamp,
        "exp": exp_time
    }

    # Gunakan private key untuk menandatangani JWT
    token = jwt.encode(payload, private_key, algorithm='RS256')
    return token

# Reverse JWT Token (decode dan verifikasi)
def reverse_token(token):
    try:
        decoded_data = jwt.decode(token, public_key, algorithms=['RS256'])
        response = login(decoded_data['username'], decoded_data['password'], token)
        return response
    except jwt.ExpiredSignatureError:
        return {'status':'failed', 'message':'Token expired', 'data':{}}
    except jwt.InvalidTokenError:
        return {'status':'failed', 'message':'Invalid token', 'data':{}}
    except Exception as e:
        return {'status':'failed', 'message':str(e), 'data':{}}

private_key, public_key = generate_rsa_keys()

# Fungsi untuk login
def login(username, password, token=None):
    response = {'status':'failed', 'message':'invalid credential', 'data':{}}

    # DB Connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Query untuk memeriksa kredensial
    query = "SELECT * FROM kasir WHERE BINARY username = %s AND BINARY password = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    if user:
        # Jika kredensial cocok, buat token
        response['status'] = 'success'
        response['message'] = ''
        response['data'] = {
            'id_kasir' : user['id_kasir'],
            'name'     : user['name'],
            'status'   : user['status'],
            'token'    : token if token else generate_token(username, password)
        }

    # Tutup koneksi
    cursor.close()
    connection.close()

    return response