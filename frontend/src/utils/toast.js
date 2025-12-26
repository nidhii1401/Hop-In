import { toast } from 'react-hot-toast';

const baseOptions = {
  style: {
    background: '#0c0a09',
    color: '#fef3c7',
    border: '1px solid #1c1917',
    padding: '10px 14px',
    fontWeight: 600,
  },
  iconTheme: {
    primary: '#f97316',
    secondary: '#0c0a09',
  },
  duration: 3500,
};

export const toastSuccess = (message, opts = {}) =>
  toast.success(message, { ...baseOptions, ...opts });

export const toastError = (message, opts = {}) =>
  toast.error(message, { ...baseOptions, ...opts });

export const toastLoading = (message, opts = {}) =>
  toast.loading(message, { ...baseOptions, duration: 4000, ...opts });

export const toastPromise = (promise, messages) =>
  toast.promise(
    promise,
    {
      loading: messages.loading || 'Working...',
      success: messages.success || 'Done',
      error: messages.error || 'Something went wrong',
    },
    baseOptions
  );
