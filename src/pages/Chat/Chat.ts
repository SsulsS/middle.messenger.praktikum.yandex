import Handlebars from 'handlebars';
import { authService } from '../../utils/auth';
import type { Chat } from '../../models/chat';
import type { Message } from '../../models/message';
import './Chat.scss';
import template from './Chat.hbs?raw';

const renderPage = Handlebars.compile(template);
const appDiv = document.querySelector<HTMLDivElement>('#app');

if (!appDiv) {
  throw new Error('#app element not found');
}

appDiv.innerHTML = renderPage({});

const chatListEl = document.getElementById('chat-list') as HTMLUListElement | null;
const messagesContainer = document.getElementById('messages') as HTMLUListElement | null;
const messageInput = document.getElementById('message-input') as HTMLInputElement | null;
const chatForm = document.getElementById('chat-form') as HTMLFormElement | null;
const chatTitle = document.getElementById('chat-title') as HTMLDivElement | null;

const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'Андрей', lastMessage: 'Привет! Как дела?', lastMessageTime: '10:24', unreadCount: 2 },
  { id: 'c2', title: 'Рабочий чат', lastMessage: 'Созвон в 15:00', lastMessageTime: 'вчера', unreadCount: 0 },
  { id: 'c3', title: 'Мария', lastMessage: 'Спасибо!', lastMessageTime: 'пн', unreadCount: 0 },
];

let chats: Chat[] = [];
let selectedChat: Chat | null = null;
const messagesByChat: Record<string, Message[]> = {};

function renderChatList(items: Chat[]) {
  if (!chatListEl) return;
  
  const frag = document.createDocumentFragment();

  if (items.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'chat__list-empty';
    emptyItem.textContent = 'Чатов пока нет.';
    frag.appendChild(emptyItem);
    chatListEl.innerHTML = '';
    chatListEl.appendChild(frag);
    return;
  }

  items.forEach((c) => {
    const el = document.createElement('li');
    el.className = 'chat__list-item';
    el.dataset.id = c.id;

    const left = document.createElement('div');
    left.className = 'chat__list-item-left';

    const avatar = document.createElement('div');
    avatar.className = 'chat__avatar';
    avatar.textContent = c.title?.charAt(0) ?? 'Ч';

    const content = document.createElement('div');
    content.className = 'chat__list-item-content';

    const name = document.createElement('div');
    name.className = 'chat__list-item-name';
    name.textContent = c.title;

    const preview = document.createElement('div');
    preview.className = 'chat__list-item-preview';
    preview.textContent = c.lastMessage ?? 'Нет сообщений';

    content.appendChild(name);
    content.appendChild(preview);
    left.appendChild(avatar);
    left.appendChild(content);

    const meta = document.createElement('div');
    meta.className = 'chat__list-item-meta';

    const time = document.createElement('span');
    time.className = 'chat__list-item-time';
    time.textContent = c.lastMessageTime ?? '';
    meta.appendChild(time);

    if (c.unreadCount) {
      const unread = document.createElement('span');
      unread.className = 'chat__list-item-unread';
      unread.textContent = String(c.unreadCount);
      meta.appendChild(unread);
    }

    el.appendChild(left);
    el.appendChild(meta);

    el.addEventListener('click', () => selectChat(c));

    if (selectedChat?.id === c.id) {
      el.classList.add('chat__list-item_active');
    }

    frag.appendChild(el);
  });

  chatListEl.innerHTML = '';
  chatListEl.appendChild(frag);
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function renderMessages() {
  if (!messagesContainer) return;
  messagesContainer.innerHTML = '';

  if (!selectedChat) {
    const emptyNode = document.createElement('li');
    emptyNode.className = 'chat__empty-state';
    emptyNode.textContent = 'Выберите чат, чтобы отправить сообщение';
    messagesContainer.appendChild(emptyNode);
    return;
  }

  const messages = messagesByChat[selectedChat.id] || [];

  if (messages.length === 0) {
    const emptyNode = document.createElement('li');
    emptyNode.className = 'chat__empty-state';
    emptyNode.textContent = 'В этом чате ещё нет сообщений';
    messagesContainer.appendChild(emptyNode);
    return;
  }

  const currentUserId = authService.getUser()?.id ?? null;
  let lastDateLabel = '';

  
  const frag = document.createDocumentFragment();

  messages.forEach((msg) => {
    const dateLabel = formatDateLabel(msg.createdAt);

    if (dateLabel !== lastDateLabel) {
      lastDateLabel = dateLabel;
      const separator = document.createElement('li');
      separator.className = 'chat__date-separator';
      separator.textContent = dateLabel;
      frag.appendChild(separator);
    }

    const messageItem = document.createElement('li');
    messageItem.className = `chat__message chat__message_${msg.userId === currentUserId ? 'sent' : 'received'}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat__message-bubble';
    bubble.textContent = msg.text;

    const timeLabel = document.createElement('span');
    timeLabel.className = 'chat__message-time';
    timeLabel.textContent = formatTime(msg.createdAt);
    bubble.appendChild(timeLabel);

    messageItem.appendChild(bubble);
    frag.appendChild(messageItem);
  });

  messagesContainer.appendChild(frag);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function refreshList() {
  chats = MOCK_CHATS;
  renderChatList(chats);
}

function selectChat(c: Chat) {
  if (!chatTitle) return;

  selectedChat = c;

  document.querySelectorAll('.chat__list-item').forEach((el) => el.classList.remove('chat__list-item_active'));
  document.querySelector(`.chat__list-item[data-id="${c.id}"]`)?.classList.add('chat__list-item_active');

  chatTitle.textContent = c.title;

  if (!messagesByChat[c.id]) {
    messagesByChat[c.id] = [];
  }
  renderMessages();
}

function sendMessage() {
  if (!messageInput || !selectedChat) return;

  const text = messageInput.value.trim();
  if (!text) return;

  const currentUserId = authService.getUser()?.id ?? 'me';
  const key = selectedChat.id;
  const message: Message = {
    id: `m${Date.now()}`,
    chatId: key,
    userId: currentUserId,
    text,
    createdAt: new Date().toISOString(),
  };

  messagesByChat[key] = [...(messagesByChat[key] || []), message];
  messageInput.value = '';
  renderMessages();
}

chatForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

refreshList();