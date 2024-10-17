import gleam/dynamic
import gleam/int
import gleam/list
import lucide_lustre.{library}
import lustre
import lustre/attribute.{class}
import lustre/effect
import lustre/element
import lustre/element/html.{div}
import lustre/event
import lustre_http

pub fn register() {
  let page = lustre.application(init, update, view)
  let assert Ok(_) = lustre.register(page, "route-dashboard")
}

pub type Model {
  Model(count: Int, cats: List(String))
}

pub type Msg

fn init(_flags) -> #(Model, effect.Effect(Msg)) {
  #(Model(0, []), effect.none())
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    _ -> #(model, effect.none())
  }
}

pub fn view(model: Model) -> element.Element(Msg) {
  div([class("grid grid-cols-[230px,1fr] bg-zinc-50 w-screen min-h-screen")], [
    div([class("border-e border-e-zinc-200 flex flex-col px-3 py-4")], [
      div([class("flex px-0.5")], [
        div(
          [
            class(
              "size-[26px] rounded-md border border-zinc-200 bg-white p-0.5",
            ),
          ],
          [
            div(
              [
                class(
                  "rounded bg-black w-full h-full flex items-center justify-center",
                ),
              ],
              [library([class("stroke-white size-4")])],
            ),
          ],
        ),
      ]),
    ]),
    div([class("grid grid-rows-[58px,1fr]")], [
      div([class("border-b border-b-zinc-200")], []),
      div([class("grid grid-cols-[1fr,300px]")], [
        div([], []),
        div([class("border-s border-s-zinc-200")], []),
      ]),
    ]),
  ])
}
