import { type IChat } from 'types/chat';
import { type IMessage } from 'types/message';

const MOCK_CHATS: IChat[] = [
  {
    id: 'c1',
    title: 'Андрей',
    lastMessage: 'Привет! Как дела?',
    lastMessageTime: '10:24',
    unreadCount: 2,
  },
  {
    id: 'c2',
    title: 'Рабочий чат',
    lastMessage: 'Созвон в 15:00',
    lastMessageTime: 'вчера',
  },
  {
    id: 'c3',
    title: 'Мария',
    lastMessage: 'Спасибо!',
    lastMessageTime: 'пн',
  },
];

class ChatService {
  private readonly messagesByChat = new Map<string, IMessage[]>();

  public getChats(): IChat[] {
    return MOCK_CHATS;
  }

  public getMessages(chatId: string): IMessage[] {
    return this.messagesByChat.get(chatId) ?? [];
  }

  public addMessage(chatId: string, userId: string, text: string): IMessage {
    const message: IMessage = {
      id: `${chatId}-${this.getMessages(chatId).length + 1}`,
      chatId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    };

    this.messagesByChat.set(chatId, [...this.getMessages(chatId), message]);

    return message;
  }
}

export const chatService = new ChatService();
