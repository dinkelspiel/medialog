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

# Insert into Collection table
mycursor.execute("SELECT * FROM Collection")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Collection"(id, name, "posterPath", "backdropPath", category, "createdAt", "updatedAt", "foreignId")
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["posterPath"], row["backdropPath"], row["category"], row["createdAt"], row["updatedAt"], row["foreignId"]))

# Insert into Country table
mycursor.execute("SELECT * FROM Country")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Country"(id, name, iso_3166_1, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["iso_3166_1"], row["createdAt"], row["updatedAt"]))

# Insert into Company table
mycursor.execute("SELECT * FROM Company")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Company"(id, name, logo, "countryId", "createdAt", "updatedAt", "foreignId")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["logo"], row["countryId"], row["createdAt"], row["updatedAt"], row["foreignId"]))

# Insert into Department table
mycursor.execute("SELECT * FROM Department")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Department"(id, name, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s)
    ''', (row["id"], row["name"], row["createdAt"], row["updatedAt"]))

# Insert into Language table
mycursor.execute("SELECT * FROM Language")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Language"(id, name, iso_639_1, iso_639_2, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["iso_639_1"], row["iso_639_2"], row["createdAt"], row["updatedAt"]))

# Insert into Person table
mycursor.execute("SELECT * FROM Person")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Person"(id, name, gender, "profilePath", "createdAt", "updatedAt", "foreignId")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["gender"], row["profilePath"], row["createdAt"], row["updatedAt"], row["foreignId"]))

# Insert into Job table
mycursor.execute("SELECT * FROM Job")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Job"(id, name, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s)
    ''', (row["id"], row["name"], row["createdAt"], row["updatedAt"]))

# Insert into WatchProvider table
mycursor.execute("SELECT * FROM WatchProvider")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "WatchProvider"(id, name, "logoPath", "createdAt", "updatedAt", "foreignId")
        VALUES(%s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["logoPath"], row["createdAt"], row["updatedAt"], row["foreignId"]))

# Insert into Genre table
mycursor.execute("SELECT * FROM Genre")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Genre"(id, name, "createdAt", "updatedAt", "foreignId")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["name"], row["createdAt"], row["updatedAt"], row["foreignId"]))

# Insert into Entry table
mycursor.execute("SELECT * FROM Entry")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Entry"(id, "collectionId", category, "originalLanguageId", "posterPath", tagline, "originalTitle", overview,
                             "backdropPath", length, "createdAt", "updatedAt", "foreignId", "releaseDate")
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["collectionId"], row["category"], row["originalLanguageId"], row["posterPath"], row["tagline"],
          row["originalTitle"], row["overview"], row["backdropPath"], row["length"], row["createdAt"], row["updatedAt"],
          row["foreignId"], row["releaseDate"]))

# Insert into EntryAlternativeTitle table
mycursor.execute("SELECT * FROM EntryAlternativeTitle")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryAlternativeTitle"(id, "entryId", "countryId", title, "createdAt", "updatedAt", "languageId")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["countryId"], row["title"], row["createdAt"], row["updatedAt"], row["languageId"]))

# Insert into EntryCast table
mycursor.execute("SELECT * FROM EntryCast")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryCast"(id, "entryId", "personId", character, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["personId"], row["character"], row["createdAt"], row["updatedAt"]))

# Insert into EntryCrew table
mycursor.execute("SELECT * FROM EntryCrew")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryCrew"(id, "entryId", "personId", "departmentId", "jobId", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["personId"], row["departmentId"], row["jobId"], row["createdAt"], row["updatedAt"]))

# Insert into EntryGenre table
mycursor.execute("SELECT * FROM EntryGenre")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryGenre"(id, "entryId", "genreId", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["genreId"], row["createdAt"], row["updatedAt"]))

# Insert into EntryProductionCompany table
mycursor.execute("SELECT * FROM EntryProductionCompany")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryProductionCompany"(id, "entryId", "companyId", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["companyId"], row["createdAt"], row["updatedAt"]))

# Insert into EntryProductionCountry table
mycursor.execute("SELECT * FROM EntryProductionCountry")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryProductionCountry"(id, "entryId", "countryId", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["countryId"], row["createdAt"], row["updatedAt"]))

# Insert into EntrySpokenLanguage table
mycursor.execute("SELECT * FROM EntrySpokenLanguage")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntrySpokenLanguage"(id, "entryId", "languageId", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["languageId"], row["createdAt"], row["updatedAt"]))

# Insert into EntryWatchProvider table
mycursor.execute("SELECT * FROM EntryWatchProvider")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "EntryWatchProvider"(id, "entryId", "watchProviderId", "countryId", type, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["watchProviderId"], row["countryId"], row["type"], row["createdAt"], row["updatedAt"]))

# Insert into User table
mycursor.execute("SELECT * FROM User")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "User"(id, username, email, password, "ratingStyle", "dailyStreakStarted", "dailyStreakUpdated",
                           "dailyStreakLength", "dailyStreakLongest", "invitedById", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["username"], row["email"], row["password"], row["ratingStyle"], row["dailyStreakStarted"],
          row["dailyStreakUpdated"], row["dailyStreakLength"], row["dailyStreakLongest"], row["invitedById"],
          row["createdAt"], row["updatedAt"]))

# Insert into Session table
mycursor.execute("SELECT * FROM Session")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "Session"(id, token, "userId", expiry, "ipAddress", "userAgent", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["token"], row["userId"], row["expiry"], row["ipAddress"], row["userAgent"],
          row["createdAt"], row["updatedAt"]))

# Insert into UserActivity table
mycursor.execute("SELECT * FROM UserActivity")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "UserActivity"(id, "userId", "entryId", type, "additionalData", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["userId"], row["entryId"], row["type"], row["additionalData"],
          row["createdAt"], row["updatedAt"]))

# Insert into UserEntry table
mycursor.execute("SELECT * FROM UserEntry")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "UserEntry"(id, "userId", "entryId", rating, notes, "watchedAt", status, progress, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["userId"], row["entryId"], row["rating"], row["notes"], row["watchedAt"],
          row["status"], row["progress"], row["createdAt"], row["updatedAt"]))

# Insert into UserFollow table
mycursor.execute("SELECT * FROM UserFollow")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "UserFollow"(id, "userId", "followId", "isFollowing", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["userId"], row["followId"], row["isFollowing"] == 1, row["createdAt"], row["updatedAt"]))

# Insert into UserForgotPassword table
mycursor.execute("SELECT * FROM UserForgotPassword")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "UserForgotPassword"(id, "userId", used, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s)
    ''', (row["id"], row["userId"], row["used"] == 1, row["createdAt"], row["updatedAt"]))

# Insert into UserList table
mycursor.execute("SELECT * FROM UserList")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "UserList"(id, "userId", name, description, type, "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["userId"], row["name"], row["description"], row["type"], row["createdAt"], row["updatedAt"]))

# Insert into UserListEntry table
mycursor.execute("SELECT * FROM UserListEntry")
for row in mycursor:
    pgcursor.execute('''
        INSERT INTO "UserListEntry"(id, "entryId", "listId", "order", "createdAt", "updatedAt")
        VALUES(%s, %s, %s, %s, %s, %s)
    ''', (row["id"], row["entryId"], row["listId"], row["order"], row["createdAt"], row["updatedAt"]))

pgconn.commit()
pgconn.close()
