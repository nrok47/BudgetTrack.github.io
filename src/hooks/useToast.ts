export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function createToast(message: string, type: ToastType): Toast {
  return {
    id: Date.now().toString() + Math.random(),
    message,
    type,
  };
}
