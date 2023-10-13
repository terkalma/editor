import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor, $getSelection, $isRangeSelection, $isElementNode } from "lexical";
import { $patchStyleText, $setBlocksType, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { useCallback, useEffect, useState } from "react";
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6 } from "react-icons/lu";
import { BsTextParagraph, BsBlockquoteLeft } from "react-icons/bs";
import {
  BiFontFamily,
  BiFontSize,
  BiListOl,
  BiListUl,
  BiUnderline,
  BiAlignJustify,
  BiAlignLeft,
  BiAlignRight,
  BiAlignMiddle,
  BiBold,
  BiItalic,
  BiDockRight,
  BiDockLeft,
} from "react-icons/bi";
import {
  mergeRegister,
  $getNearestNodeOfType,
  $findMatchingParent,
} from "@lexical/utils";
import { INSERT_LAYOUT_COMMAND } from "./LayoutPlugin";
import Button from "../../components/Button";
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  $isRootOrShadowRoot,
  $createParagraphNode,
} from "lexical";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import ImageUpload from "../../components/ImageUpload";

import Dropdown from "../../components/Dropdown/Dropdown";
import type { Value } from "../../components/Dropdown/Dropdown";
import { IS_APPLE, getSelectedNode } from "./utils";

const BLOCK_TYPES = {
  paragraph: { label: "Normal", icon: <BsTextParagraph className="h-6 w-6" aria-hidden="true" /> },
  bullet: { label: "Bulleted List", icon: <BiListUl className="h-6 w-6" aria-hidden="true" /> },
  number: { label: "Numbered List", icon: <BiListOl className="h-6 w-6" aria-hidden="true" /> },
  h1: { label: "Heading 1", icon: <LuHeading1 className="h-6 w-6" aria-hidden="true" /> },
  h2: { label: "Heading 2", icon: <LuHeading2 className="h-6 w-6" aria-hidden="true" /> },
  h3: { label: "Heading 3", icon: <LuHeading3 className="h-6 w-6" aria-hidden="true" /> },
  h4: { label: "Heading 4", icon: <LuHeading4 className="h-6 w-6" aria-hidden="true" /> },
  h5: { label: "Heading 5", icon: <LuHeading5 className="h-6 w-6" aria-hidden="true" /> },
  h6: { label: "Heading 6", icon: <LuHeading6 className="h-6 w-6" aria-hidden="true" /> },
  quote: { label: "Quote", icon: <BsBlockquoteLeft className="h-6 w-6" aria-hidden="true" /> },
};

const COLORS = {
  default: "#374151",
  purple: "#bc95d4",
};

const FONT_SIZE_OPTIONS: Value[] = [
  { value: "10px", label: "10px" },
  { value: "11px", label: "11px" },
  { value: "12px", label: "12px" },
  { value: "13px", label: "13px" },
  { value: "14px", label: "14px" },
  { value: "15px", label: "15px" },
  { value: "16px", label: "16px" },
  { value: "17px", label: "17px" },
  { value: "18px", label: "18px" },
  { value: "19px", label: "19px" },
  { value: "20px", label: "20px" },
];

const FONT_FAMILY_OPTIONS: Value[] = [
  { value: "Arial", label: "Arial" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Verdana", label: "Verdana" },
];

const ELEMENT_FORMAT_OPTIONS: Value[] = [
  {
    icon: <BiAlignMiddle className="h-6 w-6" aria-hidden="true" />,
    value: "center",
    label: "Center",
  },
  {
    icon: <BiAlignJustify className="h-6 w-6" aria-hidden="true" />,
    value: "justify",
    label: "Justify",
  },
  {
    icon: <BiAlignLeft className="h-6 w-6" aria-hidden="true" />,
    value: "left",
    label: "Left",
  },
  {
    icon: <BiAlignRight className="h-6 w-6" aria-hidden="true" />,
    value: "right",
    label: "Right",
  },
];

function FontFamilyDropdown({ editor, currentValue }: { editor: LexicalEditor; currentValue?: string }) {
  const onOptionChange = useCallback(
    (option: Value) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            "font-family": option.value,
          });
        }
      });
    },
    [editor]
  );

  return (
    <Dropdown
      options={FONT_FAMILY_OPTIONS}
      currentValue={currentValue || "Arial"}
      onOptionChange={onOptionChange}
      btnLabel={() => <BiFontFamily className="h-6 w-6" aria-hidden="true" />}
    ></Dropdown>
  );
}

function FontSizeDropdown({ editor, currentValue }: { editor: LexicalEditor; currentValue?: string }) {
  const onOptionChange = useCallback(
    (option: Value) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            "font-size": option.value,
          });
        }
      });
    },
    [editor]
  );

  return (
    <Dropdown
      options={FONT_SIZE_OPTIONS}
      currentValue={currentValue ?? "16px"}
      onOptionChange={onOptionChange}
      btnClassName="rounded-tl-lg"
      btnLabel={() => <BiFontSize className="h-6 w-6" aria-hidden="true" />}
    ></Dropdown>
  );
}

function FormatDropdown({ editor, currentValue }: { editor: LexicalEditor; currentValue?: string }) {
  const onOptionChange = useCallback(
    (option: Value) => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, option.value as ElementFormatType);
    },
    [editor]
  );

  return (
    <Dropdown
      options={ELEMENT_FORMAT_OPTIONS}
      currentValue={currentValue || "left"}
      onOptionChange={onOptionChange}
      btnLabel={(value) => value.icon}
    ></Dropdown>
  );
}

function BlockFormatDropDown({
  editor,
  blockType,
}: {
  blockType: keyof typeof BLOCK_TYPES;
  // rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  currentValue?: string;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const options: Value[] = Object.keys(BLOCK_TYPES).map((key: string) => {
    const value = BLOCK_TYPES[key as keyof typeof BLOCK_TYPES];
    return {
      value: key,
      label: value.label,
      icon: value.icon,
    };
  });

  return (
    <Dropdown
      options={options}
      onOptionChange={(option: Value) => {
        switch (option.value) {
          case "paragraph":
            formatParagraph();
            break;
          case "h1":
            formatHeading("h1");
            break;
          case "h2":
            formatHeading("h2");
            break;
          case "h3":
            formatHeading("h3");
            break;
          case "h4":
            formatHeading("h4");
            break;
          case "h5":
            formatHeading("h5");
            break;
          case "h6":
            formatHeading("h6");
            break;
          case "bullet":
            formatBulletList();
            break;
          case "number":
            formatNumberedList();
            break;
          case "quote":
            formatQuote();
            break;
          default:
            break;
        }
      }}
      currentValue={blockType || "normal"}
      btnLabel={(value) => value.icon}
    />
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState<keyof typeof BLOCK_TYPES>("paragraph");
  const [fontColor, setFontColor] = useState<string>(COLORS.default);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [format, setFormat] = useState<string>("left");

  const [fontSize, setFontSize] = useState<string>("15px");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      setFontColor($getSelectionStyleValueForProperty(selection, "color", COLORS.default));
      setFontSize($getSelectionStyleValueForProperty(selection, "font-size", "15px"));
      setFontFamily($getSelectionStyleValueForProperty(selection, "font-family", "Arial"));
      setFormat($getSelectionStyleValueForProperty(selection, "format", "left"));

      const anchorNode = selection.anchor.getNode();
      const elementKey = anchorNode.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          if (type in BLOCK_TYPES) {
            setBlockType(type as keyof typeof BLOCK_TYPES);
          }
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in BLOCK_TYPES) {
            setBlockType(type as keyof typeof BLOCK_TYPES);
          }
        }
      }

      if (elementDOM != null) {
        if ($isListNode(anchorNode)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : anchorNode.getListType();
          setBlockType(type as keyof typeof BLOCK_TYPES);
        } else {
          const type = $isHeadingNode(anchorNode) ? anchorNode.getTag() : anchorNode.getType();
          if (type in BLOCK_TYPES) {
            setBlockType(type as keyof typeof BLOCK_TYPES);
          }
        }
      }

      setFormat(($isElementNode(node) ? node.getFormatType() : parent?.getFormatType()) || "left");
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [$updateToolbar, activeEditor, editor]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [activeEditor]
  );

  return (
    <>
      <div className="flex flex-wrap w-full text-gray-700 bg-gray-100">
        <div className="rounded-tl-lg flex-initial border-[0.5px] border-gray-400">
          <div className="flex">
            <div className="flex-initial">
              <FontSizeDropdown editor={activeEditor} currentValue={fontSize} />
            </div>
            <div className="flex-initial">
              <FontFamilyDropdown editor={activeEditor} currentValue={fontFamily} />
            </div>
          </div>
        </div>
        <div className="flex-initial border-[0.5px] border-gray-400">
          <Button
            title={"Default color"}
            onClick={() => {
              applyStyleText({ color: COLORS.default });
            }}
            isActive={fontColor == COLORS.default}
          >
            <span className={`h-6 w-6`} style={{ backgroundColor: COLORS.default }}></span>
          </Button>
          <Button
            title={"Purple Purple Purple"}
            onClick={() => {
              applyStyleText({ color: COLORS.purple });
            }}
            isActive={fontColor == COLORS.purple}
          >
            <span className={`h-6 w-6`} style={{ backgroundColor: COLORS.purple }}></span>
          </Button>
        </div>

        <div className="flex-initial border-[0.5px] border-gray-400">
          <div className="flex">
            <div className="flex-initial">
              <FormatDropdown editor={activeEditor} currentValue={format} />
            </div>
            {activeEditor === editor && (
              <div className="flex-initial">
                <BlockFormatDropDown editor={editor} blockType={blockType} />
              </div>
            )}
          </div>
        </div>
        <div className="flex-initial border-[0.5px] border-gray-400">
          <Button
            title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            isActive={isBold}
          >
            <BiBold className="h-6 w-6" />
          </Button>
          <Button
            title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            isActive={isUnderline}
          >
            <BiUnderline className="h-6 w-6" />
          </Button>
          <Button
            title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            isActive={isItalic}
          >
            <BiItalic className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-initial border-[0.5px] border-gray-400">
          <Button
            title={"Sidebar Right"}
            onClick={() => {
              activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, "grow shrink");
            }}
            isActive={false}
          >
            <BiDockRight className="h-6 w-6" aria-hidden="true" />
          </Button>
          <Button
            title={"Sidebar Left"}
            onClick={() => {
              activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, "shrink grow");
            }}
            isActive={false}
          >
            <BiDockLeft className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="flex-initial border-[0.5px] border-gray-400">
          <ImageUpload editor={activeEditor} />
        </div>
      </div>
    </>
  );
}
