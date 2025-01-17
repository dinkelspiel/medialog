import gleam/dynamic/decode
import gleam/option.{type Option}
import pog

/// Runs the `create_user_session` query
/// defined in `./src/squirrel/sql/create_user_session.sql`.
///
/// > 🐿️ This function was generated automatically using v2.1.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn create_user_session(db, arg_1, arg_2, arg_3, arg_4, arg_5) {
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

/// A row you get from running the `get_user_entries_by_user_id` query
/// defined in `./src/squirrel/sql/get_user_entries_by_user_id.sql`.
///
/// > 🐿️ This type definition was generated automatically using v2.1.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserEntriesByUserIdRow {
  GetUserEntriesByUserIdRow(
    id: Int,
    user_id: Int,
    entry_id: Int,
    rating: Int,
    notes: String,
    watched_at: Option(pog.Timestamp),
    status: UserEntryStatus,
    progress: Int,
    created_at: pog.Timestamp,
    updated_at: pog.Timestamp,
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
    use id <- decode.field(0, decode.int)
    use user_id <- decode.field(1, decode.int)
    use entry_id <- decode.field(2, decode.int)
    use rating <- decode.field(3, decode.int)
    use notes <- decode.field(4, decode.string)
    use watched_at <- decode.field(5, decode.optional(pog.timestamp_decoder()))
    use status <- decode.field(6, user_entry_status_decoder())
    use progress <- decode.field(7, decode.int)
    use created_at <- decode.field(8, pog.timestamp_decoder())
    use updated_at <- decode.field(9, pog.timestamp_decoder())
    decode.success(
      GetUserEntriesByUserIdRow(
        id:,
        user_id:,
        entry_id:,
        rating:,
        notes:,
        watched_at:,
        status:,
        progress:,
        created_at:,
        updated_at:,
      ),
    )
  }

  let query = "SELECT
    *
FROM
    user_entry
WHERE
    user_id = $1"

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

/// Corresponds to the Postgres `rating_style` enum.
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
