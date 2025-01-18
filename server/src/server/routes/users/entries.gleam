import beecrypt
import birl
import birl/duration
import gleam/bool
import gleam/dict
import gleam/io
import gleam/json
import gleam/list
import gleam/result
import pog
import server/db
import server/middleware/authenticated
import server/token
import shared/api/request
import shared/database
import squirrel/sql
import wisp.{type Request, type Response}

pub fn entries(req: Request) -> Response {
  use json <- wisp.require_json(req)

  let result = {
    use auth_user <- authenticated.is_authenticated(req)

    use db_conn <- db.get_connection
    use pog.Returned(_, rows) <- result.try(
      sql.get_user_entries_by_user_id(db_conn, auth_user.id)
      |> result.replace_error("Failed to get user_entries from db"),
    )

    Ok(rows)
  }

  case result {
    Ok(rows) ->
      wisp.json_response(
        json.object([
          #("message", json.string("Successfully retrieved user entries by id")),
          #(
            "data",
            json.array(rows, fn(user_entry) {
              json.array(
                [
                  database.user_entry_encoder(
                    user_entry
                    |> database.get_user_entries_by_user_id_to_user_entry,
                  ),
                  database.entry_encoder(
                    user_entry |> database.get_user_entries_by_user_id_to_entry,
                  ),
                ],
                fn(a) { a },
              )
            }),
          ),
        ])
          |> json.to_string_tree,
        201,
      )
    Error(error) ->
      wisp.json_response(
        json.object([#("error", json.string(error))]) |> json.to_string_tree,
        400,
      )
  }
}
