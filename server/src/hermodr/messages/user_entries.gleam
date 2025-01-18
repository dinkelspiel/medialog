import gleam/json
import gleam/list
import gleam/result
import pog
import server/db
import server/middleware/authenticated
import shared/database
import squirrel/sql
import wisp.{type Request}

pub fn get(
  req: Request,
) -> Result(List(#(database.UserEntry, database.Entry)), String) {
  use auth_user <- authenticated.is_authenticated(req)

  use db_conn <- db.get_connection
  use pog.Returned(_, rows) <- result.try(
    sql.get_user_entries_by_user_id(db_conn, auth_user.id)
    |> result.replace_error("Failed to get user_entries from db"),
  )

  Ok(
    list.map(rows, fn(user_entry) {
      #(
        user_entry
          |> database.get_user_entries_by_user_id_to_user_entry,
        user_entry |> database.get_user_entries_by_user_id_to_entry,
      )
    }),
  )
}
