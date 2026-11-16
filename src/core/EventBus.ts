type TListener<TArgs extends unknown[]> = (...args: TArgs) => void;

type TListeners<TEventMap extends Record<string, unknown[]>> = {
  [TEvent in keyof TEventMap]?: TListener<TEventMap[TEvent]>[];
};

export class EventBus<TEventMap extends Record<string, unknown[]>> {
  private readonly listeners: TListeners<TEventMap> = {};

  public on<TEvent extends keyof TEventMap>(
    event: TEvent,
    callback: TListener<TEventMap[TEvent]>
  ): void {
    const eventListeners = this.listeners[event] ?? [];

    this.listeners[event] = [...eventListeners, callback];
  }

  public off<TEvent extends keyof TEventMap>(
    event: TEvent,
    callback: TListener<TEventMap[TEvent]>
  ): void {
    const eventListeners = this.listeners[event];

    if (!eventListeners) {
      throw new Error(`Нет подписчиков на событие "${String(event)}"`);
    }

    this.listeners[event] = eventListeners.filter(
      (listener) => listener !== callback
    );
  }

  public emit<TEvent extends keyof TEventMap>(
    event: TEvent,
    ...args: TEventMap[TEvent]
  ): void {
    this.listeners[event]?.forEach((listener) => listener(...args));
  }
}
