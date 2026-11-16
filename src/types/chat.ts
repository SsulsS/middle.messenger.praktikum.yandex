export interface IChat {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
