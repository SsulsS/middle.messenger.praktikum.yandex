import { Block, type IBlockProps } from 'core/Block';

import { type IChat } from 'types/chat';

import ChatListItem from 'pages/Chat/ChatListItem/ChatListItem';

import template from './ChatList.hbs?raw';

export interface IChatListProps extends IBlockProps {
  chats: IChat[];
  onSelect: (chatId: string) => void;
}

class ChatList extends Block<IChatListProps> {
  private readonly items: ChatListItem[];

  constructor(props: IChatListProps) {
    const items = props.chats.map((chat) => {
      return new ChatListItem({ chat, onSelect: props.onSelect });
    });

    super({ ...props, items });

    this.items = items;
  }

  public setActiveChat(chatId: string): void {
    this.items.forEach((item) => {
      item.setProps({ isActive: item.chatId === chatId });
    });
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default ChatList;
