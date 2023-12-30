import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useController,
} from 'react-hook-form';

interface TextAreaProps {
  control: any;
  name: string;
  type?: string;
  error?: any;
  placeholder?: string;
  children?: React.ReactNode;
  value?: string
}

const TextArea: React.FC<TextAreaProps> = ({
  control,
  name,
  type,
  placeholder,
  children,
  value
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  })
  return (
    <div className='relative w-full'>
      <TextArea
        // id={name}
        type={type}
        // className={`w-full px-6 py-4 text-base font-semibold border outline-none border-strock rounded-xl placeholder:text-text4 focus:outline-none focus:border-primary`}
        placeholder={placeholder}
        control={control}
        {...field}
        value={value}
      />

      {children && (
        <span className='absolute cursor-pointer select-none right-6 top-2/4 -translate-y-2/4'>
          {children}
        </span>
      )}
    </div>
  );
};

export default TextArea;
