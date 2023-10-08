import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ContentEditable from "../components/ContentEditable";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

export default function Editor(): JSX.Element {
  return (
    <>
      <div>
        <ToolbarPlugin />
        <TabFocusPlugin />
        <AutoFocusPlugin />
        <AutoLinkPlugin />
        <ListPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="min-h-[100px] relative flex">
              <div className="resize-y relative flex-auto">
                <ContentEditable />
              </div>
            </div>
          }
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </>
  );
}
