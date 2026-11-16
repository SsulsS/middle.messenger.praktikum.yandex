import { Block, type IBlockProps } from 'core/Block';

import template from './Input.hbs?raw';

export interface IInputClasses {
  wrapperClass: string;
  labelClass: string;
  fieldClass: string;
  invalidClass: string;
  errorClass: string;
}

export interface IInputProps extends IBlockProps, Partial<IInputClasses> {
  id: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  value?: string;
  error?: string;
}

const DEFAULT_CLASSES: IInputClasses = {
  wrapperClass: 'form-page__field',
  labelClass: 'form-page__label',
  fieldClass: 'form-page__input',
  invalidClass: 'form-page__input_invalid',
  errorClass: 'form-page__error',
};

class Input extends Block<IInputProps> {
  constructor(props: IInputProps) {
    super({
      ...DEFAULT_CLASSES,
      ...props,
      type: props.type ?? 'text',
      value: props.value ?? '',
      error: props.error ?? '',
    });
  }

  public getValue(): string {
    return this.getInputElement()?.value ?? '';
  }

  public getInputElement(): HTMLInputElement | null {
    return this.getContent()?.querySelector('input') ?? null;
  }

  // Ошибка обновляется точечно: полная перерисовка сбросила бы введённое значение и фокус
  protected componentDidUpdate(
    oldProps: IInputProps,
    newProps: IInputProps
  ): boolean {
    if (oldProps.error !== newProps.error) {
      this._showError(newProps.error ?? '');
    }

    return false;
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }

  private _showError(error: string): void {
    const input = this.getInputElement();
    const errorElement = this.getContent()?.querySelector(
      '[data-role="error"]'
    );
    const { invalidClass } = this.props;
    const hasError = Boolean(error);

    if (input && invalidClass) {
      input.classList.toggle(invalidClass, hasError);
      input.setAttribute('aria-invalid', String(hasError));
    }

    if (errorElement) {
      errorElement.textContent = error;
    }
  }
}

export default Input;
