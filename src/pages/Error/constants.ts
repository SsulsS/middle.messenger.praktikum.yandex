import { type IErrorPageProps } from './Error';

export const NOT_FOUND_PROPS: IErrorPageProps = {
  code: '404',
  title: 'Страница не найдена',
  message:
    'К сожалению, запрашиваемая страница не существует или была перемещена.',
};

export const SERVER_ERROR_PROPS: IErrorPageProps = {
  code: '500',
  title: 'Что-то пошло не так',
  message: 'Мы уже знаем о проблеме и работаем над её устранением.',
};
