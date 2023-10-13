import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ContentEditable from "../components/ContentEditable";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import Button from "../components/Button";
import { useRef, useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LayoutPlugin } from "./plugins/LayoutPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { BiSave } from "react-icons/bi";

const URL = "https://m68xvkf5l0.execute-api.eu-central-1.amazonaws.com/prod";

export default function Editor(): JSX.Element {
  const editorStateRef = useRef<EditorState>();
  const [editor] = useLexicalComposerContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const saveState = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    if (editorStateRef?.current) {
      await fetch(`${URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editorStateRef?.current.toJSON()),
      }).finally(() => {
        setIsSaving(false);
      });
    }
  };

  useEffect(() => {
    if (isFirstRender && editor) {
      setIsFirstRender(false);
      fetch(`${URL}/get`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(({ data }) => {
          const initialEditorState = editor.parseEditorState(data);
          editor.setEditorState(initialEditorState);
        });
    }
  }, [isFirstRender, editor]);

  return (
    <>
      <div>
        <ToolbarPlugin />
        <TabIndentationPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <AutoLinkPlugin />
        <ListPlugin />
        <LayoutPlugin />
        <ImagesPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="min-h-[400px] relative flex">
              <div className="resize-y relative flex-auto">
                <ContentEditable />
              </div>
            </div>
          }
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            // console.log(editorState.toJSON());
            editorStateRef.current = editorState;
          }}
        />
      </div>
      <div className="border-t-[0.5px] border-gray-400"></div>
      <div className="bg-gray-100 flex justify-end h-10 w-full text-gray-700">
        <div>
          <Button onClick={saveState} isActive={false} classNames={["rounded-br-lg"]}>
            <BiSave className="h-6 w-6" />
            <span className="ml-1">Save</span>
          </Button>
        </div>
      </div>
    </>
  );
}
