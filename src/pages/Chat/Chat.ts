import { Block, type IBlockProps } from 'core/Block';

import { chatController } from 'controllers/ChatController';

import { formatDay, formatTime } from 'utils/formatDate';
import { getFormText } from 'utils/getFormText';
import { type TFormData } from 'types/form';
import { type IMessage } from 'types/message';
import { ROUTES } from 'constants/general';

import ChatMessage from 'components/ChatMessage/ChatMessage';
import Form from 'components/Form/Form';

import ChatHeader from 'pages/Chat/ChatHeader/ChatHeader';
import ChatList from 'pages/Chat/ChatList/ChatList';
import DateSeparator from 'pages/Chat/DateSeparator/DateSeparator';
import MessageList from 'pages/Chat/MessageList/MessageList';

import template from './Chat.hbs?raw';
import {
  MESSAGE_FIELDS,
  MESSAGE_INPUT_CLASSES,
  NO_CHAT_TEXT,
  NO_CHAT_TITLE,
  NO_MESSAGES_TEXT,
} from './constants';
import './Chat.scss';

const createMessageBlocks = (messages: IMessage[]): Block[] => {
  return messages.flatMap((message, index) => {
    const day = formatDay(message.createdAt);
    const previousMessage = messages[index - 1];
    const isNewDay =
      !previousMessage || formatDay(previousMessage.createdAt) !== day;
    const messageBlock = new ChatMessage({
      text: message.text,
      time: formatTime(message.createdAt),
      variant: chatController.isOwnMessage(message) ? 'sent' : 'received',
    });

    return isNewDay
      ? [new DateSeparator({ label: day }), messageBlock]
      : [messageBlock];
  });
};

class ChatPage extends Block<IBlockProps> {
  private readonly chatList: ChatList;
  private readonly chatHeader: ChatHeader;
  private readonly messageList: MessageList;
  private readonly messageForm: Form;

  constructor() {
    const chatList = new ChatList({
      chats: chatController.getChats(),
      onSelect: (chatId) => this._handleChatSelect(chatId),
    });
    const chatHeader = new ChatHeader({
      title: NO_CHAT_TITLE,
      status: NO_CHAT_TEXT,
    });
    const messageList = new MessageList({ items: [], emptyText: NO_CHAT_TEXT });
    const messageForm = new Form({
      className: 'chat__input-area',
      fields: MESSAGE_FIELDS,
      inputClasses: MESSAGE_INPUT_CLASSES,
      submitText: '➤',
      submitClass: 'chat__send-button',
      submitAriaLabel: 'Отправить сообщение',
      onSubmit: (data) => this._handleMessageSubmit(data),
    });

    super({
      profileUrl: ROUTES.profile,
      chatList,
      chatHeader,
      messageList,
      messageForm,
    });

    this.chatList = chatList;
    this.chatHeader = chatHeader;
    this.messageList = messageList;
    this.messageForm = messageForm;

    const selectedChat = chatController.getSelectedChat();

    if (selectedChat) {
      this._handleChatSelect(selectedChat.id);
    }
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }

  private _handleChatSelect(chatId: string): void {
    chatController.selectChat(chatId);

    const selectedChat = chatController.getSelectedChat();

    if (!selectedChat) {
      return;
    }

    this.chatList.setActiveChat(chatId);
    this.chatHeader.setProps({ title: selectedChat.title, status: '' });
    this._showMessages();
  }

  private _handleMessageSubmit(data: TFormData): void {
    if (!chatController.getSelectedChat()) {
      return;
    }

    chatController.sendMessage(getFormText(data, 'message'));
    this.messageForm.reset();
    this._showMessages();
  }

  private _showMessages(): void {
    const messages = chatController.getSelectedChatMessages();

    this.messageList.setProps({
      items: createMessageBlocks(messages),
      emptyText: NO_MESSAGES_TEXT,
    });
    this.messageList.scrollToBottom();
  }
}

export default ChatPage;
