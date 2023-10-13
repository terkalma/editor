/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMConversionMap, EditorConfig, LexicalNode, SerializedElementNode, Spread } from "lexical";

import { addClassNamesToElement } from "@lexical/utils";
import { ElementNode, NodeKey } from "lexical";

export type SerializedLayoutItemNode = Spread<
  {
    nodeType: string;
  },
  SerializedElementNode
>;

export class LayoutItemNode extends ElementNode {
  __nodeType: string;

  constructor(nodeType: string, key?: NodeKey) {
    super(key);
    this.__nodeType = nodeType;
  }

  static getType(): string {
    return "layout-item";
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__nodeType, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    if (typeof config.theme.layoutItem === "string") {
      addClassNamesToElement(dom, [config.theme.layoutItem, this.__nodeType].join(" "));
    } else {
      addClassNamesToElement(dom, this.__nodeType);
    }
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(json: SerializedLayoutItemNode): LayoutItemNode {
    return $createLayoutItemNode(json.nodeType);
  }

  isShadowRoot(): boolean {
    return true;
  }

  exportJSON(): SerializedLayoutItemNode {
    return {
      ...super.exportJSON(),
      type: "layout-item",
      nodeType: this.__nodeType,
      version: 1,
    };
  }

  setNodeType(nodeType: string) {
    const self = this.getWritable();
    self.__nodeType = nodeType;
  }

  getNodeType(): string {
    const self = this.getLatest();
    return self.__nodeType;
  }
}

export function $createLayoutItemNode(nodeType: string): LayoutItemNode {
  return new LayoutItemNode(nodeType);
}

export function $isLayoutItemNode(node: LexicalNode | null | undefined): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
