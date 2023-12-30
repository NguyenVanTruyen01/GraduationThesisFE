import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useController,
} from 'react-hook-form';

interface InputProps {
  control: any;
  name: string;
  type?: string;
  error?: any;
  placeholder?: string;
  children?: React.ReactNode;
  value?: string
  defaultValue?:string
  onChange?: (value: any) => void
}

const Input: React.FC<InputProps> = ({
  control,
  name,
  type,
  placeholder,
  children,
  value,
  defaultValue,
  onChange
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  })
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (onChange) {
  //     onChange(event.target.value);
  //   }
  // }
  return (
    <div className='relative w-full'>
      <input
        autoComplete='false'
        id={name}
        type={type}
        className={`w-full p-3 text-sm font-semibold border outline-none border-strock rounded-xl placeholder:text-text4 focus:outline-none focus:border-primary`}
        placeholder={placeholder}
        {...field}
        value={value}
        defaultValue={defaultValue}
        // onChange={handleChange}
      />

      {children && (
        <span className='absolute cursor-pointer select-none right-6 top-2/4 -translate-y-2/4'>
          {children}
        </span>
      )}
    </div>
  );
};

export default Input;
