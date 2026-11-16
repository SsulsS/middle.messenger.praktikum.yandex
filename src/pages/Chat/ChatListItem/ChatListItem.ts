import { Block, type IBlockProps } from 'core/Block';

import { type IChat } from 'types/chat';

import template from './ChatListItem.hbs?raw';

export interface IChatListItemProps extends IBlockProps {
  chat: IChat;
  onSelect: (chatId: string) => void;
  isActive?: boolean;
}

const EMPTY_PREVIEW_TEXT = 'Нет сообщений';

class ChatListItem extends Block<IChatListItemProps> {
  public readonly chatId: string;

  constructor(props: IChatListItemProps) {
    const { chat, onSelect } = props;

    super({
      ...props,
      title: chat.title,
      avatarLetter: chat.title.charAt(0),
      preview: chat.lastMessage ?? EMPTY_PREVIEW_TEXT,
      time: chat.lastMessageTime ?? '',
      unreadCount: chat.unreadCount ?? 0,
      events: { click: () => onSelect(chat.id) },
    });

    this.chatId = chat.id;
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default ChatListItem;
