import gleam/dynamic
import gleam/dynamic/decode
import gleam/option

pub type ApiData

pub type ApiResponse {
  SuccessResponse(exit_code: Int, message: String, data: option.Option(ApiData))
  ErrorResponse(exit_code: Int, error: String)
}

pub fn optional_string_decoder() -> decode.Decoder(option.Option(String)) {
  decode.new_primitive_decoder("Optional String", fn(data) {
    case dynamic.string(data) {
      Ok(x) -> Ok(option.Some(x))
      Error(_) -> Error(option.None)
    }
  })
}

pub fn decode_api_response() {
  let decoder = {
    use message <- decode.optional_field(
      "message",
      option.None,
      optional_string_decoder(),
    )
    use error <- decode.optional_field(
      "error",
      option.None,
      optional_string_decoder(),
    )

    case message {
      option.Some(message) ->
        SuccessResponse(exit_code: 0, message:, data: option.None)
      option.None ->
        case error {
          option.Some(error) -> ErrorResponse(exit_code: 0, error:)
          option.None ->
            panic as "Can't parse api response without message or error"
        }
    }
    |> decode.success
  }
}
