import { Block, type IBlockProps } from 'core/Block';

import template from './ChatHeader.hbs?raw';

export interface IChatHeaderProps extends IBlockProps {
  title: string;
  status: string;
}

class ChatHeader extends Block<IChatHeaderProps> {
  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default ChatHeader;
