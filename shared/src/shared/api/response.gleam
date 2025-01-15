import gleam/option

pub type ApiData

pub type ApiResponse {
  ApiResponse(exit_code: Int, message: String, data: option.Option(ApiData))
}
