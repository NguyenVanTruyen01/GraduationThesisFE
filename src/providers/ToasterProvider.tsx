import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      position='top-center'
      reverseOrder={false}
      toastOptions={{
        className: '',
        style: {
          fontWeight: '700',
          border: '1px solid #713200',
          padding: '8px',
          color: '#713200',
        },
        success: {
          style: {
            fontWeight: '700',
            border: '1px solid green',
            padding: '8px',
            color: 'green',
          },
        },
        error: {
          style: {
            fontWeight: '700',
            border: '1px solid red',
            padding: '8px',
            color: 'red',
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
