export const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);

        return;
      }

      reject(new TypeError(`Файл "${file.name}" прочитан не как строка`));
    };

    reader.onerror = () => {
      reject(
        reader.error ?? new Error(`Не удалось прочитать файл "${file.name}"`)
      );
    };

    reader.readAsDataURL(file);
  });
};
