import { Block, type IBlockProps } from 'core/Block';

import { collectFormData } from 'utils/collectFormData';
import { validateField } from 'utils/validateField';
import { type IFormField, type TFormData } from 'types/form';

import Button from 'components/Button/Button';
import Input, { type IInputClasses } from 'components/Input/Input';

import template from './Form.hbs?raw';

type TStatusKind = 'success' | 'error';

export interface IFormProps extends IBlockProps {
  className: string;
  fields: IFormField[];
  submitText: string;
  onSubmit: (data: TFormData) => void;
  title?: string;
  titleClass?: string;
  statusClass?: string;
  status?: string;
  statusKind?: TStatusKind;
  submitClass?: string;
  submitAriaLabel?: string;
  inputClasses?: IInputClasses;
}

class Form extends Block<IFormProps> {
  private readonly inputs: Input[];

  constructor(props: IFormProps) {
    const inputs = props.fields.map((field, index) => {
      return new Input({
        ...props.inputClasses,
        id: field.id,
        name: field.name,
        label: field.label,
        type: field.type,
        placeholder: field.placeholder,
        autocomplete: field.autocomplete,
        value: field.value,
        events: { focusout: () => this._validateInput(index) },
      });
    });
    const submitButton = new Button({
      type: 'submit',
      text: props.submitText,
      className: props.submitClass,
      ariaLabel: props.submitAriaLabel,
    });

    super({
      ...props,
      inputs,
      submitButton,
      events: { submit: (event) => this._handleSubmit(event) },
    });

    this.inputs = inputs;
  }

  public showStatus(status: string, statusKind: TStatusKind): void {
    this.setProps({ status, statusKind });
  }

  public reset(): void {
    const form = this.getContent();

    if (form instanceof HTMLFormElement) {
      form.reset();
    }

    this.inputs.forEach((input) => input.setProps({ error: '' }));
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }

  private _validateInput(index: number): boolean {
    const input = this.inputs[index];
    const { rule } = this.props.fields[index];
    const error = rule ? validateField(rule, input.getValue()) : '';

    input.setProps({ error });

    return !error;
  }

  private _handleSubmit(event: Event): void {
    event.preventDefault();

    const validationResults = this.inputs.map((_input, index) =>
      this._validateInput(index)
    );
    const isFormValid = validationResults.every(Boolean);
    const form = event.currentTarget;

    if (!isFormValid || !(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = collectFormData(form);

    // Вывод данных формы в консоль — требование ТЗ спринта 2
    // eslint-disable-next-line no-console
    console.log(formData);

    this.props.onSubmit(formData);
  }
}

export default Form;
