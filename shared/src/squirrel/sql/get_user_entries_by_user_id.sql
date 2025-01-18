SELECT
    user_entry.id AS "user_entry_id",
    user_entry.user_id AS "user_entry_user_id",
    user_entry.entry_id AS "user_entry_entry_id",
    user_entry.rating AS "user_entry_rating",
    user_entry.notes AS "user_entry_notes",
    user_entry.watched_at AS "user_entry_watched_at",
    user_entry.status AS "user_entry_status",
    user_entry.progress AS "user_entry_progress",
    user_entry.created_at AS "user_entry_created_at",
    user_entry.updated_at AS "user_entry_updated_at",
    "entry".id AS "entry_id",
    "entry".collection_id AS "entry_collection_id",
    "entry".category AS "entry_category",
    "entry".original_language_id AS "entry_original_language_id",
    "entry".poster_path AS "entry_poster_path",
    "entry".tagline AS "entry_tagline",
    "entry".original_title AS "entry_original_title",
    "entry".overview AS "entry_overview",
    "entry".backdrop_path AS "entry_backdrop_path",
    "entry"."length" AS "entry_length",
    "entry".created_at AS "entry_created_at",
    "entry".updated_at AS "entry_updated_at",
    "entry".foreign_id AS "entry_foreign_id",
    "entry".release_date AS "entry_release_date"
FROM
    user_entry
    -- LEFT JOIN "user" ON "user".id = user_entry.id
    -- LEFT JOIN "collection" ON "collection".id = entry.collection_id
    INNER JOIN "entry" ON "entry".id = user_entry.entry_id
WHERE
    user_entry.user_id = $1