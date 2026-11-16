import { Block, type IBlockProps } from 'core/Block';

import { type IFormField, type TFormData } from 'types/form';

import Form from 'components/Form/Form';

import template from './AuthForm.hbs?raw';
import './AuthForm.scss';

interface IAuthFormLink {
  href: string;
  text: string;
}

export interface IAuthFormProps extends IBlockProps {
  pageClass: string;
  title: string;
  fields: IFormField[];
  submitText: string;
  link: IAuthFormLink;
  onSubmit: (data: TFormData) => void;
}

class AuthForm extends Block<IAuthFormProps> {
  constructor(props: IAuthFormProps) {
    const form = new Form({
      className: 'form-page__form',
      fields: props.fields,
      submitText: props.submitText,
      onSubmit: props.onSubmit,
    });

    super({ ...props, form });
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default AuthForm;
