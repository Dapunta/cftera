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