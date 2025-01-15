
    CREATE TYPE entry_category AS ENUM (
        'series',
        'movie',
        'book'
    );



DROP TABLE IF EXISTS collection;

    CREATE TABLE collection (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        poster_path VARCHAR(191) NOT NULL,
        backdrop_path VARCHAR(191) NOT NULL,
        category entry_category NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        foreign_id VARCHAR(191) NOT NULL
    );

    DROP TABLE IF EXISTS country;

    CREATE TABLE country (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL UNIQUE,
        iso_3166_1 VARCHAR(6) NOT NULL UNIQUE,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    );

    DROP TABLE IF EXISTS company;

    CREATE TABLE company (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        logo VARCHAR(191) DEFAULT NULL,
        country_id INT NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        foreign_id VARCHAR(191) NOT NULL,
        CONSTRAINT company_country_id_fkey FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    DROP TABLE IF EXISTS department;

    CREATE TABLE department (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    );

    DROP TABLE IF EXISTS language;

    CREATE TABLE language (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        iso_639_1 CHAR(2) DEFAULT NULL,
        iso_639_2 CHAR(3) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    );

    DROP TABLE IF EXISTS person;

    CREATE TABLE person (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        gender SMALLINT NOT NULL,
        profile_path VARCHAR(191) DEFAULT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        foreign_id VARCHAR(191) NOT NULL
    );

    DROP TABLE IF EXISTS job;

    CREATE TABLE job (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    );

    DROP TABLE IF EXISTS watch_provider;

    CREATE TABLE watch_provider (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        logo_path VARCHAR(191) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        foreign_id VARCHAR(191) NOT NULL
    );

    DROP TABLE IF EXISTS genre;

    CREATE TABLE genre (
        id SERIAL PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        foreign_id VARCHAR(191) NOT NULL
    );

    DROP TABLE IF EXISTS entry;

    CREATE TABLE entry (
        id SERIAL PRIMARY KEY,
        collection_id INT DEFAULT NULL,
        category entry_category NOT NULL,
    original_language_id INT NOT NULL,
    poster_path VARCHAR(191) NOT NULL,
    tagline TEXT NOT NULL,
    original_title VARCHAR(191) NOT NULL,
    overview TEXT NOT NULL,
    backdrop_path VARCHAR(191) NOT NULL,
    length SMALLINT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    foreign_id VARCHAR(191) NOT NULL,
    release_date TIMESTAMP(3) NOT NULL,
    CONSTRAINT entry_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_original_language_id_fkey FOREIGN KEY (original_language_id) REFERENCES language (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_collection_id_idx ON entry (collection_id);
CREATE INDEX entry_original_language_id_idx ON entry (original_language_id);
CREATE INDEX entry_original_title_idx ON entry (original_title);

DROP TABLE IF EXISTS entry_alternative_title;

CREATE TABLE entry_alternative_title (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    country_id INT DEFAULT NULL,
    title VARCHAR(191) NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    language_id INT DEFAULT NULL,
    CONSTRAINT entry_alternative_title_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_alternative_title_country_id_fkey FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_alternative_title_language_id_fkey FOREIGN KEY (language_id) REFERENCES language (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_alternative_title_entry_id_idx ON entry_alternative_title (entry_id);
CREATE INDEX entry_alternative_title_country_id_idx ON entry_alternative_title (country_id);
CREATE INDEX entry_alternative_title_language_id_idx ON entry_alternative_title (language_id);
CREATE INDEX entry_alternative_title_title_idx ON entry_alternative_title (title);

DROP TABLE IF EXISTS entry_cast;

CREATE TABLE entry_cast (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    person_id INT NOT NULL,
    character VARCHAR(191) NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_cast_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_cast_person_id_fkey FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_cast_entry_id_idx ON entry_cast (entry_id);
CREATE INDEX entry_cast_person_id_idx ON entry_cast (person_id);

DROP TABLE IF EXISTS entry_crew;

CREATE TABLE entry_crew (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    person_id INT NOT NULL,
    department_id INT NOT NULL,
    job_id INT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_crew_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_crew_person_id_fkey FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_crew_department_id_fkey FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_crew_job_id_fkey FOREIGN KEY (job_id) REFERENCES job (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_crew_entry_id_idx ON entry_crew (entry_id);
CREATE INDEX entry_crew_person_id_idx ON entry_crew (person_id);
CREATE INDEX entry_crew_department_id_idx ON entry_crew (department_id);
CREATE INDEX entry_crew_job_id_idx ON entry_crew (job_id);

DROP TABLE IF EXISTS entry_genre;

CREATE TABLE entry_genre (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    genre_id INT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_genre_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_genre_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES genre (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_genre_entry_id_idx ON entry_genre (entry_id);
CREATE INDEX entry_genre_genre_id_idx ON entry_genre (genre_id);

DROP TABLE IF EXISTS entry_production_company;

CREATE TABLE entry_production_company (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    company_id INT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_production_company_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_production_company_company_id_fkey FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_production_company_entry_id_idx ON entry_production_company (entry_id);
CREATE INDEX entry_production_company_company_id_idx ON entry_production_company (company_id);

DROP TABLE IF EXISTS entry_production_country;

CREATE TABLE entry_production_country (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    country_id INT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_production_country_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_production_country_country_id_fkey FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_production_country_entry_id_idx ON entry_production_country (entry_id);
CREATE INDEX entry_production_country_country_id_idx ON entry_production_country (country_id);

DROP TABLE IF EXISTS entry_spoken_language;

CREATE TABLE entry_spoken_language (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    language_id INT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_spoken_language_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_spoken_language_language_id_fkey FOREIGN KEY (language_id) REFERENCES language (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_spoken_language_entry_id_idx ON entry_spoken_language (entry_id);
CREATE INDEX entry_spoken_language_language_id_idx ON entry_spoken_language (language_id);

CREATE TYPE entry_watch_provider_type AS ENUM (
    'buy',
    'rent',
    'flatrate'
);

DROP TABLE IF EXISTS entry_watch_provider;

CREATE TABLE entry_watch_provider (
    id SERIAL PRIMARY KEY,
    entry_id INT NOT NULL,
    watch_provider_id INT NOT NULL,
    country_id INT NOT NULL,
    type entry_watch_provider_type NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT entry_watch_provider_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES entry (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_watch_provider_watch_provider_id_fkey FOREIGN KEY (watch_provider_id) REFERENCES watch_provider (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT entry_watch_provider_country_id_fkey FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX entry_watch_provider_entry_id_idx ON entry_watch_provider (entry_id);
CREATE INDEX entry_watch_provider_watch_provider_id_idx ON entry_watch_provider (watch_provider_id);
CREATE INDEX entry_watch_provider_country_id_idx ON entry_watch_provider (country_id);

CREATE TYPE rating_style AS ENUM (
    'stars',
    'range'
);

DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(191) NOT NULL UNIQUE,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    rating_style rating_style NOT NULL DEFAULT 'stars',
    daily_streak_started TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    daily_streak_updated TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    daily_streak_length SMALLINT NOT NULL DEFAULT 0,
    daily_streak_longest SMALLINT NOT NULL DEFAULT 0,
    invited_by_id INT DEFAULT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT user_invited_by_id_fkey FOREIGN KEY (invited_by_id) REFERENCES "user" (id) ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS session;

CREATE TABLE session (
    id SERIAL PRIMARY KEY,
    token VARCHAR(64) NOT NULL,
    user_id INT NOT NULL,
    expiry TIMESTAMP(3) DEFAULT NULL,
    ip_address VARCHAR(191) NOT NULL,
    user_agent VARCHAR(191) NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX session_user_id_idx ON session (user_id);

CREATE TYPE user_activity_type AS ENUM (
    'status_update',
    'reviewed',
    'rewatch',
    'complete_review'
);

DROP TABLE IF EXISTS "user_activity";

CREATE TABLE "user_activity" (
  id SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "entry_id" INT NOT NULL,
  type user_activity_type NOT NULL,
  "additional_data" VARCHAR(191) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "user_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "user_activity_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "entry" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_activity_user_id_idx" ON "user_activity" ("user_id");
CREATE INDEX "user_activity_entry_id_idx" ON "user_activity" ("entry_id");

CREATE TYPE user_entry_status AS ENUM (
    'planning',
    'watching',
    'dnf',
    'paused',
    'completed'
);

DROP TABLE IF EXISTS "user_entry";

CREATE TABLE "user_entry" (
  id SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "entry_id" INT NOT NULL,
  rating SMALLINT NOT NULL,
  notes TEXT NOT NULL,
  "watched_at" TIMESTAMP(3) DEFAULT NULL,
  status user_entry_status NOT NULL DEFAULT 'planning',
  progress SMALLINT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "user_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "user_entry_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "entry" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_entry_user_id_idx" ON "user_entry" ("user_id");
CREATE INDEX "user_entry_entry_id_idx" ON "user_entry" ("entry_id");

DROP TABLE IF EXISTS "user_follow";

CREATE TABLE "user_follow" (
  id SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  "follow_id" INT NOT NULL,
  "is_following" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "user_follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "user_follow_follow_id_fkey" FOREIGN KEY ("follow_id") REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_follow_user_id_idx" ON "user_follow" ("user_id");
CREATE INDEX "user_follow_follow_id_idx" ON "user_follow" ("follow_id");

DROP TABLE IF EXISTS "user_forgot_password";

CREATE TABLE "user_forgot_password" (
  id UUID PRIMARY KEY,
  "user_id" INT NOT NULL,
  used BOOLEAN NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "user_forgot_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_forgot_password_user_id_idx" ON "user_forgot_password" ("user_id");

CREATE TYPE user_list_type AS ENUM (
    'ordered',
    'unordered'
);

DROP TABLE IF EXISTS "user_list";

CREATE TABLE "user_list" (
  id SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  name VARCHAR(191) NOT NULL,
  description VARCHAR(256) NOT NULL DEFAULT '',
  type user_list_type NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "user_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_list_user_id_idx" ON "user_list" ("user_id");

DROP TABLE IF EXISTS "user_list_entry";

CREATE TABLE "user_list_entry" (
  id SERIAL PRIMARY KEY,
  "entry_id" INT NOT NULL,
  "list_id" INT NOT NULL,
  "order" INT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "user_list_entry_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "entry" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "user_list_entry_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "user_list" (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_list_entry_entry_id_idx" ON "user_list_entry" ("entry_id");
CREATE INDEX "user_list_entry_list_id_idx" ON "user_list_entry" ("list_id");
