import { DOMRect } from "./dom.mjs";

export const getBoundingClientRect = (target) => {
  return new DOMRect(
    target.x,
    target.y,
    target.width,
    target.height,
    target.top,
    target.right,
    target.bottom,
    target.left
  );
};

export const getMediaContainer = () => {
  const routeDashboard = document.getElementsByTagName("route-dashboard");
  const mediaContainer = document.getElementById("media-container");

  console.log(document);

  return getBoundingClientRect(mediaContainer);
};
