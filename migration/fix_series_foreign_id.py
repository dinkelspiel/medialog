import mysql.connector    
import requests
import json
import sys
import time

apiKey = input("apikey:")

db = mysql.connector.connect(
    host="mysql",
    user="root",
    password="prisma",
    database="database"
)

cursor = db.cursor(buffered=True, dictionary=True)
cursor2 = db.cursor(buffered=True, dictionary=True)
cursor3 = db.cursor(buffered=True, dictionary=True)

SERIES_CATEGORY = 1
MOVIE_CATEGORY = 2
BOOK_CATEGORY = 3

ignore = []
cursor.execute(f"SELECT * FROM Entry")
entries = cursor.fetchall()
# cursor.close()
for entry in entries:
    print("\n------------------------")
    if(entry["category"] != "Series"):
        print("Skipped non series")
        continue
    print("Processing series")

    cursor.execute(f"SELECT * FROM Collection WHERE id = '{entry['collectionId']}'")
    collection = cursor.fetchone()
    # cursor.close()
    print(collection)
    
    seasons = json.loads(requests.get(f"https://api.themoviedb.org/3/tv/{collection['foreignId']}?language=en-US", headers={
        "Authorization": f"Bearer {apiKey}"
    }).content)["seasons"]
    
    for season in seasons:
        print(f"SELECT * FROM Entry WHERE foreignId = {season['id']}")
        cursor2.execute(f"SELECT * FROM Entry WHERE foreignId = {season['id']}")
        entry = cursor2.fetchone()
        # cursor2.close()
        print(entry)
        if(entry is None):
            print(season)
            print("issue")
            time.sleep(2)
            continue
        if(entry["id"] in ignore):
            continue
        print(season)
        print(entry)
        # cursor3.execute(f"UPDATE Entry SET foreignId = '{season['season_number']}' WHERE foreignId = '{season['id']}'")
        # cursor3.close()
        ignore.append(entry["id"])