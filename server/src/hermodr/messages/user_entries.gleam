import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/result
import pog
import server/db
import server/middleware/authenticated
import shared/api
import shared/database
import squirrel/sql
import wisp.{type Request}

pub fn get(req: Request) -> Result(List(api.UserEntryEntry), String) {
  use auth_user <- authenticated.is_authenticated(req)

  use db_conn <- db.get_connection
  use pog.Returned(_, rows) <- result.try(
    sql.get_user_entries_by_user_id(db_conn, auth_user.id)
    |> result.replace_error("Failed to get user_entries from db"),
  )

  Ok(
    list.map(rows, fn(user_entry) {
      api.UserEntryEntry(
        user_entry
          |> database.get_user_entries_by_user_id_to_user_entry,
        user_entry |> database.get_user_entries_by_user_id_to_entry,
      )
    }),
  )
}

pub fn get_encoder(uees: List(api.UserEntryEntry)) {
  json.array(uees, fn(uee) {
    json.object([
      #("user_entry", database.user_entry_encoder(uee.user_entry)),
      #("entry", database.entry_encoder(uee.entry)),
    ])
  })
}
