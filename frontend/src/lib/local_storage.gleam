import gleam/int

pub fn set_requested_columns_grab_x(value: Int) {
  do_set_local_storage("requested_columns_grab_x", value)
}

pub fn get_requested_columns_grab_x() {
  int.parse(do_get_local_storage("requested_columns_grab_x"))
}

@external(javascript, "./local_storage_ffi.mjs", "setLocalStorage")
fn do_set_local_storage(key: String, value: a) -> Nil

@external(javascript, "./local_storage_ffi.mjs", "getLocalStorage")
fn do_get_local_storage(key: String) -> String
