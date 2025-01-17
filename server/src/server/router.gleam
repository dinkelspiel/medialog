import server/routes/auth/login
import server/routes/user/entries

import wisp.{type Request, type Response}

pub type Router {
  Router(route: Route, project: String, route_folder: String, template: String)
}

pub type Route {
  Client(String)
  Server(fn(Request) -> Response)
  NotFound
}

pub fn router(path: List(String)) {
  case path {
    ["dashboard"] -> Client("dashboard.gleam")
    ["auth", "login"] -> Client("auth/login.gleam")
    ["auth", "signup"] -> Client("auth/signup.gleam")

    ["api", "auth", "login"] -> Server(login.login)
    ["api", "user", "entries"] -> Server(entries.entries)
    _ -> NotFound
  }
  |> Router(
    route: _,
    template: "index.html",
    route_folder: "client/routes/",
    project: "../client/",
  )
}
