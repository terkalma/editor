type Props = {
  title?: string;
  onClick: () => void;
  isActive: boolean;
  children?: React.ReactNode;
};

export default function Button({
    title, onClick, isActive, children
}: Props) {
  return (
    <button
        onClick={onClick}
        className={`flex max-w-[200px] h-10 cursor-pointer items-cente px-2 py-2 transition-all hover:bg-[#dddddd] ${
            isActive ? "bg-[#dddddd]" : "bg-white"
        }`}
        title={title}
        type="button"
        aria-label={title}
    >
        {children}
    </button>
  );
}
