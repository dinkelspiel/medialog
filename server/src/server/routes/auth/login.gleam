import gleam/json
import shared/api/request
import wisp.{type Request, type Response}
import gleam/result

pub fn login(req: Request) -> Response {
  use json <- wisp.require_json(req)

  let result = {
    use login <- result.try(request.decode_login(json))
    Ok(Nil)
  }

  case result {
    Ok(_) ->
      wisp.json_response(
        json.object([#("message", json.string("Logged in"))])
          |> json.to_string_tree,
        201,
      )
    Error(_) ->
      wisp.json_response(
        json.object([#("error", json.string("Error"))]) |> json.to_string_tree,
        400,
      )
  }
}
