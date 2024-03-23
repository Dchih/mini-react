function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  el.props.children.forEach((child) => {
    render(child, container);
  });

  container.append(dom);
}

export default {
  createRoot(container) {
    return {
      render(App) {
        render(App, container);
      },
    };
  },
};
