import { type TFormData } from 'types/form';

export const collectFormData = (form: HTMLFormElement): TFormData => {
  const filledEntries = [...new FormData(form).entries()].filter(
    ([, value]) => {
      // Пустое поле type="file" попадает в FormData как файл нулевого размера
      const isEmptyFile = value instanceof File && value.size === 0;

      return !isEmptyFile;
    }
  );

  return Object.fromEntries(filledEntries);
};
