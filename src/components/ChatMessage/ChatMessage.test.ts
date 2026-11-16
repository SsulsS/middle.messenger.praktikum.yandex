import { describe, expect, it } from 'vitest';

import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
  it('рендерит текст, время и модификатор по variant', () => {
    const root = new ChatMessage({
      text: 'Привет',
      time: '10:00',
      variant: 'sent',
    }).getContent();

    expect(root?.classList.contains('chat__message_sent')).toBe(true);
    expect(root?.querySelector('.chat__message-time')?.textContent).toBe(
      '10:00'
    );
    expect(root?.textContent).toContain('Привет');
  });

  it('экранирует текст сообщения — нельзя внедрить разметку', () => {
    const root = new ChatMessage({
      text: '<img src=x onerror=alert(1)>',
      time: '10:00',
      variant: 'received',
    }).getContent();

    expect(root?.querySelector('img')).toBeNull();
    expect(root?.innerHTML).toContain('&lt;img');
  });
});
