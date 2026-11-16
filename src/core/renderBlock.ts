import { type Block } from './Block';

export const renderBlock = (selector: string, block: Block): void => {
  const root = document.querySelector(selector);
  const content = block.getContent();

  if (!root) {
    throw new Error(`Не найден корневой элемент по селектору "${selector}"`);
  }

  if (!content) {
    throw new Error('Блок не отрисован: у него нет DOM-элемента');
  }

  root.replaceChildren(content);
  block.dispatchComponentDidMount();
};
