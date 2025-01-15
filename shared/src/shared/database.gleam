import gleam/dynamic
import gleam/dynamic/decode
import gleam/float
import gleam/option.{type Option}
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

pub fn user_entry_decoder() -> decode.Decoder(UserEntry) {
  use id <- decode.field("id", decode.int)
  use user_id <- decode.field("user_id", decode.int)
  use entry_id <- decode.field("entry_id", decode.int)
  use rating <- decode.field("rating", decode.int)
  use notes <- decode.field("notes", decode.string)
  use watched_at <- decode.field(
    "watched_at",
    decode.optional(timestamp_decoder()),
  )
  use status <- decode.field("status", user_entry_status_decoder())
  use progress <- decode.field("progress", decode.int)
  use created_at <- decode.field("created_at", timestamp_decoder())
  use updated_at <- decode.field("updated_at", timestamp_decoder())
  decode.success(UserEntry(
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
    row.id,
    row.user_id,
    row.entry_id,
    row.rating,
    row.notes,
    row.watched_at |> option.map(fn(a) { pog_timestamp_to_timestamp(a) }),
    row.status,
    row.progress,
    row.created_at |> pog_timestamp_to_timestamp,
    row.updated_at |> pog_timestamp_to_timestamp,
  )
}
