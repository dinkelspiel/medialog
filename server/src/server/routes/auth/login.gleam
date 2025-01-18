import beecrypt
import birl
import birl/duration
import gleam/bool
import gleam/dict
import gleam/int
import gleam/io
import gleam/json
import gleam/list
import gleam/result
import pog
import server/db
import server/token
import shared/api/request
import squirrel/sql
import wisp.{type Request, type Response}

pub fn login(req: Request) -> Response {
  use json <- wisp.require_json(req)

  let result = {
    use db_conn <- db.get_connection
    use login <- result.try(
      request.decode_login(json)
      |> result.replace_error("Body must contain email and password"),
    )
    use pog.Returned(_, rows) <- result.try(
      sql.get_user_by_email(db_conn, login.email)
      |> result.replace_error("Couldn't get user by email from db"),
    )

    // If list.first fails we know no user was found so we fail
    use user <- result.try(
      list.first(rows)
      |> io.debug
      |> result.replace_error("Invalid email or password"),
    )
    use <- bool.guard(
      !beecrypt.verify(login.password, user.password),
      Error("Invalid email or password"),
    )
    let token = token.generate_token(64)

    let in_6_months = birl.add(birl.utc_now(), duration.months(6))
    let date = birl.get_day(in_6_months)
    let time_of_day = birl.get_time_of_day(in_6_months)
    let expiry =
      pog.Timestamp(
        pog.Date(date.year, date.month, date.date),
        pog.Time(
          time_of_day.hour,
          time_of_day.minute,
          time_of_day.second,
          time_of_day.milli_second * 1000,
        ),
      )

    let ip_address =
      dict.get(dict.from_list(req.headers), "x-forwarded-for")
      |> result.unwrap("127.0.0.1")

    let user_agent =
      dict.get(dict.from_list(req.headers), "User-Agent")
      |> result.unwrap("No user agent found")

    use _ <- result.try(
      sql.create_session(
        db_conn,
        token,
        user.id,
        expiry,
        ip_address,
        user_agent,
      )
      |> result.replace_error("Failed to create session"),
    )

    Ok(token)
  }

  case result {
    Ok(token) ->
      wisp.json_response(
        json.object([#("message", json.string("Successfully logged in"))])
          |> json.to_string_tree,
        201,
      )
      |> wisp.set_cookie(
        req,
        "mlSessionToken",
        token,
        wisp.PlainText,
        60 * 60 * 24 * 1000,
      )
    Error(error) ->
      wisp.json_response(
        json.object([#("error", json.string(error))]) |> json.to_string_tree,
        400,
      )
  }
}
