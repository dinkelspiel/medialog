import gleam/list
import gleam/string
import gleam/string_tree
import server/router
import server/web
import simplifile
import wisp.{type Request, type Response}

pub fn handle_request(req: Request) -> Response {
  use req <- web.middleware(req)

  let router = wisp.path_segments(req) |> router.router()

  case router.route {
    router.Client(route) -> {
      let assert Ok(route) = string.split(route, ".") |> list.first
      let assert Ok(html) = simplifile.read(router.project <> router.template)
      wisp.ok()
      |> wisp.html_body(
        html
        |> string.replace("{build_css}", "/priv/build/" <> route <> ".css")
        |> string.replace("{build_js}", "/priv/build/" <> route <> ".mjs")
        |> string_tree.from_string,
      )
    }
    router.Server(cb) -> cb(req)
    router.NotFound -> wisp.not_found()
  }
}
