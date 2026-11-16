import { Block, type IBlockProps } from 'core/Block';

import template from './MessageList.hbs?raw';

export interface IMessageListProps extends IBlockProps {
  items: Block[];
  emptyText: string;
}

class MessageList extends Block<IMessageListProps> {
  public scrollToBottom(): void {
    const list = this.getContent();

    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default MessageList;
