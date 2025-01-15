import gleam/option

pub type ApiResponse(a) {
  ApiResponse(message: String, data: option.Option(a))
}

pub type ApiSession {
  ApiSession(session_token: String)
}
