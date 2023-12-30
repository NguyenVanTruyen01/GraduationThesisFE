interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className, htmlFor }) => {
  return (
    <label
      className={`self-start inline-block text-sm font-medium cursor-pointer text-text1 ${className}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
