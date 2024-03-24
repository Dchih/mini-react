import React from "./react";

export default {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container);
      },
    };
  },
};
