import components/button
import components/popover
import glailwind_merge.{tw_merge}
import gleam/bool
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
import lustre/element/html.{button, div, h4, input, main, p, text}
import lustre/event
import lustre_http
import plinth/browser/window

pub fn register() {
  let page = lustre.application(init, update, view)
  let assert Ok(_) = lustre.register(page, "route-dashboard")
}

pub type Model {
  Model(sidebar_open: Bool, columns: Int, columns_grab_x: Int, grabbing: Bool)
}

pub type Msg {
  RequestToggleSidebar
  RequestUpdateColumnsGrabX(grab_x: Int)
  RequestGrab(grab: Bool)
}

fn init(_flags) -> #(Model, effect.Effect(Msg)) {
  #(
    Model(sidebar_open: True, columns: 4, columns_grab_x: 0, grabbing: False),
    effect.from(fn(dispatch) {
      window.add_event_listener("resize", fn(_) {
        dispatch(RequestUpdateColumnsGrabX(0))
        Nil
      })
      window.add_event_listener("load", fn(_) {
        dispatch(RequestGrab(False))
        Nil
      })
    }),
  )
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    RequestToggleSidebar -> #(
      Model(..model, sidebar_open: !model.sidebar_open),
      effect.none(),
    )
    RequestUpdateColumnsGrabX(columns_grab_x) -> {
      let x = int.to_float(columns_grab_x) |> float.absolute_value

      let columns =
        { x -. { { x /. 148.0 *. 2.0 -. 1.0 } *. 12.0 } } /. 148.0 *. 2.0
        |> float.round

      let main_container_width = dom.get_main_container().width -. 24.0
      let max_columns =
        float.floor({ main_container_width +. 12.0 } /. { 148.0 +. 12.0 })
        |> float.round

      #(
        Model(
          ..model,
          columns_grab_x:,
          columns: int.clamp(columns, 1, max_columns),
        ),
        effect.none(),
      )
    }
    RequestGrab(grab) -> {
      let media_container = dom.get_media_container()
      case grab {
        False -> #(
          Model(
            ..model,
            grabbing: grab,
            columns_grab_x: case model.columns_grab_x > 0 {
              True -> float.round(media_container.width /. 2.0)
              False -> float.round(media_container.width /. 2.0) * -1
            },
          ),
          effect.none(),
        )
        True -> #(Model(..model, grabbing: grab), effect.none())
      }
    }
    _ -> #(model, effect.none())
  }
}

fn request_modify_media_columns(
  model: Model,
  event,
) -> Result(Msg, List(dynamic.DecodeError)) {
  use <- bool.guard(!model.grabbing, Error([]))

  use x <- result.try(dynamic.field("clientX", dynamic.int)(event))
  let media_container = dom.get_media_container()
  let value = x - float.round(media_container.x +. media_container.width /. 2.0)

  // let value = case
  //   int.absolute_value(value) < float.round(media_container.width) / 2
  // {
  //   True -> value
  //   False -> float.round(media_container.width) / 2
  // }

  Ok(RequestUpdateColumnsGrabX(value))
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
      event.on("mouseup", fn(_) { Ok(RequestGrab(False)) }),
      event.on("mousemove", fn(event) {
        request_modify_media_columns(model, event)
      }),
      class(
        glailwind_merge.tw_merge([
          "grid grid-cols-[230px,1fr] transition-all duration-300 bg-zinc-50 min-h-screen",
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
          main([class("flex justify-center"), attribute.id("main")], [
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
                    event.on("mousedown", fn(_) { Ok(RequestGrab(True)) }),
                    attribute.style([
                      #("left", int.to_string(model.columns_grab_x) <> "px"),
                    ]),
                  ],
                  [
                    "px-0 py-2 h-min absolute -translate-x-1/2 [&_svg]:size-3 group-hover:opacity-100 opacity-50 transition-opacity duration-200",
                  ],
                  button.Secondary,
                ),
              ],
            ),
            div([attribute.id("media-container")], [
              div(
                [
                  class(
                    "grid gap-3 p-3 transition-[grid-template-columns] duration-500 ease-in-out",
                  ),
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
