import psycopg2
import psycopg2.extras
import mysql.connector

pgconn = psycopg2.connect(
    database="medialog",
    host="localhost",
    user="medialog",
    password="medialog"
)

pgcursor = pgconn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
# pgcursor.execute("SELECT * FROM DB_table WHERE id = 1")

myconn = mysql.connector.connect(
    host="localhost",
    user="medialog",
    password="medialog",
    database="medialog",
)

mycursor = myconn.cursor(dictionary=True)

mycursor.execute("SELECT * FROM Collection")
for row in mycursor:
    print(row)