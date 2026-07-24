# Chat —— Single Page Application

Учебный мессенджер на TypeScript. Проект реализует клиентскую маршрутизацию, страницы регистрации, входа, профиля и чата (спринт 1).

## Технологии

- TypeScript
- Vite
- Handlebars
- SCSS

## Установка и запуск

```bash
npm install
npm run start
```

Откройте `http://localhost:3000`.

## Скрипты

- `npm run start` — собирает проект и запускает `vite preview` (production preview) на порту 3000
- `npm run dev` — запускает Vite в режиме разработки
- `npm run build` — сборка проекта
- `npm run lint` — ESLint + Stylelint
- `npm run test` — запуск тестов Vitest

## Страницы

- `/login` — страница входа
- `/sign-up` — регистрация
- `/profile` — редактирование профиля
- `/` — чат

## Структура

- `src/pages` — страницы приложения (шаблоны Handlebars + логика)
- `src/components` — переиспользуемые шаблоны (например, форма авторизации)
- `src/utils` — утилиты и маршрутизация
- `src/models` — типы данных

## Примечания

- Формы используют имена полей в sprint-1 формате: `login`, `password`, `first_name`, `second_name`, `message`, `old_password`, `new_password`.
- В спринте 1 нет требований к реальному API — авторизация, регистрация, профиль и чат работают как клиентские заглушки (данные хранятся в `localStorage` и в памяти вкладки, без сервера).

## Деплой

- SPA-деплой на Netlify: для корректной работы client-side маршрутизации в проекте добавлен `public/_redirects` с правилом `/* /index.html 200`.
- Ссылка на развёрнутый проект: https://brilliant-lamington-df230c.netlify.app/ <!-- TODO: заменить на реальную ссылку -->
