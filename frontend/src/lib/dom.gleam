import gleam/dynamic

pub type DOMRect {
  DOMRect(
    x: Float,
    y: Float,
    width: Float,
    height: Float,
    top: Float,
    right: Float,
    bottom: Float,
    left: Float,
  )
}

@external(javascript, "./dom_ffi.mjs", "getBoundingClientRect")
pub fn get_bounding_client_rect(target: dynamic.Dynamic) -> DOMRect

@external(javascript, "./dom_ffi.mjs", "getMediaContainer")
pub fn get_media_container() -> DOMRect

@external(javascript, "./dom_ffi.mjs", "getMainContainer")
pub fn get_main_container() -> DOMRect
