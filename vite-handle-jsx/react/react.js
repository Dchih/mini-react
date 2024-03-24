export function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      // nodeValue 不是随便取名！！！
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // react props 可以取到 children
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

export default {
  createElement,
  createTextNode,
};
