import build
import gleam/erlang/process
import mist
import server/wisp_router
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()
  let secret_key_base = wisp.random_string(64)

  build.main()

  let assert Ok(_) =
    wisp_mist.handler(wisp_router.handle_request, secret_key_base)
    |> mist.new
    |> mist.port(8000)
    |> mist.start_http

  process.sleep_forever()
}
