
import { useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastPrime = (type: string, content: string) => {
  const toast = useRef<Toast>(null);

  switch (type) {
    case "success":
      return (toast.current?.show({ severity: 'success', summary: 'Success', detail: `${content}`, life: 3000 }))
      break;
    case "info":
      return (toast.current?.show({ severity: 'info', summary: 'Info', detail: `${content}`, life: 3000 }))
      break;
    case "warn":
      return (toast.current?.show({ severity: 'warn', summary: 'Warning', detail: `${content}`, life: 3000 }))
      break;
    case "error":
      return (toast.current?.show({ severity: 'error', summary: 'Error', detail: `${content}`, life: 3000 }))
      break;
    default:
      break;
  }
}

export default ToastPrime
