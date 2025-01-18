import gleam/dict
import gleam/http/response
import gleam/io
import gleam/list
import gleam/result
import pog
import server/db
import squirrel/sql
import wisp.{type Request, type Response}

pub fn is_authenticated(
  request req: Request,
  callback cb: fn(sql.GetUserByIdRow) -> Result(a, String),
) {
  let result = {
    use session_token <- result.try({
      case dict.from_list(req.headers) |> dict.get("authorization") {
        Ok("Bearer " <> session_token) -> Ok(session_token)
        _ ->
          case wisp.get_cookie(req, "mlSessionToken", wisp.PlainText) {
            Ok(session_token) -> Ok(session_token)
            Error(_) -> Error("Authentication cookie not found")
          }
      }
    })

    use db_conn <- db.get_connection()
    use pog.Returned(_, sessions) <- result.try(
      sql.get_session_by_token(db_conn, session_token)
      |> result.replace_error("Couldn't get session from db"),
    )
    // If list.first fails we know the list was empty and therefor the token wasn't there
    use session <- result.try(
      list.first(sessions)
      |> result.replace_error("No session found with token"),
    )
    use pog.Returned(_, users) <- result.try(
      sql.get_user_by_id(db_conn, session.user_id)
      |> result.replace_error("Couldn't get users from db"),
    )
    use user <- result.try(
      list.first(users) |> result.replace_error("No user found with token"),
    )

    Ok(user)
  }

  case result {
    Ok(user) -> cb(user)
    Error(error) -> Error(error)
  }
}
