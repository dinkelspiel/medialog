import gleam/dynamic/decode
import gleam/option.{type Option}
import pog

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
    decode.success(GetUserEntriesByUserIdRow(
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
    ))
  }

  let query =
    "SELECT *
FROM user_entry
WHERE user_id = $1
"

  pog.query(query)
  |> pog.parameter(pog.int(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

// --- Enums -------------------------------------------------------------------

/// Corresponds to the Postgres `user_entry_status` enum.
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
