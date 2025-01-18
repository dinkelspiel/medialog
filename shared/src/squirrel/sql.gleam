import gleam/dynamic/decode
import gleam/option.{type Option}
import pog

/// A row you get from running the `get_user_by_id` query
/// defined in `./src/squirrel/sql/get_user_by_id.sql`.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserByIdRow {
  GetUserByIdRow(
    id: Int,
    username: String,
    email: String,
    password: String,
    rating_style: RatingStyle,
    daily_streak_started: pog.Timestamp,
    daily_streak_updated: pog.Timestamp,
    daily_streak_length: Int,
    daily_streak_longest: Int,
    invited_by_id: Option(Int),
    created_at: pog.Timestamp,
    updated_at: pog.Timestamp,
  )
}

/// Runs the `get_user_by_id` query
/// defined in `./src/squirrel/sql/get_user_by_id.sql`.
///
/// > 🐿️ This function was generated automatically using v2.1.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_by_id(db, arg_1) {
  let decoder = {
    use id <- decode.field(0, decode.int)
    use username <- decode.field(1, decode.string)
    use email <- decode.field(2, decode.string)
    use password <- decode.field(3, decode.string)
    use rating_style <- decode.field(4, rating_style_decoder())
    use daily_streak_started <- decode.field(5, pog.timestamp_decoder())
    use daily_streak_updated <- decode.field(6, pog.timestamp_decoder())
    use daily_streak_length <- decode.field(7, decode.int)
    use daily_streak_longest <- decode.field(8, decode.int)
    use invited_by_id <- decode.field(9, decode.optional(decode.int))
    use created_at <- decode.field(10, pog.timestamp_decoder())
    use updated_at <- decode.field(11, pog.timestamp_decoder())
    decode.success(
      GetUserByIdRow(
        id:,
        username:,
        email:,
        password:,
        rating_style:,
        daily_streak_started:,
        daily_streak_updated:,
        daily_streak_length:,
        daily_streak_longest:,
        invited_by_id:,
        created_at:,
        updated_at:,
      ),
    )
  }

  let query = "SELECT
    *
FROM
    \"user\"
WHERE
    id = $1"

  pog.query(query)
  |> pog.parameter(pog.int(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// Runs the `create_session` query
/// defined in `./src/squirrel/sql/create_session.sql`.
///
/// > 🐿️ This function was generated automatically using v2.1.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn create_session(db, arg_1, arg_2, arg_3, arg_4, arg_5) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })

  let query = "INSERT INTO
    session (token, user_id, expiry, ip_address, user_agent)
VALUES
    ($1, $2, $3, $4, $5)"

  pog.query(query)
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.int(arg_2))
  |> pog.parameter(pog.timestamp(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.text(arg_5))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_session_by_token` query
/// defined in `./src/squirrel/sql/get_session_by_token.sql`.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetSessionByTokenRow {
  GetSessionByTokenRow(
    id: Int,
    token: String,
    user_id: Int,
    expiry: Option(pog.Timestamp),
    ip_address: String,
    user_agent: String,
    created_at: pog.Timestamp,
    updated_at: pog.Timestamp,
  )
}

/// Runs the `get_session_by_token` query
/// defined in `./src/squirrel/sql/get_session_by_token.sql`.
///
/// > 🐿️ This function was generated automatically using v2.1.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_session_by_token(db, arg_1) {
  let decoder = {
    use id <- decode.field(0, decode.int)
    use token <- decode.field(1, decode.string)
    use user_id <- decode.field(2, decode.int)
    use expiry <- decode.field(3, decode.optional(pog.timestamp_decoder()))
    use ip_address <- decode.field(4, decode.string)
    use user_agent <- decode.field(5, decode.string)
    use created_at <- decode.field(6, pog.timestamp_decoder())
    use updated_at <- decode.field(7, pog.timestamp_decoder())
    decode.success(
      GetSessionByTokenRow(
        id:,
        token:,
        user_id:,
        expiry:,
        ip_address:,
        user_agent:,
        created_at:,
        updated_at:,
      ),
    )
  }

  let query = "SELECT
    *
FROM
    session
WHERE
    token = $1"

  pog.query(query)
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_entries_by_user_id` query
/// defined in `./src/squirrel/sql/get_user_entries_by_user_id.sql`.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserEntriesByUserIdRow {
  GetUserEntriesByUserIdRow(
    user_entry_id: Int,
    user_entry_user_id: Int,
    user_entry_entry_id: Int,
    user_entry_rating: Int,
    user_entry_notes: String,
    user_entry_watched_at: Option(pog.Timestamp),
    user_entry_status: UserEntryStatus,
    user_entry_progress: Int,
    user_entry_created_at: pog.Timestamp,
    user_entry_updated_at: pog.Timestamp,
    entry_id: Int,
    entry_collection_id: Option(Int),
    entry_category: EntryCategory,
    entry_original_language_id: Int,
    entry_poster_path: String,
    entry_tagline: String,
    entry_original_title: String,
    entry_overview: String,
    entry_backdrop_path: String,
    entry_length: Int,
    entry_created_at: pog.Timestamp,
    entry_updated_at: pog.Timestamp,
    entry_foreign_id: String,
    entry_release_date: pog.Timestamp,
  )
}

/// Runs the `get_user_entries_by_user_id` query
/// defined in `./src/squirrel/sql/get_user_entries_by_user_id.sql`.
///
/// > 🐿️ This function was generated automatically using v2.1.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_entries_by_user_id(db, arg_1) {
  let decoder = {
    use user_entry_id <- decode.field(0, decode.int)
    use user_entry_user_id <- decode.field(1, decode.int)
    use user_entry_entry_id <- decode.field(2, decode.int)
    use user_entry_rating <- decode.field(3, decode.int)
    use user_entry_notes <- decode.field(4, decode.string)
    use user_entry_watched_at <- decode.field(
      5,
      decode.optional(pog.timestamp_decoder()),
    )
    use user_entry_status <- decode.field(6, user_entry_status_decoder())
    use user_entry_progress <- decode.field(7, decode.int)
    use user_entry_created_at <- decode.field(8, pog.timestamp_decoder())
    use user_entry_updated_at <- decode.field(9, pog.timestamp_decoder())
    use entry_id <- decode.field(10, decode.int)
    use entry_collection_id <- decode.field(11, decode.optional(decode.int))
    use entry_category <- decode.field(12, entry_category_decoder())
    use entry_original_language_id <- decode.field(13, decode.int)
    use entry_poster_path <- decode.field(14, decode.string)
    use entry_tagline <- decode.field(15, decode.string)
    use entry_original_title <- decode.field(16, decode.string)
    use entry_overview <- decode.field(17, decode.string)
    use entry_backdrop_path <- decode.field(18, decode.string)
    use entry_length <- decode.field(19, decode.int)
    use entry_created_at <- decode.field(20, pog.timestamp_decoder())
    use entry_updated_at <- decode.field(21, pog.timestamp_decoder())
    use entry_foreign_id <- decode.field(22, decode.string)
    use entry_release_date <- decode.field(23, pog.timestamp_decoder())
    decode.success(
      GetUserEntriesByUserIdRow(
        user_entry_id:,
        user_entry_user_id:,
        user_entry_entry_id:,
        user_entry_rating:,
        user_entry_notes:,
        user_entry_watched_at:,
        user_entry_status:,
        user_entry_progress:,
        user_entry_created_at:,
        user_entry_updated_at:,
        entry_id:,
        entry_collection_id:,
        entry_category:,
        entry_original_language_id:,
        entry_poster_path:,
        entry_tagline:,
        entry_original_title:,
        entry_overview:,
        entry_backdrop_path:,
        entry_length:,
        entry_created_at:,
        entry_updated_at:,
        entry_foreign_id:,
        entry_release_date:,
      ),
    )
  }

  let query = "SELECT
    user_entry.id AS \"user_entry_id\",
    user_entry.user_id AS \"user_entry_user_id\",
    user_entry.entry_id AS \"user_entry_entry_id\",
    user_entry.rating AS \"user_entry_rating\",
    user_entry.notes AS \"user_entry_notes\",
    user_entry.watched_at AS \"user_entry_watched_at\",
    user_entry.status AS \"user_entry_status\",
    user_entry.progress AS \"user_entry_progress\",
    user_entry.created_at AS \"user_entry_created_at\",
    user_entry.updated_at AS \"user_entry_updated_at\",
    \"entry\".id AS \"entry_id\",
    \"entry\".collection_id AS \"entry_collection_id\",
    \"entry\".category AS \"entry_category\",
    \"entry\".original_language_id AS \"entry_original_language_id\",
    \"entry\".poster_path AS \"entry_poster_path\",
    \"entry\".tagline AS \"entry_tagline\",
    \"entry\".original_title AS \"entry_original_title\",
    \"entry\".overview AS \"entry_overview\",
    \"entry\".backdrop_path AS \"entry_backdrop_path\",
    \"entry\".\"length\" AS \"entry_length\",
    \"entry\".created_at AS \"entry_created_at\",
    \"entry\".updated_at AS \"entry_updated_at\",
    \"entry\".foreign_id AS \"entry_foreign_id\",
    \"entry\".release_date AS \"entry_release_date\"
FROM
    user_entry
    -- LEFT JOIN \"user\" ON \"user\".id = user_entry.id
    -- LEFT JOIN \"collection\" ON \"collection\".id = entry.collection_id
    INNER JOIN \"entry\" ON \"entry\".id = user_entry.entry_id
WHERE
    user_entry.user_id = $1"

  pog.query(query)
  |> pog.parameter(pog.int(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_by_email` query
/// defined in `./src/squirrel/sql/get_user_by_email.sql`.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserByEmailRow {
  GetUserByEmailRow(
    id: Int,
    username: String,
    email: String,
    password: String,
    rating_style: RatingStyle,
    daily_streak_started: pog.Timestamp,
    daily_streak_updated: pog.Timestamp,
    daily_streak_length: Int,
    daily_streak_longest: Int,
    invited_by_id: Option(Int),
    created_at: pog.Timestamp,
    updated_at: pog.Timestamp,
  )
}

/// Runs the `get_user_by_email` query
/// defined in `./src/squirrel/sql/get_user_by_email.sql`.
///
/// > 🐿️ This function was generated automatically using v2.1.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_by_email(db, arg_1) {
  let decoder = {
    use id <- decode.field(0, decode.int)
    use username <- decode.field(1, decode.string)
    use email <- decode.field(2, decode.string)
    use password <- decode.field(3, decode.string)
    use rating_style <- decode.field(4, rating_style_decoder())
    use daily_streak_started <- decode.field(5, pog.timestamp_decoder())
    use daily_streak_updated <- decode.field(6, pog.timestamp_decoder())
    use daily_streak_length <- decode.field(7, decode.int)
    use daily_streak_longest <- decode.field(8, decode.int)
    use invited_by_id <- decode.field(9, decode.optional(decode.int))
    use created_at <- decode.field(10, pog.timestamp_decoder())
    use updated_at <- decode.field(11, pog.timestamp_decoder())
    decode.success(
      GetUserByEmailRow(
        id:,
        username:,
        email:,
        password:,
        rating_style:,
        daily_streak_started:,
        daily_streak_updated:,
        daily_streak_length:,
        daily_streak_longest:,
        invited_by_id:,
        created_at:,
        updated_at:,
      ),
    )
  }

  let query = "SELECT
    *
FROM
    \"user\"
WHERE
    email = $1"

  pog.query(query)
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

// --- Enums -------------------------------------------------------------------

/// Corresponds to the Postgres `entry_category` enum.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type EntryCategory {
  Book
  Movie
  Series
}

fn entry_category_decoder() {
  use variant <- decode.then(decode.string)
  case variant {
    "book" -> decode.success(Book)
    "movie" -> decode.success(Movie)
    "series" -> decode.success(Series)
    _ -> decode.failure(Book, "EntryCategory")
  }
}/// Corresponds to the Postgres `rating_style` enum.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type RatingStyle {
  Range
  Stars
}

fn rating_style_decoder() {
  use variant <- decode.then(decode.string)
  case variant {
    "range" -> decode.success(Range)
    "stars" -> decode.success(Stars)
    _ -> decode.failure(Range, "RatingStyle")
  }
}/// Corresponds to the Postgres `user_entry_status` enum.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type UserEntryStatus {
  Completed
  Paused
  Dnf
  Watching
  Planning
}

fn user_entry_status_decoder() {
  use variant <- decode.then(decode.string)
  case variant {
    "completed" -> decode.success(Completed)
    "paused" -> decode.success(Paused)
    "dnf" -> decode.success(Dnf)
    "watching" -> decode.success(Watching)
    "planning" -> decode.success(Planning)
    _ -> decode.failure(Completed, "UserEntryStatus")
  }
}
