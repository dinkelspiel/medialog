import birl
import gleam/dynamic
import gleam/dynamic/decode
import gleam/int
import gleam/json
import gleam/list
import gleam/option.{type Option}
import gleam/result
import gleam/string_tree
import pog
import squirrel/sql

pub type UserEntry {
  UserEntry(
    id: Int,
    user_id: Int,
    entry_id: Int,
    rating: Int,
    notes: String,
    watched_at: Option(birl.Time),
    status: sql.UserEntryStatus,
    progress: Int,
    created_at: birl.Time,
    updated_at: birl.Time,
  )
}

pub type Entry {
  Entry(
    id: Int,
    collection_id: Option(Int),
    category: sql.EntryCategory,
    original_language_id: Int,
    poster_path: String,
    tagline: String,
    original_title: String,
    overview: String,
    backdrop_path: String,
    length: Int,
    created_at: birl.Time,
    updated_at: birl.Time,
    foreign_id: String,
    release_date: birl.Time,
  )
}

fn user_entry_status_decoder() {
  use variant <- decode.then(decode.string)
  case variant {
    "completed" -> decode.success(sql.Completed)
    "paused" -> decode.success(sql.Paused)
    "dnf" -> decode.success(sql.Dnf)
    "watching" -> decode.success(sql.Watching)
    "planning" -> decode.success(sql.Planning)
    _ -> decode.failure(sql.Completed, "UserEntryStatus")
  }
}

pub fn decode_tuple_to_result(
  a: fn(dynamic.Dynamic) -> #(a, List(b)),
) -> fn(dynamic.Dynamic) -> Result(a, List(b)) {
  fn(c: dynamic.Dynamic) {
    let result = a(c)
    case result.1 {
      [] -> Ok(result.0)
      _ -> Error(result.1)
    }
  }
}

pub fn entry_category_decoder() {
  use variant <- decode.then(decode.string)
  case variant {
    "book" -> decode.success(sql.Book)
    "movie" -> decode.success(sql.Movie)
    "series" -> decode.success(sql.Series)
    _ -> decode.failure(sql.Book, "EntryCategory")
  }
}

pub fn get_user_entries_by_user_id_entry_decoder() -> decode.Decoder(Entry) {
  use id <- decode.field(10, decode.int)
  use collection_id <- decode.field(11, decode.optional(decode.int))
  use category <- decode.field(12, entry_category_decoder())
  use original_language_id <- decode.field(13, decode.int)
  use poster_path <- decode.field(14, decode.string)
  use tagline <- decode.field(15, decode.string)
  use original_title <- decode.field(16, decode.string)
  use overview <- decode.field(17, decode.string)
  use backdrop_path <- decode.field(18, decode.string)
  use length <- decode.field(19, decode.int)
  use created_at <- decode.field(20, pog.timestamp_decoder())
  use updated_at <- decode.field(21, pog.timestamp_decoder())
  use foreign_id <- decode.field(22, decode.string)
  use release_date <- decode.field(23, pog.timestamp_decoder())
  decode.success(Entry(
    id:,
    collection_id:,
    category:,
    original_language_id:,
    poster_path:,
    tagline:,
    original_title:,
    overview:,
    backdrop_path:,
    length:,
    created_at: created_at |> pog_timestamp_to_timestamp,
    updated_at: updated_at |> pog_timestamp_to_timestamp,
    foreign_id:,
    release_date: release_date |> pog_timestamp_to_timestamp,
  ))
}

pub fn get_user_entries_by_user_id_user_entry_decoder() -> decode.Decoder(
  UserEntry,
) {
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
  decode.success(UserEntry(
    id:,
    user_id:,
    entry_id:,
    rating:,
    notes:,
    watched_at: watched_at
      |> option.map(fn(a) { pog_timestamp_to_timestamp(a) }),
    status:,
    progress:,
    created_at: created_at |> pog_timestamp_to_timestamp,
    updated_at: updated_at |> pog_timestamp_to_timestamp,
  ))
}

pub fn user_entry_encoder(user_entry: UserEntry) -> json.Json {
  json.object(
    list.flatten([
      [
        #("id", json.int(user_entry.id)),
        #("user_id", json.int(user_entry.user_id)),
        #("entry_id", json.int(user_entry.entry_id)),
        #("rating", json.int(user_entry.rating)),
        #("notes", json.string(user_entry.notes)),
        #("status", json.string(user_entry.status |> user_entry_status_encoder)),
        #("progress", json.int(user_entry.progress)),
        #(
          "created_at",
          user_entry.created_at
            |> birl.to_unix
            |> json.int,
        ),
        #(
          "updated_at",
          user_entry.updated_at
            |> birl.to_unix
            |> json.int,
        ),
      ],
      case user_entry.watched_at {
        option.Some(w) -> [
          #(
            "watched_at",
            w
              |> birl.to_unix
              |> json.int,
          ),
        ]
        option.None -> []
      },
    ]),
  )
}

pub fn entry_encoder(entry: Entry) -> json.Json {
  json.object(
    list.flatten([
      [
        #("id", json.int(entry.id)),
        #("category", json.string(entry.category |> entry_category_encoder)),
        #("original_language_id", json.int(entry.original_language_id)),
        #("poster_path", json.string(entry.poster_path)),
        #("tagline", json.string(entry.tagline)),
        #("original_title", json.string(entry.original_title)),
        #("overview", json.string(entry.overview)),
        #("backdrop_path", json.string(entry.backdrop_path)),
        #("length", json.int(entry.length)),
        #(
          "created_at",
          json.int(
            entry.created_at
            |> birl.to_unix,
          ),
        ),
        #(
          "updated_at",
          json.int(
            entry.updated_at
            |> birl.to_unix,
          ),
        ),
        #("foreign_id", json.string(entry.foreign_id)),
        #(
          "release_date",
          json.int(
            entry.release_date
            |> birl.to_unix,
          ),
        ),
      ],
      case entry.collection_id {
        option.Some(w) -> [#("collection_id", json.int(w))]
        option.None -> []
      },
    ]),
  )
}

pub fn user_entry_status_encoder(a: sql.UserEntryStatus) {
  case a {
    sql.Completed -> "completed"
    sql.Dnf -> "dnf"
    sql.Paused -> "paused"
    sql.Planning -> "planning"
    sql.Watching -> "watching"
  }
}

pub fn entry_category_encoder(a: sql.EntryCategory) {
  case a {
    sql.Book -> "book"
    sql.Movie -> "movie"
    sql.Series -> "series"
  }
}

pub fn pog_timestamp_to_timestamp(a: pog.Timestamp) {
  birl.parse(
    string_tree.new()
    |> string_tree.append(a.date.year |> int.to_string)
    |> string_tree.append("-")
    |> string_tree.append(a.date.month |> int.to_string)
    |> string_tree.append("-")
    |> string_tree.append(a.date.day |> int.to_string)
    |> string_tree.append("T")
    |> string_tree.append(a.time.hours |> int.to_string)
    |> string_tree.append(":")
    |> string_tree.append(a.time.minutes |> int.to_string)
    |> string_tree.append(":")
    |> string_tree.append(a.time.seconds |> int.to_string)
    |> string_tree.append("Z")
    |> string_tree.to_string,
  )
  |> result.unwrap(birl.now())
}

pub fn get_user_entries_by_user_id_to_user_entry(
  row: sql.GetUserEntriesByUserIdRow,
) -> UserEntry {
  UserEntry(
    row.user_entry_id,
    row.user_entry_user_id,
    row.user_entry_entry_id,
    row.user_entry_rating,
    row.user_entry_notes,
    row.user_entry_watched_at
      |> option.map(fn(a) { pog_timestamp_to_timestamp(a) }),
    row.user_entry_status,
    row.user_entry_progress,
    row.user_entry_created_at |> pog_timestamp_to_timestamp,
    row.user_entry_updated_at |> pog_timestamp_to_timestamp,
  )
}

pub fn get_user_entries_by_user_id_to_entry(
  row: sql.GetUserEntriesByUserIdRow,
) -> Entry {
  Entry(
    row.entry_id,
    row.entry_collection_id,
    row.entry_category,
    row.entry_original_language_id,
    row.entry_poster_path,
    row.entry_tagline,
    row.entry_original_title,
    row.entry_overview,
    row.entry_backdrop_path,
    row.entry_length,
    row.entry_created_at |> pog_timestamp_to_timestamp,
    row.entry_updated_at |> pog_timestamp_to_timestamp,
    row.entry_foreign_id,
    row.entry_release_date |> pog_timestamp_to_timestamp,
  )
}

pub fn user_entry_decoder() {
  use id <- decode.field("id", decode.int)
  use user_id <- decode.field("user_id", decode.int)
  use entry_id <- decode.field("entry_id", decode.int)
  use rating <- decode.field("rating", decode.int)
  use notes <- decode.field("notes", decode.string)
  use watched_at <- decode.optional_field("watched_at", -1, decode.int)
  use status <- decode.field("status", user_entry_status_decoder())
  use progress <- decode.field("progress", decode.int)
  use created_at <- decode.field("created_at", decode.int)
  use updated_at <- decode.field("updated_at", decode.int)
  decode.success(UserEntry(
    id:,
    user_id:,
    entry_id:,
    rating:,
    notes:,
    watched_at: case watched_at {
      -1 -> option.None
      _ -> option.Some(birl.from_unix(watched_at))
    },
    status:,
    progress:,
    created_at: birl.from_unix(created_at),
    updated_at: birl.from_unix(updated_at),
  ))
}

pub fn entry_decoder() {
  use id <- decode.field("id", decode.int)
  use collection_id <- decode.optional_field("collection_id", -1, decode.int)
  use category <- decode.field("category", entry_category_decoder())
  use original_language_id <- decode.field("original_language_id", decode.int)
  use poster_path <- decode.field("poster_path", decode.string)
  use tagline <- decode.field("tagline", decode.string)
  use original_title <- decode.field("original_title", decode.string)
  use overview <- decode.field("overview", decode.string)
  use backdrop_path <- decode.field("backdrop_path", decode.string)
  use length <- decode.field("length", decode.int)
  use created_at <- decode.field("created_at", decode.int)
  use updated_at <- decode.field("updated_at", decode.int)
  use foreign_id <- decode.field("foreign_id", decode.string)
  use release_date <- decode.field("release_date", decode.int)
  decode.success(Entry(
    id:,
    collection_id: case collection_id {
      -1 -> option.None
      _ -> option.Some(collection_id)
    },
    category:,
    original_language_id:,
    poster_path:,
    tagline:,
    original_title:,
    overview:,
    backdrop_path:,
    length:,
    created_at: birl.from_unix(created_at),
    updated_at: birl.from_unix(updated_at),
    foreign_id:,
    release_date: birl.from_unix(release_date),
  ))
}
