import { describe, expect, it, vi } from 'vitest';

import { Block, type IBlockProps } from './Block';

interface IStubProps extends IBlockProps {
  text: string;
}

class Stub extends Block<IStubProps> {
  protected render(): DocumentFragment {
    return this.compile('<p>{{text}}</p>');
  }
}

interface IParentProps extends IBlockProps {
  child?: Block;
  items?: Block[];
}

class Parent extends Block<IParentProps> {
  protected render(): DocumentFragment {
    return this.compile('<div>{{{child}}}{{{items}}}</div>');
  }
}

describe('Block', () => {
  it('создаёт корневой DOM-элемент с содержимым из render()', () => {
    const content = new Stub({ text: 'Привет' }).getContent();

    expect(content?.tagName).toBe('P');
    expect(content?.textContent).toBe('Привет');
  });

  it('экранирует значения props в шаблоне', () => {
    const content = new Stub({ text: '<img src=x>' }).getContent();

    expect(content?.querySelector('img')).toBeNull();
    expect(content?.textContent).toBe('<img src=x>');
  });

  it('перерисовывает DOM при изменении props через setProps', () => {
    const block = new Stub({ text: 'Раз' });

    block.setProps({ text: 'Два' });

    expect(block.getContent()?.textContent).toBe('Два');
  });

  it('заменяет элемент в документе при перерисовке', () => {
    const block = new Stub({ text: 'Раз' });
    const content = block.getContent();

    if (content) {
      document.body.append(content);
    }

    block.setProps({ text: 'Два' });

    expect(document.body.contains(block.getContent())).toBe(true);
    expect(document.body.textContent).toContain('Два');
  });

  it('перерисовывается один раз при изменении нескольких props', () => {
    interface IPairProps extends IBlockProps {
      first: string;
      second: string;
    }

    const renderSpy = vi.fn();

    class Pair extends Block<IPairProps> {
      protected render(): DocumentFragment {
        renderSpy();

        return this.compile('<p>{{first}} {{second}}</p>');
      }
    }

    const block = new Pair({ first: 'a', second: 'b' });

    renderSpy.mockClear();
    block.setProps({ first: 'c', second: 'd' });

    expect(renderSpy).toHaveBeenCalledOnce();
    expect(block.getContent()?.textContent).toBe('c d');
  });

  it('не перерисовывается, если значения props не изменились', () => {
    const block = new Stub({ text: 'Раз' });
    const contentBefore = block.getContent();

    block.setProps({ text: 'Раз' });

    expect(block.getContent()).toBe(contentBefore);
  });

  it('componentDidUpdate, возвращающий false, отменяет перерисовку', () => {
    class NoRerender extends Stub {
      protected componentDidUpdate(): boolean {
        return false;
      }
    }

    const block = new NoRerender({ text: 'исходный' });

    block.setProps({ text: 'новый' });

    expect(block.getContent()?.textContent).toBe('исходный');
  });

  it('вставляет дочерние блоки на место заглушек', () => {
    const parent = new Parent({
      child: new Stub({ text: 'один' }),
      items: [new Stub({ text: 'два' }), new Stub({ text: 'три' })],
    });

    const texts = [...(parent.getContent()?.querySelectorAll('p') ?? [])].map(
      (paragraph) => paragraph.textContent
    );

    expect(texts).toEqual(['один', 'два', 'три']);
  });

  it('обновляет дочерние блоки через setProps', () => {
    const parent = new Parent({ items: [new Stub({ text: 'старый' })] });

    parent.setProps({ items: [new Stub({ text: 'новый' })] });
    expect(parent.getContent()?.textContent).toBe('новый');

    parent.setProps({ items: [] });
    expect(parent.getContent()?.textContent).toBe('');
  });

  it('прокидывает componentDidMount дочерним компонентам', () => {
    const handleChildMount = vi.fn();

    class Child extends Stub {
      protected componentDidMount(): void {
        handleChildMount();
      }
    }

    const parent = new Parent({ child: new Child({ text: 'дочерний' }) });

    parent.dispatchComponentDidMount();

    expect(handleChildMount).toHaveBeenCalledOnce();
  });

  it('навешивает обработчики из props.events и сохраняет их после перерисовки', () => {
    const handleClick = vi.fn();
    const block = new Stub({ text: 'кнопка', events: { click: handleClick } });

    block.setProps({ text: 'другая кнопка' });
    block.getContent()?.dispatchEvent(new MouseEvent('click'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('запрещает удалять свойства props', () => {
    class Breaker extends Stub {
      public removeText(): void {
        Reflect.deleteProperty(this.props, 'text');
      }
    }

    expect(() => new Breaker({ text: 'x' }).removeText()).toThrow();
  });
});
