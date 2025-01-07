import psycopg2
import mysql.connector

pgconn = psycopg2.connect(
    database="medialog",
    host="localhost",
    user="medialog",
    password="medialog",
    port="5432"
)

pgcursor = pgconn.cursor()
pgcursor.execute("SELECT * FROM DB_table WHERE id = 1")

myconn = mysql.connector.connect(
    host="localhost",
    user="medialog",
    password="mysql"
)

mycursor = myconn.cursor()
mycursor.execute("CREATE DATABASE mydatabase")
