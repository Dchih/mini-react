// js pragam
/**@jsx CReact.createElement */

import CReact from "./react/react.js";

function Wrapper() {
  return <AppWithJsx></AppWithJsx>;
}
let count = 10;
function handleClick() {
  count++;
  CReact.update();
}
function AppWithJsx({ num }) {
  return (
    <div>
      AppWithJsx: {count} <button onClick={handleClick}>click</button>
    </div>
  );
}

// export const el = CReact.createElement("div", { id: "app" }, "app");

export const App = (
  <div>
    hi-mini-react
    <AppWithJsx num={10}></AppWithJsx>
  </div>
);
