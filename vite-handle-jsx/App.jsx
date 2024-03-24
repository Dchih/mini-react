import { createElement } from "./react/react.js";

function appWithJsx() {
  return (
    <div>
      hi-mini-react<div>!</div>
    </div>
  );
}

console.log(appWithJsx);

export const el = createElement("div", { id: "app" }, "app");
