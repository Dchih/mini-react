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
  currentRoot = root;
  root = null;
}

function mountElement(fiber) {
  if (!fiber) return;
  let parent = fiber.parent;
  while (!parent.dom) {
    parent = parent.parent;
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      parent.dom.append(fiber.dom);
    }
  }

  mountElement(fiber.child);
  mountElement(fiber.subling);
}

let unitWork = null;
let root = null;
let currentRoot = null;
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
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function initElement(fiber) {
  return fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);
}

function updateProps(dom, nextProps, prevProps) {
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  Object.keys(nextProps).forEach((key) => {
    if (nextProps[key] !== prevProps[key]) {
      if (key.startsWith("on") > 0) {
        const eventName = key.slice(2).toLowerCase();
        dom.removeEventListener(eventName, nextProps[key]);
        dom.addEventListener(eventName, nextProps[key]);
      } else if (key !== "children") {
        dom[key] = nextProps[key];
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber;
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        subling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        subling: null,
        effectTag: "placement",
        alternate: null,
      };
    }

    if (oldFiber) {
      oldFiber = oldFiber.subling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.subling = newFiber;
    }
    prevChild = newFiber;
  });
}

function update() {
  unitWork = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  root = unitWork;
}

export default {
  update,
  render,
  createElement,
};
