import { describe, expect, it, vi } from 'vitest';

import { EventBus } from './EventBus';

type TTestEvents = {
  message: [string, number];
};

describe('EventBus', () => {
  it('вызывает подписчиков с переданными аргументами', () => {
    const eventBus = new EventBus<TTestEvents>();
    const listener = vi.fn();

    eventBus.on('message', listener);
    eventBus.emit('message', 'привет', 1);

    expect(listener).toHaveBeenCalledWith('привет', 1);
  });

  it('не вызывает подписчика после off', () => {
    const eventBus = new EventBus<TTestEvents>();
    const listener = vi.fn();

    eventBus.on('message', listener);
    eventBus.off('message', listener);
    eventBus.emit('message', 'привет', 1);

    expect(listener).not.toHaveBeenCalled();
  });

  it('бросает ошибку при отписке от события без подписчиков', () => {
    const eventBus = new EventBus<TTestEvents>();

    expect(() => eventBus.off('message', vi.fn())).toThrow();
  });
});
