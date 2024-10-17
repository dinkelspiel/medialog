import lustre/attribute
import lustre/element/html

pub fn button() {
  html.button(
    [
      attribute.class(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 px-4 py-2",
      ),
    ],
    [html.text("Test")],
  )
}
