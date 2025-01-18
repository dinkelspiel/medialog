import birl
import gleam/dynamic
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/json
import gleam/list
import gleam/option.{type Option}
import gleam/result
import gleam/string_tree
import pog
import squirrel/sql

pub fn date_decoder() -> decode.Decoder(Date) {
  use year <- decode.field(0, decode.int)
  use month <- decode.field(1, decode.int)
  use day <- decode.field(2, decode.int)
  decode.success(Date(year:, month:, day:))
}

pub fn time_decoder() -> decode.Decoder(Time) {
  use hours <- decode.field(0, decode.int)
  use minutes <- decode.field(1, decode.int)
  use #(seconds, microseconds) <- decode.field(2, seconds_decoder())
  decode.success(Time(hours:, minutes:, seconds:, microseconds:))
}

fn seconds_decoder() -> decode.Decoder(#(Int, Int)) {
  let int = {
    decode.int
    |> decode.map(fn(i) { #(i, 0) })
  }
  let float = {
    decode.float
    |> decode.map(fn(f) {
      let floored = float.floor(f)
      let seconds = float.round(floored)
      let microseconds = float.round({ f -. floored } *. 1_000_000.0)
      #(seconds, microseconds)
    })
  }
  decode.one_of(int, [float])
}

pub type Time {
  Time(hours: Int, minutes: Int, seconds: Int, microseconds: Int)
}

pub type Date {
  Date(year: Int, month: Int, day: Int)
}

pub type Timestamp {
  Timestamp(date: Date, time: Time)
}

pub fn timestamp_decoder() -> decode.Decoder(Timestamp) {
  use date <- decode.field(0, date_decoder())
  use time <- decode.field(1, time_decoder())
  decode.success(Timestamp(date, time))
}

pub type UserEntry {
  UserEntry(
    id: Int,
    user_id: Int,
    entry_id: Int,
    rating: Int,
    notes: String,
    watched_at: Option(Timestamp),
    status: sql.UserEntryStatus,
    progress: Int,
    created_at: Timestamp,
    updated_at: Timestamp,
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
    created_at: Timestamp,
    updated_at: Timestamp,
    foreign_id: String,
    release_date: Timestamp,
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
          timestamp_to_birl(user_entry.created_at)
            |> result.unwrap(birl.now())
            |> birl.to_unix
            |> json.int,
        ),
        #(
          "updated_at",
          timestamp_to_birl(user_entry.updated_at)
            |> result.unwrap(birl.now())
            |> birl.to_unix
            |> json.int,
        ),
      ],
      case user_entry.watched_at {
        option.Some(w) -> [
          #(
            "watched_at",
            timestamp_to_birl(w)
              |> result.unwrap(birl.now())
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
            |> timestamp_to_birl
            |> result.unwrap(birl.now())
            |> birl.to_unix,
          ),
        ),
        #(
          "updated_at",
          json.int(
            entry.updated_at
            |> timestamp_to_birl
            |> result.unwrap(birl.now())
            |> birl.to_unix,
          ),
        ),
        #("foreign_id", json.string(entry.foreign_id)),
        #(
          "release_date",
          json.int(
            entry.release_date
            |> timestamp_to_birl
            |> result.unwrap(birl.now())
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

pub fn timestamp_to_birl(a: Timestamp) {
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
}

pub fn pog_timestamp_to_timestamp(a: pog.Timestamp) {
  Timestamp(a.date |> pog_date_to_date, a.time |> pog_time_to_time)
}

pub fn pog_date_to_date(a: pog.Date) {
  Date(a.year, a.month, a.day)
}

pub fn pog_time_to_time(a: pog.Time) {
  Time(a.hours, a.minutes, a.seconds, a.microseconds)
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
