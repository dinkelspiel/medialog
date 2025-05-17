import mysql.connector    
import requests
import json
import sys

apiKey = input("apikey:")

db = mysql.connector.connect(
    host="mysql",
    user="root",
    password="prisma",
    database="database"
)

cursor = db.cursor(buffered=True, dictionary=True)
cursor2 = db.cursor(buffered=True, dictionary=True)

SERIES_CATEGORY = 1
MOVIE_CATEGORY = 2
BOOK_CATEGORY = 3

cursor.execute(f"SELECT * FROM Entry")
entries = cursor.fetchall()
for entry in entries:
    print("\n------------------------")
    if(entry["category"] == "Book"):
        print("Skipped book")
        continue
    
    cursor.execute(f"SELECT * FROM Collection WHERE id = '{entry['collectionId']}'")
    collection = cursor.fetchone()
    print(collection)
    
    if(entry['category'] == 'Movie'):
        url = f"https://api.themoviedb.org/3/movie/{entry['foreignId']}/translations?language=en-US"
    else:
        url = f"https://api.themoviedb.org/3/tv/{entry['foreignId']}/translations?language=en-US"
    print(url)
    print(entry)
    translations = json.loads(requests.get(url, headers={
        "Authorization": f"Bearer {apiKey}"
    }).content)["translations"]
    print(translations)
    
    for translation in translations:
        cursor.execute(f"SELECT * FROM Language WHERE iso_639_1 = '{translation['iso_639_1']}'")
        language = cursor.fetchone()
        print(language["name"])
        cursor.execute(f"SELECT * FROM Country WHERE iso_3166_1 = '{translation['iso_3166_1']}'")
        country = cursor.fetchone()
        print(country["name"])
        
    
    print(entry["id"])
