import "./App.css";
// import Button from "./components/Button";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor from "./editor/Editor";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";

function App() {
  return (
    <>
      <div className="p-2 mx-auto max-w-prose">
        <LexicalComposer
          initialConfig={{
            editorState: null,
            nodes: [AutoLinkNode, LinkNode, HeadingNode, ListNode, ListItemNode, QuoteNode],
            namespace: "cimbirodalom",
            onError: (error: Error) => {
              throw error;
            },
            theme: {
              quote: "not-italic",
              text: {
                underline: "underline"
              }
            }
          }}
        >
          <div className="block">
            <Editor />
          </div>
        </LexicalComposer>
      </div>
    </>
  );
}

export default App;
