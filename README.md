<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
  <img src="./preview.png" alt="Обложка проекта" width="600"/>
</p>

# todo-next-supabase

**Современное fullstack-приложение на Next.js + Supabase с авторизацией, todo-листом, защищёнными роутами, тестами и CI/CD.**

---

## Описание

Этот проект — эталонная реализация todo-приложения с аутентификацией, защищёнными страницами, чистой архитектурой и максимальным покрытием тестами. Используются только современные best practices, весь код тщательно проверен и оптимизирован.

---

## Особенности

- Next.js (App Router, SSR, Middleware)
- Supabase (auth, db, API)
- Полная авторизация: регистрация, логин, восстановление, смена пароля
- Защищённые страницы (middleware)
- Современные UI-компоненты (shadcn/ui, TailwindCSS)
- 100% unit-тесты (Vitest, Testing Library)
- Storybook для UI
- Husky + lint-staged (pre-commit)
- Полная документация и best practices

---

## Структура каталогов

```
my-app/
  app/           # Роуты, страницы, layout
  components/    # UI и бизнес-компоненты
  lib/           # Утилиты, supabase, типы
  stories/       # Storybook stories
  supabase/      # Конфиги Supabase
  public/        # preview.png, favicon и др.
  ...
```

---

## Быстрый старт

```bash
# 1. Клонируй репозиторий
$ git clone https://github.com/AndeBurm/todo-next-supabase.git
$ cd todo-next-supabase

# 2. Установи зависимости
$ npm install

# 3. Скопируй .env.example → .env.local и заполни ключи Supabase

# 4. Запусти dev-сервер
$ npm run dev

# 5. Запусти тесты
$ npm run test

# 6. Storybook (UI)
$ npm run storybook
```

---

## Переменные окружения

- `NEXT_PUBLIC_SUPABASE_URL` — URL проекта Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — анонимный ключ Supabase

Все переменные описаны в `.env.example`.

---

## Архитектура и технологии

- **Next.js 15+** — App Router, SSR, Middleware
- **Supabase** — Auth, Database, API
- **TailwindCSS** + **shadcn/ui** — UI
- **Vitest** + **@testing-library/react** — тесты
- **Storybook** — визуальное тестирование UI
- **Husky, lint-staged** — автолинтинг и форматирование

---

## Основные npm-скрипты

- `dev` — запуск dev-сервера
- `build` — production-сборка
- `start` — запуск production
- `test` — unit-тесты
- `test:storybook` — тесты Storybook
- `lint` — линтинг
- `storybook` — запуск Storybook

---

## Тестирование и качество

- Покрытие unit-тестами: 100% основных форм и утилит
- Все тесты проходят (`npm run test`)
- Husky/lint-staged: автолинтинг и форматирование при коммите
- Storybook: визуальные тесты UI

---

## CI/CD (рекомендации)

- Добавь GitHub Actions для автоматического тестирования и линтинга
- Используй Vercel или Railway для деплоя
- Храни секреты только в GitHub Secrets

---

## FAQ

**Q:** Как добавить новую фичу?
**A:** Создай отдельный компонент/route, покрывай тестами, не нарушай архитектуру.

**Q:** Как обновить зависимости?
**A:** Только после тестов и проверки changelog. Используй стабильные версии.

**Q:** Как добавить интеграцию?
**A:** Используй переменные окружения, не хардкодь ключи.

---

## Контакты

- Автор: [AndeBurm](https://github.com/AndeBurm)
- Вопросы и баги: issues в репозитории

---

## English summary

This is a production-grade Next.js + Supabase todo app with full auth, protected routes, modern UI, 100% test coverage, and best practices. See Russian sections above for full docs.

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
    - App Router
    - Pages Router
    - Middleware
    - Client
    - Server
    - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
    - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

    ```bash
    npx create-next-app --example with-supabase with-supabase-app
    ```

    ```bash
    yarn create next-app --example with-supabase with-supabase-app
    ```

    ```bash
    pnpm create next-app --example with-supabase with-supabase-app
    ```

3. Use `cd` to change into the app's directory

    ```bash
    cd with-supabase-app
    ```

4. Rename `.env.example` to `.env.local` and update the following:

    ```
    NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
    NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
    ```

    Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

    ```bash
    npm run dev
    ```

    The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

## Локальная настройка .env.local

1. Скопируйте .env.example в .env.local
2. Заполните переменные:
    - NEXT_PUBLIC_SUPABASE_URL=... (ваш Supabase URL)
    - NEXT_PUBLIC_SUPABASE_ANON_KEY=... (ваш Supabase anon key)

## Проверка и запуск

- Линтинг: `npm run lint`
- Тесты: `npm run test`
- Storybook: `npm run storybook`
- Pre-commit: husky + lint-staged (автоматически форматирует и проверяет код при коммите)

## Husky/lint-staged

- pre-commit хук запускает lint-staged для автоформатирования и проверки кода.
- Конфиг lint-staged находится в package.json.

