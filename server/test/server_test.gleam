import birl
import birl/duration
import gleam/io
import gleeunit
import gleeunit/should

pub fn main() {
  gleeunit.main()
}

// gleeunit test functions end in `_test`
pub fn hello_world_test() {
  birl.add(birl.now(), duration.months(6))
  |> io.debug
  1
  |> should.equal(2)
}
