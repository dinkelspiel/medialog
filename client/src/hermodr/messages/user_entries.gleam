import gleam/dynamic/decode
import rsvp
import shared/api
import shared/database

pub fn get_decoder() {
  use entry <- decode.field("entry", database.entry_decoder())
  use user_entry <- decode.field("user_entry", database.user_entry_decoder())
  decode.success(api.UserEntryEntry(user_entry:, entry:))
}

pub type HermodrResponse(a) {
  SuccessResponse(message: String, data: a)
  ErrorResponse(message: String, data: a)
}

pub fn hermodr_decoder(data_decoder) {
  use message <- decode.field("message", decode.string)
  use data <- decode.field("data", data_decoder)
  decode.success(SuccessResponse(message:, data:))
}

pub fn get(message) {
  rsvp.get(
    "/api/users/entries",
    rsvp.expect_json(hermodr_decoder(decode.list(get_decoder())), message),
  )
}
