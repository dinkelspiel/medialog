import components/button
import components/popover
import glailwind_merge.{tw_merge}
import gleam/dynamic
import gleam/float
import gleam/int
import gleam/io
import gleam/list
import gleam/result
import lib/dom
import lucide_lustre.{
  command, ellipsis, grip_vertical, library, panel_left, search,
}
import lustre
import lustre/attribute.{class}
import lustre/effect
import lustre/element
import lustre/element/html.{button, div, h4, input, p, text}
import lustre/event
import lustre_http

pub fn register() {
  let page = lustre.application(init, update, view)
  let assert Ok(_) = lustre.register(page, "route-dashboard")
}

pub type Model {
  Model(sidebar_open: Bool, columns: Int, columns_grab_x: Int, grabbing: Bool)
}

pub type Msg {
  RequestToggleSidebar
  RequestModifyMediaColumns(columns: Int)
  RequestUpdateColumnsGrabX(grab_x: Int)
  RequestGrab(grab: Bool)
}

fn init(_flags) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(sidebar_open: True, columns: 4, columns_grab_x: 0, grabbing: False),
    effect.none(),
  )
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    RequestToggleSidebar -> #(
      Model(..model, sidebar_open: !model.sidebar_open),
      effect.none(),
    )
    RequestModifyMediaColumns(columns) -> #(
      Model(..model, columns:),
      effect.none(),
    )
    RequestUpdateColumnsGrabX(columns_grab_x) -> #(
      Model(..model, columns_grab_x:),
      effect.none(),
    )
    RequestGrab(grab) -> #(Model(..model, grabbing: grab), effect.none())
    _ -> #(model, effect.none())
  }
}

fn request_modify_media_columns(event) -> Result(Msg, List(dynamic.DecodeError)) {
  use x <- result.try(dynamic.field("clientX", dynamic.int)(event))
  use y <- result.try(dynamic.field("clientY", dynamic.int)(event))
  use target <- result.try(dynamic.field("target", dynamic.dynamic)(event))

  io.debug(target)

  let bounding_rect = dom.get_bounding_client_rect(target)
  let media_container = dom.get_media_container()

  io.debug(media_container)
  io.debug(float.round(media_container.left) - x)

  Ok(RequestUpdateColumnsGrabX(x - float.round(media_container.left)))
}

fn for(value: a, amount: Int) {
  do_for(value, amount, [])
}

fn do_for(value: a, amount: Int, acc: List(a)) -> List(a) {
  case amount {
    amount if amount == 0 -> acc
    _ -> do_for(value, amount - 1, [value, ..acc])
  }
}

pub fn view(model: Model) -> element.Element(Msg) {
  div(
    [
      class(
        glailwind_merge.tw_merge([
          "grid grid-cols-[230px,1fr] transition-all duration-300 bg-zinc-50 w-screen min-h-screen",
          case model.sidebar_open {
            True -> ""
            False -> "grid-cols-[0px,1fr]"
          },
        ]),
      ),
    ],
    [
      div(
        [
          class(
            tw_merge([
              "border-e overflow-x-clip transition-all duration-300 border-e-zinc-200 flex flex-col py-4 gap-3",
              case model.sidebar_open {
                True -> "px-3"
                False -> "px-0"
              },
            ]),
          ),
        ],
        [
          div(
            [
              class(
                "flex px-0.5 justify-between items-center pb-[11px] border-b border-b-zinc-300 border-dashed",
              ),
            ],
            [
              div([class("flex gap-3 items-center")], [
                div(
                  [
                    class(
                      "size-[26px] rounded-md shadow-sm border border-zinc-200 bg-white p-0.5",
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
                div([class("text-sm font-semibold")], [text("Medialog")]),
              ]),
              button.button(
                [ellipsis([class("stroke-zinc-400 size-4")])],
                [attribute.attribute("popovertarget", "popper")],
                ["w-8"],
                button.Ghost,
              ),
              div(
                [
                  attribute.attribute("popover", ""),
                  attribute.id("popper"),
                  class(
                    "bg-transparent overflow-visible left-[200px] -translate-x-1/2 top-[52px] absolute m-0",
                  ),
                ],
                [
                  div(
                    [
                      class(
                        "w-max p-4 flex flex-col bg-white h-max rounded-md shadow-md border",
                      ),
                    ],
                    [
                      div([class("space-y-2")], [
                        h4([popover.popover_header()], [
                          text("Willem Dinkelspiel"),
                        ]),
                        p([popover.popover_description()], [
                          text("mail@keii.dev"),
                        ]),
                      ]),
                    ],
                  ),
                ],
              ),
            ],
          ),
          div([class("flex flex-col")], [
            button.button(
              [lucide_lustre.house([class("stroke-zinc-600")]), text("Home")],
              [],
              ["justify-start"],
              button.Outline,
            ),
            button.button(
              [lucide_lustre.list([class("stroke-zinc-600")]), text("Lists")],
              [],
              ["justify-start"],
              button.Ghost,
            ),
            button.button(
              [
                lucide_lustre.users_round([class("stroke-zinc-600")]),
                text("Community"),
              ],
              [],
              ["justify-start"],
              button.Ghost,
            ),
          ]),
        ],
      ),
      div([class("grid grid-rows-[58px,1fr]")], [
        div(
          [
            class(
              "border-b border-b-zinc-200 grid grid-cols-[1fr_minmax(min-content,_285px)_1fr] items-center ps-2 pe-4 py-3 pe-[300px]",
            ),
          ],
          [
            div([class("flex gap-[6px] items-center")], [
              // panel_left([class("size-4 stroke-zinc-400")]),
              button.button(
                [panel_left([class("size-4 stroke-zinc-400")])],
                [event.on_click(RequestToggleSidebar)],
                ["px-0 w-8"],
                button.Ghost,
              ),
              div([class("text-zinc-400 font-[525] text-sm")], [
                text("My Media"),
              ]),
            ]),
            div([class("relative")], [
              div(
                [
                  class(
                    "absolute rounded w-full flex items-center h-[34px] justify-between p-2 pointer-events-none",
                  ),
                ],
                [
                  div([class("flex items-center gap-2")], [
                    search([class("size-4 stroke-zinc-400")]),
                  ]),
                  div(
                    [
                      class(
                        "rounded-full border border-zinc-200 bg-zinc-100 w-8 h-5 flex gap-[1px] text-xs items-center text-zinc-600 font-medium justify-center",
                      ),
                    ],
                    [command([class("size-3 stroke-zinc-600")]), text("K")],
                  ),
                ],
              ),
              html.input([
                attribute.placeholder("Search"),
                class(
                  "rounded-full outline-none focus:ring-offset-2 focus:ring-2 transition-[box-shadow] duration-200 ps-8 pe-[44px] flex w-full border-zinc-200 items-center border h-[34px] justify-between p-2 placeholder-zinc-400 text-sm",
                ),
              ]),
            ]),
            div([], []),
          ],
        ),
        div([class("grid grid-cols-[1fr,300px]")], [
          div([class("flex justify-center")], [
            div([attribute.id("media-container")], [
              div(
                [
                  class(
                    "h-[calc(100vh-58px)] absolute top-[58px] group flex items-center",
                  ),
                ],
                [
                  div(
                    [
                      class(
                        "w-[1px] pointer-events-none transition-opacity duration-200 bg-zinc-200 absolute -translate-x-1/2 h-[calc(100vh-58px)] group-hover:opacity-100 opacity-0",
                      ),
                      attribute.style([
                        #("left", int.to_string(model.columns_grab_x) <> "px"),
                      ]),
                    ],
                    [],
                  ),
                  button.button(
                    [grip_vertical([class("cursor-pointer")])],
                    [
                      event.on("mousedown", request_modify_media_columns),
                      attribute.style([
                        #("left", int.to_string(model.columns_grab_x) <> "px"),
                      ]),
                    ],
                    ["px-0 py-2 h-min absolute -translate-x-1/2 [&_svg]:size-3"],
                    button.Secondary,
                  ),
                ],
              ),
              div(
                [
                  class("grid gap-3 p-3"),
                  attribute.style([
                    #(
                      "grid-template-columns",
                      "repeat("
                        <> int.to_string(model.columns)
                        <> ", minmax(0, 1fr));",
                    ),
                  ]),
                ],
                div([class("w-[148px] h-[223px] bg-blue-500")], []) |> for(12),
              ),
            ]),
          ]),
          div([class("border-s border-s-zinc-200 flex flex-col gap-3 p-3")], [
            div(
              [
                class(
                  "rounded-md border border-zinc-200 sadow-sm bg-white px-6 py-4",
                ),
              ],
              [],
            ),
          ]),
        ]),
      ]),
    ],
  )
}
