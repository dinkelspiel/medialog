import client/components/button.{button}
import client/components/input.{input}
import dropdown_menu
import gleam/dynamic
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/io
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import lucide_lustre.{ellipsis, house, library, panel_left, users_round, x}
import lustre
import lustre/attribute.{attribute, class, href}
import lustre/effect
import lustre/element.{type Element}
import lustre/element/html.{a, div, h1, span, text}
import lustre/event
import plinth/browser/element as pl_element
import popcicle
import rsvp
import shared/database

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", 0)

  Nil
}

type Model {
  Model(
    email: String,
    password: String,
    user_entries: AsyncResult(List(database.UserEntry), String),
  )
}

type AsyncResult(ok, err) {
  Pending
  Output(Result(ok, err))
}

fn init(_: Int) -> #(Model, effect.Effect(Msg)) {
  #(Model(email: "", password: "", user_entries: Pending), effect.none())
}

pub opaque type Msg {
  UserRequestedLogin
  UserUpdatedEmail(String)
  UserUpdatedPassword(String)
  ApiCreatedSession(Result(List(database.UserEntry), rsvp.Error))
}

fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    UserRequestedLogin -> #(
      model,
      rsvp.post(
        "/api/auth/login",
        json.object([]),
        rsvp.expect_json(
          decode.list(database.user_entry_decoder()),
          ApiCreatedSession,
        ),
      ),
    )
    UserUpdatedEmail(email) -> #(Model(..model, email:), effect.none())
    UserUpdatedPassword(password) -> #(Model(..model, password:), effect.none())
    ApiCreatedSession(user_entries) -> #(
      Model(
        ..model,
        user_entries: Output(
          user_entries |> result.replace_error("Failed to parse data"),
        ),
      ),
      effect.none(),
    )
  }
}

fn view(model: Model) -> Element(Msg) {
  use <- popcicle.initialize(popcicle.default_config())

  div([class("min-h-screen w-screen flex justify-center items-center")], [
    div([class("max-w-[350px] flex flex-col gap-8")], [
      div([class("flex flex-col gap-2")], [
        div([class("size-[44px] flex justify-center items-center")], [
          div(
            [
              class(
                "size-[26px] scale-[1.69230769231] rounded-md shadow-sm border border-zinc-200 p-0.5 mb-2",
              ),
            ],
            [
              div(
                [
                  class(
                    "bg-zinc-900 w-full h-full flex justify-center items-center rounded-[4px]",
                  ),
                ],
                [library([class("stroke-white size-[14px]")])],
              ),
            ],
          ),
        ]),
        h1([class("font-bold text-[22px] tracking-[-0.4px]")], [
          text("Login to Medialog"),
        ]),
        span([class("text-zinc-400 text-sm tracking-[-0.4px]")], [
          text("Welcome to "),
          html.i([], [text("your")]),
          text(" website for rating Movies, Books, and TV Shows"),
        ]),
      ]),
      div([class("flex flex-col gap-4")], [
        div([class("flex flex-col gap-2")], [
          input(input.Primary, [
            attribute.placeholder("Email"),
            attribute.type_("email"),
            event.on_input(UserUpdatedEmail),
          ]),
          input(input.Primary, [
            attribute.placeholder("Password"),
            attribute.type_("password"),
            event.on_input(UserUpdatedPassword),
          ]),
        ]),
        button(button.Primary, [class("justify-center")], [text("Log in")]),
        span([], [
          span([class("text-sm tracking-[-0.4px]")], [
            span([class("text-zinc-400")], [text("Don't have an account? ")]),
            a([class("text-primary"), href("/auth/signup")], [text("Sign up")]),
          ]),
        ]),
      ]),
    ]),
  ])
}
