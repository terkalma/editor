import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export default function LexicalContentEditable({
  spellCheck = true,
  className = "",
}: {
  spellCheck?: boolean;
  className?: string;
}): JSX.Element {
  const classNames = ["prose prose-p:m-0", "leading-6", "prose-blockquoate:my-0", "prose-li:my-0", "prose-ol:my-0", "prose-ul:my-0"];

  if (className) {
    classNames.push(className);
  }


  return (
    <ContentEditable spellCheck={spellCheck} className={`${classNames.join(' ')} contentEditable min-h-[400px] block p-2 outline-none`} />
  );
}
