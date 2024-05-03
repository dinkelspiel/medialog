import mysql.connector    
import requests
import json
import sys
from Levenshtein import distance as levenshtein_distance

db = mysql.connector.connect(
    host="mysql",
    user="root",
    password="prisma",
    database="medialog"
)

cursor = db.cursor(buffered=True, dictionary=True)

cursor.execute(f"SELECT * FROM franchises")

SERIES_CATEGORY = 1
MOVIE_CATEGORY = 2
BOOK_CATEGORY = 3

# for row in cursor.fetchall():
#     if(row['category_id'] == SERIES_CATEGORY):
#         try:
#             print("")
#             print(f"Searching '{row['name']}'...")
#             data = json.loads(requests.get(f"http://localhost:3000/api/import/series/search?q={row['name']}").content)
#             for key, i in enumerate(data):
#                 print(f"{key} Name: '{i['title']}', Released: {i['releaseDate']}")
#             if(len(data) > 1):
#                 selectedForeignId = data[int(input("Select: "))]['foreignId']
#             elif(len(data) == 1):
#                 selectedForeignId = data[0]['foreignId']
#                 print("Auto selected")
#             else:
#                 selectedForeignId = input(f"No series found. Give the TMDB id manually or input 'skip': ")
               
#             if(selectedForeignId == 'exit'):
#                 sys.exit()
               
#             if(selectedForeignId != 'skip'): 
#                 content = requests.get(f"http://localhost:3000/api/import/series?tmdbId={selectedForeignId}").content
#                 data = json.loads(content)
#                 if('message' in data):
#                     print(f"Success: {data['message']}")
                    
#                     cursor.execute(f"SELECT * FROM user_entries")
#                 if('error' in data):
#                     print(f"Error: {data['error']}")
#             else:
#                 print(f"Skipped {data['name']}")
#         except Exception as e:
#             print(f"Failed importing" + repr(e))
#     if(row['category_id'] == MOVIE_CATEGORY):
#         try:
#             print("")
#             print(f"Searching '{row['name']}'...")
#             data = json.loads(requests.get(f"http://localhost:3000/api/import/movie/search?q={row['name']}").content)
#             for key, i in enumerate(data):
#                 print(f"{key} Name: '{i['title']}', Released: {i['releaseDate']}")
#             if(len(data) > 1):
#                 selectedForeignId = data[int(input("Select: "))]['foreignId']
#             elif(len(data) == 1):
#                 selectedForeignId = data[0]['foreignId']
#                 print("Auto selected")
#             else:
#                 selectedForeignId = input(f"No movies found. Give the TMDB id manually or input 'skip': ")
               
#             if(selectedForeignId == 'exit'):
#                 sys.exit()
               
#             if(selectedForeignId != 'skip'): 
#                 data = json.loads(requests.get(f"http://localhost:3000/api/import/movie?tmdbId={selectedForeignId}").content)
#                 if('message' in data):
#                     print(f"Success: {data['message']}")
#                 if('error' in data):
#                     print(f"Error: {data['error']}")
#             else:
#                 print(f"Skipped {data['name']}")
#         except Exception as e:
#             print(f"Failed importing " + repr(e))
#     if(row['category_id'] == BOOK_CATEGORY):
#         try:
#             print("")
#             print(f"Searching '{row['name']}'...")
#             data = json.loads(requests.get(f"http://localhost:3000/api/import/book/search?q={row['name']}").content)
#             for key, i in enumerate(data):
#                 print(f"{key} Name: '{i['title']}', Released: {i['releaseDate']}")
#             if(len(data) > 1):
#                 selectedForeignId = data[int(input("Select: "))]['foreignId']
#             elif(len(data) == 1):
#                 selectedForeignId = data[0]['foreignId']
#                 print("Auto selected")
#             else:
#                 selectedForeignId = input(f"No book found. Give the Open Library id manually or input 'skip': ")
               
#             if(selectedForeignId == 'exit'):
#                 sys.exit()
               
#             if(selectedForeignId != 'skip'): 
#                 data = json.loads(requests.get(f"http://localhost:3000/api/import/book?olId={selectedForeignId}").content)
#                 if('message' in data):
#                     print(f"Success: {data['message']}")
#                 if('error' in data):
#                     print(f"Error: {data['error']}")
#             else:
#                 print(f"Skipped {data['name']}")
#         except Exception as e:
#             print(f"Failed importing " + repr(e))
 
newDb = mysql.connector.connect(
    host="mysql",
    user="root",
    password="prisma",
    database="database"
)

cursor.execute(f"SELECT * FROM user_entries")

userEntries = cursor.fetchall()

oldEntries = []

cursor.execute(f"SELECT IF(f.name != e.NAME, CONCAT(f.name, ': ', e.name), f.name) AS entry_with_franchise, f.name AS franchise, e.id AS entry_id FROM entries e JOIN franchises f ON e.franchise_id = f.id;")

newCursor = newDb.cursor(buffered=True, dictionary=True)
newCursor.execute(f"SELECT * FROM EntryAlternativeTitle")

alternativeTitles = []
for entry in newCursor.fetchall():
    alternativeTitles.append(entry)

# Old Entry Id > New Entry ID
from jaro import data as connections
# import os.path
# if(os.path.isfile("connections.json")):
#     with open('connections.json', 'r', encoding='utf-8') as f:
#         connections = json.loads(f.read())

# print(connections)

# oldEntries = cursor.fetchall()
# for oldEntry in oldEntries:
#     if(str(oldEntry['entry_id']) in list((connections.keys()))):
#         continue
    
#     exists = False
#     for userEntry in userEntries:
#         if(userEntry['entry_id'] == oldEntry['entry_id'] and userEntry['status'] != 'planning'):
#             exists = True
            
#     if(not exists):
#         print("Skipped " + oldEntry['entry_with_franchise'])
#         print()
#         continue
    
#     mostSimilarId = -1
#     highestSimilarity = 99999999999
#     mostSimilarTitle = ""
#     for alternativeTitle in alternativeTitles:
#         if('Specials' in oldEntry['entry_with_franchise']):
#             continue
        
#         if('Specials' in alternativeTitle['title']):
#             continue
        
#         jaroDistance = levenshtein_distance(oldEntry['entry_with_franchise'], alternativeTitle['title'])
#         if(jaroDistance < highestSimilarity):
#             highestSimilarity = jaroDistance
#             mostSimilarId = alternativeTitle['entryId'] 
#             mostSimilarTitle = alternativeTitle['title']
            
#     for alternativeTitle in alternativeTitles:
#         if('Specials' in oldEntry['franchise']):
#             continue
        
#         if('Specials' in alternativeTitle['title']):
#             continue
        
#         jaroDistance = levenshtein_distance(oldEntry['franchise'], alternativeTitle['title'])
#         if(jaroDistance < highestSimilarity):
#             highestSimilarity = jaroDistance
#             mostSimilarId = alternativeTitle['entryId'] 
#             mostSimilarTitle = alternativeTitle['title']
          
#     newCursor = newDb.cursor(buffered=True, dictionary=True)
#     newCursor.execute(f"SELECT * FROM Entry WHERE id = {mostSimilarId}")
#     originalTitle = newCursor.fetchone()['originalTitle']
#     print(f"Original Title: {oldEntry['entry_with_franchise']}, Translated Title: {mostSimilarTitle}, Similarity: {highestSimilarity}")
#     manualEntryConnection = False
#     if(highestSimilarity > 3):
#         answer = ""
#         while answer != "Y" and answer != "N":
#             answer = input("Do you want to continue (Y/N)? ")
            
#         if(answer == "N"):
#             answer2 = ""
#             while answer2 != "Y" and answer2 != "N":
#                 answer2 = input("Do you want to skip entry entirely (Y/N)? ")
                
#             if(answer2 == "Y"):
#                 print()
#                 continue
            
#             manualEntryConnection = input(f"Input new entry id for {oldEntry['entry_with_franchise']}: ")
    
#     connections[oldEntry['entry_id']] = manualEntryConnection or mostSimilarId
#     print(f"Connected {oldEntry['entry_with_franchise']}")

#     print()
    
# with open('connections.json', 'w', encoding='utf-8') as f:
#     json.dump(connections, f, ensure_ascii=False, indent=4)
# print("Wrote connections to file")

i = 0
for userEntry in userEntries:
    i += 1
    
    if(userEntry['status'] == 'planning'):
        # print("Skipped planning")
        continue
    
    if(userEntry['user_id'] > 11):
        continue
    
    if(str(userEntry['entry_id']) not in connections):
        if(userEntry['user_id'] == 1):
            print(f"BAD No entry_id connection for {userEntry['entry_id']} {userEntry['id']}")
        else:
            print(f"GOOD No entry_id connection for {userEntry['entry_id']} {userEntry['id']}")  
        continue
    
    query = f"INSERT INTO UserEntry(userId, entryId, rating, notes, watchedAt, status, progress, createdAt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

    try:
        newCursor.execute(query, (userEntry['user_id'], connections[str(userEntry['entry_id'])], userEntry['rating'], userEntry['notes'], userEntry['watched_at'].strftime('%Y-%m-%d %H:%M:%S') if userEntry['watched_at'] else None, userEntry['status'], userEntry['progress'], userEntry['created_at'].strftime('%Y-%m-%d %H:%M:%S')))
        # print("Migrated " + str(userEntry['id']))
    except Exception as e:
        print("Failed " + str(userEntry['id']) + " " + str(userEntry['entry_id']) + " " + repr(e))
    
newDb.commit()