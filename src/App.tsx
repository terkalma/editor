import "./App.css";
// import Button from "./components/Button";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor from "./editor/Editor";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LayoutContainerNode } from "./editor/nodes/LayoutContainerNode";
import { LayoutItemNode } from "./editor/nodes/LayoutItemNode";
import { ImageNode } from "./editor/nodes/ImageNode";

function App() {
  return (
    <>
      <div className="p-2 mx-auto max-w-prose bg-[faff0b]">
        <LexicalComposer
          initialConfig={{
            editorState: null,
            nodes: [
              AutoLinkNode,
              LinkNode,
              HeadingNode,
              ListNode,
              ListItemNode,
              QuoteNode,
              LayoutContainerNode,
              LayoutItemNode,
              ImageNode,
            ],
            namespace: "cimbirodalom",
            onError: (error: Error) => {
              throw error;
            },
            theme: {
              quote: "not-italic",
              text: {
                underline: "underline",
              },
              image: 'editor-image',
              layoutItem: "min-w-[20%] border border-gray-400 border-dashed",
              layoutContainer: "flex space-x-4"
            },
          }}
        >
          <div className="block border-gray-400 border-[0.5px] rounded-lg">
            <Editor />
          </div>
        </LexicalComposer>
      </div>
    </>
  );
}

export default App;
