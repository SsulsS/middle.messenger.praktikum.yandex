import { Block, type IBlockProps } from 'core/Block';

import template from './DateSeparator.hbs?raw';

export interface IDateSeparatorProps extends IBlockProps {
  label: string;
}

class DateSeparator extends Block<IDateSeparatorProps> {
  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default DateSeparator;
