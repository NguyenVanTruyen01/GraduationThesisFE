interface FormGroupProps {
  children: React.ReactNode;
}
const FormGroup: React.FC<FormGroupProps> = ({ children }) => {
  return (
    <div className='flex flex-col lg:mb-6 mb-4 lg:gap-y-3 gap-y-2'>
      {children}
    </div>
  );
};

export default FormGroup;
