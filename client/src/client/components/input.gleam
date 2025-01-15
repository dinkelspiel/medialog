import gleam/list
import lustre/attribute.{class}
import lustre/element/html

pub type Input {
  Primary
}

pub fn input(type_: Input, attributes) {
  html.input(
    list.flatten([
      [
        class(
          "flex h-8 w-full rounded-lg bg-neutral-200/50 px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        ),
      ],
      case type_ {
        Primary -> [class("")]
      },
      attributes,
    ]),
  )
}
