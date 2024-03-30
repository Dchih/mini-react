// js pragam
/**@jsx CReact.createElement */

import CReact from "./react/react.js";

function Wrapper() {
  return <AppWithJsx></AppWithJsx>;
}

let showBar = true;
function AppWithJsx({ num }) {
  const Foo = function Foo() {
    return <div>Foo</div>;
  };
  const Bar = <p>Bar</p>;
  function handleClick() {
    showBar = !showBar;
    CReact.update();
  }
  return (
    <div>
      {/* AppWithJsx: {showBar ? Bar : Foo} */}
      AppWithJsx: {showBar ? Bar : <Foo></Foo>}
      <button onClick={handleClick}>click</button>
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
