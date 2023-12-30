import { Link } from 'react-router-dom';

interface ButtonProps {
  type: any;
  children: React.ReactNode;
  className: string;
  isLoading?: boolean;
  kind?: string;
  href?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  type,
  children,
  className,
  isLoading,
  kind,
  href,
}) => {
  const child = !!isLoading ? (
    <div className='w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin border-b-transparent'></div>
  ) : (
    children
  );
  let defaultClassName =
    'flex items-center justify-center p-4 text-base font-semibold rounded-xl min-h-[56px]';
  switch (kind) {
    case 'primary':
      defaultClassName += ' bg-primary text-white';
      break;
    case 'secondary':
      defaultClassName += ' bg-secondary text-white';
      break;
    case 'ghost':
      defaultClassName += ' bg-secondary bg-opacity-10 text-secondary ';
      break;

    default:
      break;
  }
  if (href) {
    return (
      <Link to={href} className={`${className} ${defaultClassName}`}>
        {child}
      </Link>
    );
  }
  return (
    <button
      className={` ${defaultClassName} ${
        !!isLoading ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
      type={type}
    >
      {child}
    </button>
  );
};

export default ButtonComponent;
