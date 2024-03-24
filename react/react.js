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
}

let unitWork = null;
function workLoop(IdleDeadLine) {
  while (IdleDeadLine.timeRemaining() > 0) {
    // do extra task
    unitWork = performWorkOfUnit(unitWork);
  }
  requestIdleCallback(workLoop);
}

function initElement(node) {
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

function convertTree2List(work) {
  const children = work.props.children;
  let prevChild;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      parent: work,
      child: null,
      subling: null,
    };
    if (index === 0) {
      work.child = newWork;
    } else {
      prevChild.subling = newWork;
    }
    prevChild = newWork;
  });
}

function decideReturn(work) {
  if (work.child) {
    return work.child;
  }
  if (work.subling) {
    return work.subling;
  }
  return work.parent?.subling;
}

function performWorkOfUnit(work) {
  if (!work.dom) {
    const dom = (work.dom = initElement(work));
    work.parent.dom.append(dom);
    addProps(dom, work.props);
  }
  convertTree2List(work);
  return decideReturn(work);
}

requestIdleCallback(workLoop);

export const react = {
  render,
  createElement,
};
