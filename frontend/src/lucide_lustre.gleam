import lustre/attribute.{type Attribute, attribute}
import lustre/element/svg

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
