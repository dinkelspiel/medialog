import { DOMRect } from "./dom.mjs";

export const getBoundingClientRect = (element) => {
  return new DOMRect(
    element.x,
    element.y,
    element.width,
    element.height,
    element.top,
    element.right,
    element.bottom,
    element.left
  );
};

export const getMediaContainer = () => {
  const mediaContainer = document
    .getElementsByTagName("route-dashboard")[0]
    .shadowRoot.getElementById("media-container");

  return getBoundingClientRect(mediaContainer.getBoundingClientRect());
};
