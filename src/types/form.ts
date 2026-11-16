export type TValidationRule =
  | 'first_name'
  | 'second_name'
  | 'login'
  | 'email'
  | 'password'
  | 'phone'
  | 'message';

export type TFormData = Record<string, FormDataEntryValue>;

export interface IFormField {
  id: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  value?: string;
  rule?: TValidationRule;
}

export interface IValidationCheck {
  pattern: RegExp;
  message: string;
}
