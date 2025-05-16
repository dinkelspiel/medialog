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

# cursor.execute(f"SELECT * FROM Entry WHERE foreignId = 293342")
# print(cursor.fetchone())

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

    cursor.execute(f"SELECT * FROM Collection WHERE id = {entry['collectionId']}")
    collection = cursor.fetchone()
    # cursor.close()
    print(collection)

    seasons = json.loads(requests.get(f"https://api.themoviedb.org/3/tv/{collection['foreignId']}?language=en-US", headers={
        "Authorization": f"Bearer {apiKey}"
    }).content)["seasons"]

    for season in seasons:
        cursor2.execute("SELECT * FROM Entry WHERE foreignId = %s", (str(season['id']),))
        season_entry = cursor2.fetchone()
        print(season_entry)
        print(cursor2.statement)

        if season_entry is None:
            print(season)
            print("issue")
            time.sleep(2)
            continue

        if season_entry["id"] in ignore:
            continue

        print(season)
        print(season_entry)

        cursor3.execute(
            "UPDATE Entry SET foreignId = %s WHERE foreignId = %s",
            (str(season['season_number']), str(season['id']))
        )

        ignore.append(season_entry["id"])


db.commit()
