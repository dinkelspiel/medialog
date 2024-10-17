import gleam/dynamic
import gleam/int
import gleam/list
import lustre
import lustre/attribute
import lustre/effect
import lustre/element
import lustre/element/html
import lustre/event
import lustre_http
import routes/dashboard

pub fn main() {
  let assert Ok(_) = dashboard.register()

  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)

  Nil
}

pub type Model {
  Model
}

pub type Msg

fn init(_flags) -> #(Model, effect.Effect(Msg)) {
  #(Model, effect.none())
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    _ -> #(model, effect.none())
  }
}

pub fn view(model: Model) -> element.Element(Msg) {
  html.div([], [element.element("route-dashboard", [], [])])
}
