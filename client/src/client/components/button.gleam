import gleam/list
import lustre/attribute.{class}
import lustre/element/html.{div}

pub type Button {
  Primary
  Ghost
}

pub fn button(type_: Button, attributes, children) {
  div(
    list.flatten([
      [
        class(
          "px-3 py-1 rounded-lg border flex gap-4 items-center tracking-[-0.7px] cursor-pointer transition-all duration-200 text-sm font-[525]",
        ),
      ],
      case type_ {
        Primary -> [
          class(
            "border-zinc-200 bg-white shadow-sm text-zinc-900 hover:bg-zinc-50",
          ),
        ]
        Ghost -> [class("border-transparent hover:bg-zinc-100 text-zinc-600")]
      },
      attributes,
    ]),
    children,
  )
}
