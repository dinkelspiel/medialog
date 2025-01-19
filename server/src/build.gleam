import gleam/bool
import gleam/io
import gleam/list
import gleam/result
import gleam/string
import gleam_community/ansi
import gleamyshell
import server/router as route
import simplifile

pub fn main() {
  let router = route.router([])

  let res = {
    io.println("Compiling clients..." |> ansi.blue())
    use _ <- result.try(
      gleamyshell.execute("rm", in: ".", args: ["-rf", "./build/routes"])
      |> io.debug
      |> result.replace_error("Failed to remove ./build/routes"),
    )
    use build_result <- result.try(
      gleamyshell.execute("gleam", in: router.project, args: ["build"])
      |> io.debug
      |> result.replace_error("Failed executing gleam build"),
    )
    use <- bool.guard(
      build_result.exit_code != 0,
      Error("Failed to build client:\n" <> build_result.output),
    )

    use files <- result.try(
      simplifile.get_files(
        router.project <> "build/dev/javascript/client/client/routes",
      )
      |> io.debug
      |> result.replace_error("Failed to get routes"),
    )
    let _ = simplifile.create_directory_all("./build/routes")
    list.map(files, fn(file) {
      let route = string.split(file, router.route_folder)
      let assert Ok(route) = list.last(route)
      let assert Ok(contents) = simplifile.read(file)
      let _ = simplifile.write(file, contents <> "; main();")

      let _ =
        gleamyshell.execute("esbuild", in: ".", args: [
          file,
          "--bundle",
          "--minify",
          "--outfile=./build/routes/" <> route,
        ])
        |> io.debug
      let assert Ok(css_route) = list.first(string.split(route, "."))
      let css_route = css_route <> ".css"

      let _ =
        gleamyshell.execute("tailwind", in: ".", args: [
          file,
          "--input=" <> router.project <> "priv/static/styles.css",
          "--minify",
          "--content=./build/routes/" <> route,
          "--output=./build/routes/" <> css_route,
        ])
        |> io.debug
    })

    Ok("Successfully compiled client")
  }

  case res {
    Ok(msg) -> io.println("✅ " <> ansi.green(msg))
    Error(msg) -> io.println("❌ " <> ansi.red(msg))
  }
}
