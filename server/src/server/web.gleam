import wisp

pub fn middleware(
  req: wisp.Request,
  handle_request: fn(wisp.Request) -> wisp.Response,
) -> wisp.Response {
  let req = wisp.method_override(req)
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)
  use <- wisp.serve_static(req, under: "/priv/build", from: "./build/routes")
  use <- wisp.serve_static(
    req,
    under: "/priv/static",
    from: "../client/priv/static",
  )

  handle_request(req)
}
