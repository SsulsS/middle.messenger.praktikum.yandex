import { Block, type IBlockProps } from 'core/Block';

import Button from 'components/Button/Button';

import template from './Modal.hbs?raw';
import './Modal.scss';

export interface IModalProps extends IBlockProps {
  title: string;
  content: Block;
  isOpen?: boolean;
}

class Modal extends Block<IModalProps> {
  constructor(props: IModalProps) {
    const closeButton = new Button({
      text: '×',
      className: 'modal__close',
      ariaLabel: 'Закрыть',
      closesModal: true,
    });

    super({
      isOpen: false,
      ...props,
      closeButton,
      events: { click: (event) => this._handleClick(event) },
    });
  }

  public open(): void {
    this.setProps({ isOpen: true });
  }

  public close(): void {
    this.setProps({ isOpen: false });
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }

  private _handleClick(event: Event): void {
    const isCloseControl =
      event.target instanceof Element &&
      event.target.closest('[data-modal-close]') !== null;

    if (isCloseControl) {
      this.close();
    }
  }
}

export default Modal;
