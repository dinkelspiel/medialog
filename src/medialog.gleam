import dropdown_menu
import gleam/dynamic
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import lucide_lustre.{book, ellipsis, house, library, panel_left, users_round, x}
import lustre
import lustre/attribute.{attribute, class}
import lustre/effect
import lustre/element.{type Element}
import lustre/element/html.{div, text}
import lustre/event
import plinth/browser/element as pl_element
import popcicle

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", 0)

  Nil
}

type Model {
  Model(sidebar_open: Bool)
}

fn init(_: Int) -> #(Model, effect.Effect(Msg)) {
  #(Model(sidebar_open: True), effect.none())
}

pub opaque type Msg {
  UserToggledSidebar
}

fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    UserToggledSidebar -> #(
      Model(..model, sidebar_open: !model.sidebar_open),
      effect.none(),
    )
  }
}

type Button {
  Primary
  Ghost
}

fn button(type_: Button, attributes, children) {
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
        div([class("grid grid-cols-[1fr,295px] divide-x divide-x-zinc-200")], [
          div([class("w-full flex justify-center")], [
            div([class("grid grid-cols-4 gap-3 p-3 w-fit h-fit")], [
              popcicle.popcicle(
                div([class("w-[148px] h-[223px] rounded-md bg-red-500")], []),
                popcicle.Custom(0, 0),
                div(
                  [
                    class(
                      "w-[100dvw] fixed top-0 left-0 h-[100dvh] bg-[#000000cc]",
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
                          ],
                          [x([popcicle.close_on_click(True), class("size-4")])],
                        ),
                      ],
                    ),
                  ],
                ),
                popcicle.Click,
              ),
              popcicle.popcicle(
                div([class("w-[148px] h-[223px] rounded-md bg-red-500")], []),
                popcicle.BottomCenter,
                text("Test"),
                popcicle.Click,
              ),
              popcicle.popcicle(
                div([class("w-[148px] h-[223px] rounded-md bg-red-500")], []),
                popcicle.BottomCenter,
                text("Test"),
                popcicle.Click,
              ),
              popcicle.popcicle(
                div([class("w-[148px] h-[223px] rounded-md bg-red-500")], []),
                popcicle.BottomCenter,
                text("Test"),
                popcicle.Click,
              ),
              popcicle.popcicle(
                div([class("w-[148px] h-[223px] rounded-md bg-red-500")], []),
                popcicle.BottomCenter,
                text("Test"),
                popcicle.Click,
              ),
            ]),
          ]),
          div([class("p-3")], []),
        ]),
      ]),
    ],
  )
}
