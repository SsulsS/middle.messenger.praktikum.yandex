import { Block, type IBlockProps } from 'core/Block';

import { ROUTES } from 'constants/general';

import template from './Error.hbs?raw';
import './Error.scss';

export interface IErrorPageProps extends IBlockProps {
  code: string;
  title: string;
  message: string;
}

class ErrorPage extends Block<IErrorPageProps> {
  constructor(props: IErrorPageProps) {
    super({ ...props, homeUrl: ROUTES.chat });
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }
}

export default ErrorPage;
