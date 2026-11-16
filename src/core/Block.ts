import { compileTemplate } from './compileTemplate';
import { EventBus } from './EventBus';

export type TBlockEvents = Record<string, (event: Event) => void>;

export interface IBlockProps {
  events?: TBlockEvents;
  [key: string]: unknown;
}

type TChildren = Record<string, Block | Block[]>;

type TLifecycleEvents = {
  init: [];
  'flow:component-did-mount': [];
  'flow:component-did-update': [];
  'flow:render': [];
};

interface ISplitProps {
  props: Record<string, unknown>;
  children: TChildren;
}

const isBlockList = (value: unknown): value is Block[] => {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => item instanceof Block)
  );
};

const getChildStub = (child: Block): string => {
  return `<div data-block-id="${child.id}"></div>`;
};

const toBlockList = (child: Block | Block[]): Block[] => {
  return Array.isArray(child) ? child : [child];
};

export abstract class Block<TProps extends IBlockProps = IBlockProps> {
  private static createdBlocksCount = 0;

  public readonly id: string;

  protected props: TProps;
  protected children: TChildren = {};

  private previousProps: TProps;
  private element: HTMLElement | null = null;
  private isUpdateBatched = false;
  private readonly eventBus = new EventBus<TLifecycleEvents>();

  constructor(propsWithChildren: TProps) {
    Block.createdBlocksCount += 1;
    this.id = `block-${Block.createdBlocksCount}`;

    const { props, children } = this._splitPropsAndChildren(propsWithChildren);

    this.children = children;
    this.previousProps = props;
    this.props = this._makePropsProxy(props);

    this._registerLifecycleEvents();
    this.eventBus.emit('init');
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  public dispatchComponentDidMount(): void {
    this.eventBus.emit('flow:component-did-mount');
  }

  public setProps(nextProps: Partial<TProps>): void {
    if (Object.keys(nextProps).length === 0) {
      return;
    }

    const { props, children } = this._splitPropsAndChildren(nextProps);

    // Одна перерисовка на вызов setProps, а не на каждое изменённое свойство
    this.previousProps = { ...this.props };
    this.isUpdateBatched = true;
    Object.assign(this.props, props);
    this.isUpdateBatched = false;

    this._replaceChildren(props, children);

    const hasNewChildren = Object.keys(children).length > 0;

    this.eventBus.emit(
      hasNewChildren ? 'flow:render' : 'flow:component-did-update'
    );
  }

  protected abstract render(): DocumentFragment;

  protected componentDidMount(): void {}

  protected componentDidUpdate(oldProps: TProps, newProps: TProps): boolean {
    const propNames = new Set([
      ...Object.keys(oldProps),
      ...Object.keys(newProps),
    ]);

    return [...propNames].some((name) => oldProps[name] !== newProps[name]);
  }

  protected compile(template: string): DocumentFragment {
    const context: Record<string, unknown> = { ...this.props };
    const childBlocks = Object.values(this.children).flatMap(toBlockList);

    Object.entries(this.children).forEach(([name, child]) => {
      context[name] = toBlockList(child).map(getChildStub).join('');
    });

    const wrapper = document.createElement('template');

    // Значения props экранирует Handlebars, без экранирования вставляются только заглушки дочерних блоков
    wrapper.innerHTML = compileTemplate(template, context);

    childBlocks.forEach((child) => {
      const stub = wrapper.content.querySelector(
        `[data-block-id="${child.id}"]`
      );
      const content = child.getContent();

      if (stub && content) {
        stub.replaceWith(content);
      }
    });

    return wrapper.content;
  }

  private _splitPropsAndChildren(propsWithChildren: Partial<TProps>): {
    props: TProps;
    children: TChildren;
  } {
    const result: ISplitProps = { props: {}, children: {} };

    Object.entries(propsWithChildren).forEach(([name, value]) => {
      if (value instanceof Block || isBlockList(value)) {
        result.children[name] = value;
      } else {
        result.props[name] = value;
      }
    });

    // Приведение типа: props собраны из полей TProps, но TypeScript не может вывести это из Object.entries
    return { props: result.props as TProps, children: result.children };
  }

  private _replaceChildren(
    props: Record<string, unknown>,
    children: TChildren
  ): void {
    const remainingChildren = Object.fromEntries(
      Object.entries(this.children).filter(([name]) => !(name in props))
    );

    this.children = { ...remainingChildren, ...children };
  }

  private _makePropsProxy(props: TProps): TProps {
    return new Proxy(props, {
      set: (target, name, value) => {
        if (this.isUpdateBatched) {
          return Reflect.set(target, name, value);
        }

        this.previousProps = { ...target };

        const isChanged = Reflect.set(target, name, value);

        this.eventBus.emit('flow:component-did-update');

        return isChanged;
      },
      deleteProperty: () => {
        throw new Error('Удаление свойств props запрещено');
      },
    });
  }

  private _registerLifecycleEvents(): void {
    this.eventBus.on('init', () => this._init());
    this.eventBus.on('flow:component-did-mount', () =>
      this._componentDidMount()
    );
    this.eventBus.on('flow:component-did-update', () =>
      this._componentDidUpdate()
    );
    this.eventBus.on('flow:render', () => this._render());
  }

  private _init(): void {
    this.eventBus.emit('flow:render');
  }

  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this.children)
      .flatMap(toBlockList)
      .forEach((child) => child.dispatchComponentDidMount());
  }

  private _componentDidUpdate(): void {
    if (this.componentDidUpdate(this.previousProps, { ...this.props })) {
      this.eventBus.emit('flow:render');
    }
  }

  private _render(): void {
    const newElement = this.render().firstElementChild;

    if (!(newElement instanceof HTMLElement)) {
      throw new Error(
        'render() должен возвращать фрагмент с одним корневым HTML-элементом'
      );
    }

    this._removeEvents();
    this.element?.replaceWith(newElement);
    this.element = newElement;
    this._addEvents();
  }

  private _addEvents(): void {
    Object.entries(this.props.events ?? {}).forEach(([name, handler]) => {
      this.element?.addEventListener(name, handler);
    });
  }

  private _removeEvents(): void {
    Object.entries(this.props.events ?? {}).forEach(([name, handler]) => {
      this.element?.removeEventListener(name, handler);
    });
  }
}
