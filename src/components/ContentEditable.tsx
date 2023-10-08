import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export default function LexicalContentEditable(): JSX.Element {
  const proseStyles = ["prose prose-p:m-0", "leading-6", "prose-blockquoate:my-0", "prose-li:my-0", "prose-ol:my-0", "prose-ul:my-0"].join(
    " "
  );

  return (
    <ContentEditable spellCheck={false} className={`${proseStyles} contentEditable min-h-[100px] block border-0 p-2 outline-none`} />
  );
}
