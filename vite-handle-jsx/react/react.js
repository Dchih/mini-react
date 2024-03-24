function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      // nodeValue 不是随便取名！！！
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
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

function render(el, container) {
  unitWork = {
    dom: container,
    props: {
      children: [el],
    },
  };
  requestIdleCallback(workLoop);
}

let unitWork = null;
function workLoop(IdleDeadLine) {
  while (IdleDeadLine.timeRemaining() > 0 && unitWork) {
    // do extra task
    unitWork = performWorkOfUnit(unitWork);
  }
  requestIdleCallback(workLoop);
}

function initElement(fiber) {
  return node.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(node.type);
}

function addProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function convertTree2List(fiber) {
  const children = fiber.props.children;
  let prevChild;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      subling: null,
    };
    if (index === 0) {
      fiber.child = newWork;
    } else {
      prevChild.subling = newWork;
    }
    prevChild = newWork;
  });
}

function decideReturn(self, fiber) {
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.subling) {
    return fiber.subling;
  }
}

function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = initElement(fiber));
    fiber.parent.dom.append(dom);
    addProps(dom, fiber.props);
  }
  convertTree2List(fiber);
  return decideReturn(null, fiber);
}

export default {
  render,
  createElement,
};
