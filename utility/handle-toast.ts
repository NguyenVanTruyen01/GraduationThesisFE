import toast from 'react-hot-toast';

export const handleToast = (data: any) => {
    if (data?.statusCode === 1000) {
        toast(data?.msg)
    }
    else {
        toast(data?.msg)
    }
}