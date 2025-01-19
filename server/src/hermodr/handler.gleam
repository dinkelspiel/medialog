import gleam/json
import wisp.{type Request, type Response}

pub fn into_handler(
  message: fn(Request) -> Result(a, String),
  encoder: fn(a) -> json.Json,
) -> fn(Request) -> Response {
  fn(request) {
    let result = message(request)
    case result {
      Ok(value) ->
        wisp.json_response(
          json.object([
            #("message", json.string("Success")),
            #("data", encoder(value)),
          ])
            |> json.to_string_tree,
          200,
        )
      Error(error) ->
        wisp.json_response(
          json.object([#("error", json.string(error))]) |> json.to_string_tree,
          400,
        )
    }
  }
}
