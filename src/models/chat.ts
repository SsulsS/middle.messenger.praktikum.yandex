export interface Chat {
  id: string;
  title: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  users?: string[]; 
}

export interface CreateChatPayload {
  title: string;
  users?: string[];
}
