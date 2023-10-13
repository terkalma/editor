type Props = {
  title?: string;
  onClick: () => void;
  isActive: boolean;
  children?: React.ReactNode;
  classNames?: string[];
  color?: string;
};

export default function Button({
    title, onClick, isActive, children, classNames = [], color = "bg-gray-100",
}: Props) {
  return (
    <button
        onClick={onClick}
        className={`inline-flex justify-center max-w-[200px] h-10 cursor-pointer px-2 py-2 transition-all hover:bg-gray-400 ${
            isActive ? "bg-gray-400" : color
        } ${classNames.join(" ")}`}
        title={title}
        type="button"
        aria-label={title}
    >
        {children}
    </button>
  );
}
