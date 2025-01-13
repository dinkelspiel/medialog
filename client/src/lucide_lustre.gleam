import lustre/attribute.{type Attribute, attribute}
import lustre/element/svg

pub fn book(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.path([
        attribute(
          "d",
          "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        ),
      ]),
    ],
  )
}

pub fn ellipsis(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.circle([
        attribute("r", "1"),
        attribute("cy", "12"),
        attribute("cx", "12"),
      ]),
      svg.circle([
        attribute("r", "1"),
        attribute("cy", "12"),
        attribute("cx", "19"),
      ]),
      svg.circle([
        attribute("r", "1"),
        attribute("cy", "12"),
        attribute("cx", "5"),
      ]),
    ],
  )
}

pub fn house(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.path([attribute("d", "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8")]),
      svg.path([
        attribute(
          "d",
          "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        ),
      ]),
    ],
  )
}

pub fn library(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.path([attribute("d", "m16 6 4 14")]),
      svg.path([attribute("d", "M12 6v14")]),
      svg.path([attribute("d", "M8 8v12")]),
      svg.path([attribute("d", "M4 4v16")]),
    ],
  )
}

pub fn panel_left(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.rect([
        attribute("rx", "2"),
        attribute("y", "3"),
        attribute("x", "3"),
        attribute("height", "18"),
        attribute("width", "18"),
      ]),
      svg.path([attribute("d", "M9 3v18")]),
    ],
  )
}

pub fn users_round(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.path([attribute("d", "M18 21a8 8 0 0 0-16 0")]),
      svg.circle([
        attribute("r", "5"),
        attribute("cy", "8"),
        attribute("cx", "10"),
      ]),
      svg.path([attribute("d", "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3")]),
    ],
  )
}

pub fn x(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [
      svg.path([attribute("d", "M18 6 6 18")]),
      svg.path([attribute("d", "m6 6 12 12")]),
    ],
  )
}

pub fn chevron_right(attributes: List(Attribute(a))) {
  svg.svg(
    [
      attribute("stroke-linejoin", "round"),
      attribute("stroke-linecap", "round"),
      attribute("stroke-width", "2"),
      attribute("stroke", "currentColor"),
      attribute("fill", "none"),
      attribute("viewBox", "0 0 24 24"),
      attribute("height", "24"),
      attribute("width", "24"),
      ..attributes
    ],
    [svg.path([attribute("d", "m9 18 6-6-6-6")])],
  )
}
