import { describe, it, expect, beforeAll, vi } from "vitest";
import React from "../react";

beforeAll(() => {
  vi.useFakeTimers({ toFake: ["requestIdleCallback"] });
});

describe("should create vdom", () => {
  it("<div>hi</div>", () => {
    const el = React.createElement("div", null, "hi");
    expect(el).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "hi",
              children: [],
            },
          },
        ],
      },
    });
  });

  it("test by snapshot", () => {
    const el = React.createElement("div", { id: "app" }, "hi");
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `);
  });
});
