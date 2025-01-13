DROP TABLE IF EXISTS "Collection";

CREATE TABLE "Collection" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    "posterPath" VARCHAR(191) NOT NULL,
    "backdropPath" VARCHAR(191) NOT NULL,
    category VARCHAR(6) CHECK (category IN ('Series', 'Movie', 'Book')) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "foreignId" VARCHAR(191) NOT NULL
);

DROP TABLE IF EXISTS "Country";

CREATE TABLE "Country" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL UNIQUE,
    iso_3166_1 VARCHAR(6) NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

DROP TABLE IF EXISTS "Company";

CREATE TABLE "Company" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    logo VARCHAR(191) DEFAULT NULL,
    "countryId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "foreignId" VARCHAR(191) NOT NULL,
    CONSTRAINT "Company_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Department";

CREATE TABLE "Department" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

DROP TABLE IF EXISTS "Language";

CREATE TABLE "Language" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    iso_639_1 CHAR(2) DEFAULT NULL,
    iso_639_2 CHAR(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

DROP TABLE IF EXISTS "Person";

CREATE TABLE "Person" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    gender SMALLINT NOT NULL,
    "profilePath" VARCHAR(191) DEFAULT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "foreignId" VARCHAR(191) NOT NULL
);

DROP TABLE IF EXISTS "Job";

CREATE TABLE "Job" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

DROP TABLE IF EXISTS "WatchProvider";

CREATE TABLE "WatchProvider" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    "logoPath" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "foreignId" VARCHAR(191) NOT NULL
);

DROP TABLE IF EXISTS "Genre";

CREATE TABLE "Genre" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "foreignId" VARCHAR(191) NOT NULL
);

DROP TABLE IF EXISTS "Entry";

CREATE TABLE "Entry" (
    id SERIAL PRIMARY KEY,
    "collectionId" INT DEFAULT NULL,
    category VARCHAR(6) CHECK (category IN ('Series', 'Movie', 'Book')) NOT NULL,
    "originalLanguageId" INT NOT NULL,
    "posterPath" VARCHAR(191) NOT NULL,
    tagline TEXT NOT NULL,
    "originalTitle" VARCHAR(191) NOT NULL,
    overview TEXT NOT NULL,
    "backdropPath" VARCHAR(191) NOT NULL,
    length SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "foreignId" VARCHAR(191) NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Entry_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entry_originalLanguageId_fkey" FOREIGN KEY ("originalLanguageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Entry_collectionId_idx" ON "Entry" ("collectionId");
CREATE INDEX "Entry_originalLanguageId_idx" ON "Entry" ("originalLanguageId");
CREATE INDEX "Entry_originalTitle_idx" ON "Entry" ("originalTitle");

DROP TABLE IF EXISTS "EntryAlternativeTitle";

CREATE TABLE "EntryAlternativeTitle" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "countryId" INT DEFAULT NULL,
    title VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "languageId" INT DEFAULT NULL,
    CONSTRAINT "EntryAlternativeTitle_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryAlternativeTitle_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryAlternativeTitle_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryAlternativeTitle_entryId_idx" ON "EntryAlternativeTitle" ("entryId");
CREATE INDEX "EntryAlternativeTitle_countryId_idx" ON "EntryAlternativeTitle" ("countryId");
CREATE INDEX "EntryAlternativeTitle_languageId_idx" ON "EntryAlternativeTitle" ("languageId");
CREATE INDEX "EntryAlternativeTitle_title_idx" ON "EntryAlternativeTitle" (title);

DROP TABLE IF EXISTS "EntryCast";

CREATE TABLE "EntryCast" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "personId" INT NOT NULL,
    character VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryCast_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryCast_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryCast_entryId_idx" ON "EntryCast" ("entryId");
CREATE INDEX "EntryCast_personId_idx" ON "EntryCast" ("personId");

DROP TABLE IF EXISTS "EntryCrew";

CREATE TABLE "EntryCrew" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "personId" INT NOT NULL,
    "departmentId" INT NOT NULL,
    "jobId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryCrew_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryCrew_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryCrew_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryCrew_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryCrew_entryId_idx" ON "EntryCrew" ("entryId");
CREATE INDEX "EntryCrew_personId_idx" ON "EntryCrew" ("personId");
CREATE INDEX "EntryCrew_departmentId_idx" ON "EntryCrew" ("departmentId");
CREATE INDEX "EntryCrew_jobId_idx" ON "EntryCrew" ("jobId");

DROP TABLE IF EXISTS "EntryGenre";

CREATE TABLE "EntryGenre" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "genreId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryGenre_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryGenre_entryId_idx" ON "EntryGenre" ("entryId");
CREATE INDEX "EntryGenre_genreId_idx" ON "EntryGenre" ("genreId");

DROP TABLE IF EXISTS "EntryProductionCompany";

CREATE TABLE "EntryProductionCompany" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "companyId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryProductionCompany_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryProductionCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryProductionCompany_entryId_idx" ON "EntryProductionCompany" ("entryId");
CREATE INDEX "EntryProductionCompany_companyId_idx" ON "EntryProductionCompany" ("companyId");

DROP TABLE IF EXISTS "EntryProductionCountry";

CREATE TABLE "EntryProductionCountry" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "countryId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryProductionCountry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryProductionCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryProductionCountry_entryId_idx" ON "EntryProductionCountry" ("entryId");
CREATE INDEX "EntryProductionCountry_countryId_idx" ON "EntryProductionCountry" ("countryId");

DROP TABLE IF EXISTS "EntrySpokenLanguage";

CREATE TABLE "EntrySpokenLanguage" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "languageId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntrySpokenLanguage_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntrySpokenLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntrySpokenLanguage_entryId_idx" ON "EntrySpokenLanguage" ("entryId");
CREATE INDEX "EntrySpokenLanguage_languageId_idx" ON "EntrySpokenLanguage" ("languageId");

DROP TABLE IF EXISTS "EntryWatchProvider";

CREATE TABLE "EntryWatchProvider" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "watchProviderId" INT NOT NULL,
    "countryId" INT NOT NULL,
    type VARCHAR(9) CHECK (type IN ('buy', 'rent', 'flatrate')) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryWatchProvider_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryWatchProvider_watchProviderId_fkey" FOREIGN KEY ("watchProviderId") REFERENCES "WatchProvider" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryWatchProvider_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryWatchProvider_entryId_idx" ON "EntryWatchProvider" ("entryId");
CREATE INDEX "EntryWatchProvider_watchProviderId_idx" ON "EntryWatchProvider" ("watchProviderId");
CREATE INDEX "EntryWatchProvider_countryId_idx" ON "EntryWatchProvider" ("countryId");
DROP TABLE IF EXISTS "EntryWatchProvider";

CREATE TABLE "EntryWatchProvider" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "watchProviderId" INT NOT NULL,
    "countryId" INT NOT NULL,
    type VARCHAR(9) CHECK (type IN ('buy', 'rent', 'flatrate')) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "EntryWatchProvider_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryWatchProvider_watchProviderId_fkey" FOREIGN KEY ("watchProviderId") REFERENCES "WatchProvider" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EntryWatchProvider_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "EntryWatchProvider_entryId_idx" ON "EntryWatchProvider" ("entryId");
CREATE INDEX "EntryWatchProvider_watchProviderId_idx" ON "EntryWatchProvider" ("watchProviderId");
CREATE INDEX "EntryWatchProvider_countryId_idx" ON "EntryWatchProvider" ("countryId");

DROP TABLE IF EXISTS "User";

CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(191) NOT NULL UNIQUE,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    "ratingStyle" VARCHAR(6) CHECK ("ratingStyle" IN ('stars', 'range')) NOT NULL DEFAULT 'stars',
    "dailyStreakStarted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "dailyStreakUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "dailyStreakLength" SMALLINT NOT NULL DEFAULT 0,
    "dailyStreakLongest" SMALLINT NOT NULL DEFAULT 0,
    "invitedById" INT DEFAULT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "User_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User" (id) ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Session";

CREATE TABLE "Session" (
    id SERIAL PRIMARY KEY,
    token VARCHAR(64) NOT NULL,
    "userId" INT NOT NULL,
    expiry TIMESTAMP(3) DEFAULT NULL,
    "ipAddress" VARCHAR(191) NOT NULL,
    "userAgent" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Session_userId_idx" ON "Session" ("userId");

DROP TABLE IF EXISTS "UserActivity";

CREATE TABLE "UserActivity" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "entryId" INT NOT NULL,
    type VARCHAR(14) CHECK (type IN ('statusUpdate', 'reviewed', 'rewatch', 'completeReview')) NOT NULL,
    "additionalData" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserActivity_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity" ("userId");
CREATE INDEX "UserActivity_entryId_idx" ON "UserActivity" ("entryId");

DROP TABLE IF EXISTS "UserEntry";

CREATE TABLE "UserEntry" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "entryId" INT NOT NULL,
    rating SMALLINT NOT NULL,
    notes TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) DEFAULT NULL,
    status VARCHAR(10) CHECK (status IN ('planning', 'watching', 'dnf', 'paused', 'completed')) NOT NULL DEFAULT 'planning',
    progress SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "UserEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UserEntry_userId_idx" ON "UserEntry" ("userId");
CREATE INDEX "UserEntry_entryId_idx" ON "UserEntry" ("entryId");

DROP TABLE IF EXISTS "UserFollow";

CREATE TABLE "UserFollow" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    "followId" INT NOT NULL,
    "isFollowing" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "UserFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserFollow_followId_fkey" FOREIGN KEY ("followId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UserFollow_userId_idx" ON "UserFollow" ("userId");
CREATE INDEX "UserFollow_followId_idx" ON "UserFollow" ("followId");

DROP TABLE IF EXISTS "UserForgotPassword";

CREATE TABLE "UserForgotPassword" (
    id UUID PRIMARY KEY,
    "userId" INT NOT NULL,
    used BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "UserForgotPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UserForgotPassword_userId_idx" ON "UserForgotPassword" ("userId");

DROP TABLE IF EXISTS "UserList";

CREATE TABLE "UserList" (
    id SERIAL PRIMARY KEY,
    "userId" INT NOT NULL,
    name VARCHAR(191) NOT NULL,
    description VARCHAR(256) NOT NULL DEFAULT '',
    type VARCHAR(9) CHECK (type IN ('ordered', 'unordered')) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "UserList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UserList_userId_idx" ON "UserList" ("userId");

DROP TABLE IF EXISTS "UserListEntry";

CREATE TABLE "UserListEntry" (
    id SERIAL PRIMARY KEY,
    "entryId" INT NOT NULL,
    "listId" INT NOT NULL,
    "order" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT "UserListEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserListEntry_listId_fkey" FOREIGN KEY ("listId") REFERENCES "UserList" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "UserListEntry_entryId_idx" ON "UserListEntry" ("entryId");
CREATE INDEX "UserListEntry_listId_idx" ON "UserListEntry" ("listId");