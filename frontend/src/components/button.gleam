import glailwind_merge
import lustre/attribute
import lustre/element
import lustre/element/html

pub type ButtonVariant {
  Default
  Secondary
  Outline
  Ghost
}

pub fn button(
  children: List(element.Element(a)),
  attrs: List(attribute.Attribute(a)),
  classes: List(String),
  variant: ButtonVariant,
) {
  html.button(
    [
      attribute.class(
        glailwind_merge.tw_merge([
          "h-[31px] px-3 py-1 inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          case variant {
            Default ->
              "bg-primary text-primary-foreground shadow hover:bg-primary/90"
            Secondary ->
              "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
            Outline ->
              "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            Ghost ->
              "hover:bg-accent hover:text-accent-foreground border border-transparent"
          },
          ..classes
        ]),
      ),
      ..attrs
    ],
    children,
  )
}
