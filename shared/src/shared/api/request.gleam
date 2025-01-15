import gleam/dynamic
import gleam/dynamic/decode

pub type ApiRequest {
  Login(email: String, password: String)
}

pub fn decode_login(request_body: dynamic.Dynamic) {
  let decoder = {
    use email <- decode.field("email", decode.string)
    use password <- decode.field("password", decode.string)
    decode.success(Login(email:, password:))
  }
  decode.run(request_body, decoder)
}
