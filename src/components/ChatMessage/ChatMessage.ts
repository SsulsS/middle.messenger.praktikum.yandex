import { Block, type IBlockProps } from 'core/Block';

import template from './ChatMessage.hbs?raw';

export interface IChatMessageProps extends IBlockProps {
  text: string;
  time: string;
  variant: 'sent' | 'received';
}

class ChatMessage extends Block<IChatMessageProps> {
  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default ChatMessage;
