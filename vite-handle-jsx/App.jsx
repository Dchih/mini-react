// js pragam
/**@jsx CReact.createElement */

import CReact from "./react/react.js";

function appWithJsx() {
  return (
    <div>
      hi-mini-react<div>!</div>
    </div>
  );
}

console.log(appWithJsx);

export const el = CReact.createElement("div", { id: "app" }, "app");

export const App = <div>hi-mini-react</div>;
