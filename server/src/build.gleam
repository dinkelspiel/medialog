import gleam/io
import gleam/list
import gleam/result
import gleam/string
import gleam_community/ansi
import gleamyshell
import simplifile

pub fn main() {
  let res = {
    use _ <- result.try(
      gleamyshell.execute("gleam", in: "../client", args: ["clean"])
      |> result.replace_error("Failed to clean client"),
    )
    use _ <- result.try(
      gleamyshell.execute("gleam", in: "../client", args: ["build"])
      |> result.replace_error("Failed to build Gleam"),
    )
    use files <- result.try(
      simplifile.get_files("../client/build/dev/javascript/client/routes")
      |> result.replace_error("Failed to get routes"),
    )
    let _ = simplifile.create_directory_all("./build/routes")
    list.map(files, fn(file) {
      let route = string.split(file, "/routes")
      let assert Ok(route) = list.last(route)
      let assert Ok(contents) = simplifile.read(file)
      let _ = simplifile.write(file, contents <> "; main();")

      let _ =
        gleamyshell.execute("esbuild", in: ".", args: [
          file,
          "--bundle",
          "--minify",
          "--outfile=./build/routes" <> route,
        ])

      let assert Ok(css_route) = list.first(string.split(route, "."))
      let css_route = css_route <> ".css"

      let _ =
        gleamyshell.execute("tailwind", in: ".", args: [
          file,
          "--input=../client/priv/static/styles.css",
          "--minify",
          "--content=./build/routes" <> route,
          "--output=./build/routes" <> css_route,
        ])
    })

    Ok("Successfully compiled routes")
  }

  case res {
    Ok(msg) -> io.println("✅ " <> ansi.green(msg))
    Error(msg) -> io.println("❌ " <> ansi.red(msg))
  }
}
