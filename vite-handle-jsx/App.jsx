// js pragam
/**@jsx CReact.createElement */

import CReact from "./react/react.js";

function Wrapper() {
  return <AppWithJsx></AppWithJsx>;
}

function AppWithJsx({ num }) {
  return <div>AppWithJsx: {num}</div>;
}

// export const el = CReact.createElement("div", { id: "app" }, "app");

export const App = (
  <div>
    hi-mini-react
    <AppWithJsx num={10}></AppWithJsx>
    <AppWithJsx num={10}></AppWithJsx>
  </div>
);
