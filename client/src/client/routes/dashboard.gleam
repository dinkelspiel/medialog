import client
import client/components/button.{Ghost, Primary, button}
import dropdown_menu
import gleam/http.{Get}
import gleam/http/request
import gleam/io
import gleam/json
import gleam/list
import gleam/option
import gleam/order
import hermodr/messages/user_entries
import lucide_lustre.{ellipsis, house, library, panel_left, users_round, x}
import lustre
import lustre/attribute.{attribute, class}
import lustre/effect
import lustre/element.{type Element}
import lustre/element/html.{div, text}
import lustre/event
import popcicle
import rsvp
import shared/api
import shared/api/response
import shared/database

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", 0)

  Nil
}

type Model {
  Model(sidebar_open: Bool, user_entries: List(api.UserEntryEntry), edit_media_open: Bool, edit_media: option.Option(api.UserEntryEntry))
}

fn init(_: Int) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(sidebar_open: True, user_entries: [], edit_media_open: False, edit_media: option.None),
    user_entries.get(ApiReturnedUserEntries),
  )
}

pub opaque type Msg {
  UserToggledSidebar
  UserUpdatedEditMediaOpen(Bool, option.Option(api.UserEntryEntry))
  ApiReturnedUserEntries(
    Result(user_entries.HermodrResponse(List(api.UserEntryEntry)), rsvp.Error),
  )
}

fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    UserToggledSidebar -> #(
      Model(..model, sidebar_open: !model.sidebar_open),
      effect.none(),
    )
    UserUpdatedEditMediaOpen(open, uee) -> #(
      Model(..model, edit_media_open: open, edit_media: uee),
      effect.none()
    )
    ApiReturnedUserEntries(response) ->
      case response {
        Ok(user_entries.SuccessResponse(_, data)) -> #(
          Model(..model, user_entries: data),
          effect.none(),
        )
        _ -> {
          let _ = io.debug(response)
          client.redirect("/auth/login")
          #(model, effect.none())
        }
      }
  }
}

fn view(model: Model) -> Element(Msg) {
  use <- popcicle.initialize(popcicle.default_config())

  div(
    [
      class(
        "grid min-h-screen divide-x divide-x-zinc-200 grid-cols-[min-content,1fr]",
      ),
    ],
    [
      div(
        [
          class(
            "flex flex-col py-4 gap-3 overflow-clip transition-all duration-200 "
            <> case model.sidebar_open {
              True -> "w-[220px] px-3"
              False -> "p-0 w-0"
            },
          ),
        ],
        [
          div(
            [
              class(
                "pb-4 border-b border-dashed flex justify-between items-center",
              ),
            ],
            [
              div(
                [
                  class(
                    "flex gap-3 font-semibold text-sm tracking-[-0.7px] items-center",
                  ),
                ],
                [
                  div(
                    [
                      class(
                        "size-[26px] rounded-md shadow-sm border border-zinc-200 p-0.5",
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
                  text("Medialog"),
                ],
              ),
              dropdown_menu.dropdown_menu(
                button(Ghost, [], [ellipsis([class("size-4 stroke-zinc-400")])]),
                popcicle.BottomCenter,
                [],
                [
                  dropdown_menu.label([], [text("My Account")]),
                  dropdown_menu.separator([]),
                  dropdown_menu.item([], [
                    text("Profile"),
                    dropdown_menu.shortcut([], [text("⇧⌘P")]),
                  ]),
                  dropdown_menu.item([], [
                    text("Billing"),
                    dropdown_menu.shortcut([], [text("⌘B")]),
                  ]),
                  dropdown_menu.item([], [
                    text("Settings"),
                    dropdown_menu.shortcut([], [text("⌘S")]),
                  ]),
                  dropdown_menu.item([], [
                    text("Keyboard shortcuts"),
                    dropdown_menu.shortcut([], [text("⌘K")]),
                  ]),
                  dropdown_menu.separator([]),
                  dropdown_menu.item([], [text("Team")]),
                  dropdown_menu.dropdown_menu(
                    dropdown_menu.item([class("justify-between")], [
                      text("Invite users"),
                      lucide_lustre.chevron_right([]),
                    ]),
                    popcicle.RightBottom,
                    [class("!w-28")],
                    [
                      dropdown_menu.item([], [text("Email")]),
                      dropdown_menu.item([], [text("Message")]),
                      dropdown_menu.separator([]),
                      dropdown_menu.item([], [text("More...")]),
                    ],
                    popcicle.Hover,
                  ),
                  dropdown_menu.item([], [
                    text("New Team"),
                    dropdown_menu.shortcut([], [text("⌘+T")]),
                  ]),
                  dropdown_menu.separator([]),
                  dropdown_menu.item([], [text("GitHub")]),
                  dropdown_menu.item([], [text("Support")]),
                  dropdown_menu.item([attribute.disabled(True)], [text("API")]),
                  dropdown_menu.separator([]),
                  dropdown_menu.item([], [
                    text("Log out"),
                    dropdown_menu.shortcut([], [text("⇧⌘Q")]),
                  ]),
                ],
                popcicle.Click,
              ),
            ],
          ),
          div([], [
            div([], [
              button(Primary, [], [
                house([class("size-[18px] stroke-zinc-600")]),
                text("Home"),
              ]),
            ]),
            div([], [
              button(Ghost, [], [
                users_round([class("size-[18px] stroke-zinc-600")]),
                text("Community"),
              ]),
            ]),
          ]),
        ],
      ),
      div([class("grid grid-rows-[58px,1fr] divide-y divide-y-zinc-200")], [
        div([class("ps-1 pe-4 flex items-center")], [
          div([class("flex gap-1 items-center")], [
            button(Ghost, [event.on_click(UserToggledSidebar)], [
              panel_left([class("stroke-zinc-400 size-4")]),
            ]),
            div([class("font-[525] text-xs text-zinc-400")], [text("My Media")]),
          ]),
        ]),
        div(
          [
            class(
              "grid grid-cols-[1fr,295px] divide-x divide-x-zinc-200 overflow-scroll h-[calc(100vh-58px)]",
            ),
          ],
          [
            div([class("w-full flex justify-center")], [
              div(
                [class("grid grid-cols-4 gap-3 p-3 w-fit h-fit")],
                model.user_entries
                  |> list.sort(fn(a, b) {
                    case
                      a.user_entry.rating < b.user_entry.rating,
                      a.user_entry.rating == b.user_entry.rating
                    {
                      _, True -> order.Eq
                      True, _ -> order.Lt
                      False, _ -> order.Gt
                    }
                  })
                  |> list.reverse
                  |> list.map(fn(user_entry) {
                    div(
                      [
                        class(
                          "w-[148px] h-[223px] rounded-md bg-cover border border-zinc-200 shadow-sm",
                        ),
                        attribute.style([
                          #(
                            "background-image",
                            "url(" <> user_entry.entry.poster_path <> ")",
                          ),
                        ]),
                        event.on_click(UserUpdatedEditMediaOpen(True, option.Some(user_entry)))
                      ],
                      [],
                    )
                  }),
              ),
            ]),
            div([class("p-3")], []),
          ],
        ),
      ]),
      div(
        [
          class(
            "w-[100dvw] fixed top-0 left-0 h-[100dvh] bg-[#000000cc] duration-200 transition-opacity "
            <> case model.edit_media_open {
              True -> "opacity-100"
              False -> "pointer-events-none opacity-0"
            },
          ),
        ],
        [
          div(
            [
              class(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[425px]",
              ),
            ],
            [
              html.button(
                [
                  class(
                    "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                  ),
                  event.on_click(UserUpdatedEditMediaOpen(False, option.None))
                ],
                [
                  x([popcicle.close_on_click(True), class("size-4")]),
                  div([class("sr-only")], [text("Close dialog")]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )
}
