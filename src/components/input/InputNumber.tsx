import {
  useController,
} from 'react-hook-form';
import toast from "react-hot-toast";

interface InputNumberProps {
  control: any;
  name: string;
  type?: string;
  error?: any;
  placeholder?: string;
  children?: React.ReactNode;
  onChange?: (value: any) => void
}

const InputNumber: React.FC<InputNumberProps> = ({
  control,
  name,
  type,
  placeholder,
  children,
  onChange
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue:any = event.target.value;
    // Kiểm tra giá trị nhập vào và đảm bảo nó nằm trong khoảng từ 1 đến 3
    if (!isNaN(inputValue)) {
      const parsedValue = parseInt(inputValue, 10);
      if (parsedValue >= 1 && parsedValue <= 3) {
        field.onChange(parsedValue.toString());
      } else {
        toast.error("Vui long nhap so tu 1 - 3")
      }
    }
    if (onChange) {
      onChange(event.target.value);
    }
  }
  
  return (
    <div className='relative w-full'>
      <input
        autoComplete='false'
        id={name}
        type={type}
        className={`w-full px-6 py-4 text-base font-semibold border outline-none border-strock rounded-xl placeholder:text-text4 focus:outline-none focus:border-primary`}
        placeholder={placeholder}
        {...field}
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

export default InputNumber;
