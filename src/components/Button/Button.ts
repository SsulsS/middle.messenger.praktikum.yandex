import { Block, type IBlockProps } from 'core/Block';

import template from './Button.hbs?raw';

export interface IButtonProps extends IBlockProps {
  text: string;
  type?: 'button' | 'submit';
  className?: string;
  ariaLabel?: string;
  closesModal?: boolean;
}

class Button extends Block<IButtonProps> {
  constructor(props: IButtonProps) {
    super({
      ...props,
      type: props.type ?? 'button',
      className: props.className ?? 'form-page__button',
    });
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default Button;
