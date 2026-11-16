import { type TFormData } from 'types/form';

export const getFormText = (data: TFormData, name: string): string => {
  const value = data[name];

  return typeof value === 'string' ? value.trim() : '';
};
