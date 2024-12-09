import base64, hashlib
from cryptography.fernet import Fernet

SECRET_KEY = hashlib.sha256(b"dapuntagantengbanget").digest()
cipher_suite = Fernet(base64.urlsafe_b64encode(SECRET_KEY))
layers = 3

# Fungsi untuk encrypt string
def encrypt_string(text):
    enc = text
    for i in range(layers): enc = cipher_suite.encrypt(enc.encode()).decode()
    return enc

# Fungsi untuk decrypt string
def decrypt_string(text):
    dec = text
    for i in range(layers): dec = cipher_suite.decrypt(dec.encode()).decode()
    return dec