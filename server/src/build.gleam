import gleamyshell
import gleam/io
import gleam/list
import gleam/result
import simplifile

pub fn main()
{
  let res = {
    use _ <- result.try(gleamyshell.execute("gleam", in: "../client", args: ["build"]) |> result.replace_error("Failed to build Gleam"))
    use files <- result.try(simplifile.get_files("../client/build/dev/javascript/client/routes") |> result.replace_error("Failed to get routes"))
    list.map(files, fn(file) {
      gleamyshell.execute("esbuild", in: ".", args)    
    })
  }
}

