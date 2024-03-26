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
        return typeof child === "string" || typeof child === "number"
          ? createTextNode(child)
          : child;
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
  root = unitWork;
  requestIdleCallback(workLoop);
}

function commitFiber(fiber) {
  mountElement(fiber.child);
  root = null;
}

function mountElement(fiber) {
  if (!fiber) return;
  let parent = fiber.parent;
  while (!parent.dom) {
    parent = parent.parent;
  }
  if (fiber.dom) parent.dom.append(fiber.dom);
  mountElement(fiber.child);
  mountElement(fiber.subling);
}

let unitWork = null;
let root = null;
function workLoop(IdleDeadLine) {
  while (IdleDeadLine.timeRemaining() > 0 && unitWork) {
    unitWork = performWorkOfUnit(unitWork);
  }
  if (!unitWork && root !== null) {
    commitFiber(root);
  }
  requestIdleCallback(workLoop);
}

// 把DOM树处理成子任务
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.subling) {
    return fiber.subling;
  }
  while (fiber.parent) {
    if (fiber.parent.subling) return fiber.parent.subling;
    fiber = fiber.parent;
  }
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = initElement(fiber));
    addProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  convertTree2List(fiber, children);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  convertTree2List(fiber, children);
}

function initElement(fiber) {
  return fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);
}

function addProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function convertTree2List(fiber, children) {
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

export default {
  render,
  createElement,
};
