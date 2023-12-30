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
  onChange?: (value: any) => void
}

const InputChange: React.FC<InputProps> = ({
  control,
  name,
  type,
  placeholder,
  children,
  value,
  onChange
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // if (!isNaN(inputValue)) {
    //   const parsedValue = parseInt(inputValue, 10);
    //   if (parsedValue >= 1 && parsedValue <= 3) {
    //     field.onChange(parsedValue.toString());
    //   } else {
    //     toast.error("Vui long nhap so tu 1 - 3")
    //   }
    // }
    if (onChange) {
      onChange(event.target.value);
      field.onChange(inputValue.toString());
    }
  }
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
        onChange={handleChange}
      />

      {children && (
        <span className='absolute cursor-pointer select-none right-6 top-2/4 -translate-y-2/4'>
          {children}
        </span>
      )}
    </div>
  );
};

export default InputChange;
