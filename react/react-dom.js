import React from "./react.js";

export default {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container);
      },
    };
  },
};
