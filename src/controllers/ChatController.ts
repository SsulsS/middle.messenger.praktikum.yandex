import { authService } from 'services/AuthService';
import { chatService } from 'services/ChatService';

import { type IChat } from 'types/chat';
import { type IMessage } from 'types/message';

class ChatController {
  private selectedChatId: string | null = null;

  public getChats(): IChat[] {
    return chatService.getChats();
  }

  public selectChat(chatId: string): void {
    this.selectedChatId = chatId;
  }

  public getSelectedChat(): IChat | null {
    const selectedChat = chatService
      .getChats()
      .find((chat) => chat.id === this.selectedChatId);

    return selectedChat ?? null;
  }

  public getSelectedChatMessages(): IMessage[] {
    return this.selectedChatId
      ? chatService.getMessages(this.selectedChatId)
      : [];
  }

  public isOwnMessage(message: IMessage): boolean {
    return message.userId === authService.getUser()?.id;
  }

  public sendMessage(text: string): void {
    const currentUser = authService.getUser();

    if (!this.selectedChatId || !currentUser) {
      throw new Error(
        'Нельзя отправить сообщение: не выбран чат или пользователь не авторизован'
      );
    }

    chatService.addMessage(this.selectedChatId, currentUser.id, text);
  }
}

export const chatController = new ChatController();
