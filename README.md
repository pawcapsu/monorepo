# Иерархия
Приложение является монорепозиторием Lerna. Ниже вы сможете найти информацию про все приложения, библиотеки и ассет-папки, про их статус билдинга, запушились ли они на прод-сервер и так далее и такое подобное.

### Библиотека: SHARED (-)
Хранится в приложении *API*, в папке /packages/api/libs/shared
Хранит в себе все интерфейсы, енамы, типы, которые используются как в приложении API (Где они либо имплементируются при создании новой модели, либо просто используются для принудительной типизации), и так же в приложении WEB, что бы пользовательский интерфейс явно понимал какие данные он получает.

Приложение не требует какой-либо постройки, отладки и такого подобного.

### Приложение: API (api.pawcapsu.ml)
![Api application](https://app.buddy.works/dingolediego/pawcapsu/pipelines/pipeline/342569/badge.svg?token=4205cc930f76a88900a6e247e6bd80e546fdc617a0f2c3541abf792d82436e77)
Это приложение, которое занимается обработкой пользовательский данных, инпутов и хранением информации о текущей пользовательской сессии. Построенно на фреймворке *NestJS* с использованием технологий *GraphQL* для коммуникации с внешним миром, и *Mongoose* для хранения типизированных данных в бд *MongoDB*

### Приложение: WEB (www.pawcapsu.ml)
![enter image description here](https://app.buddy.works/dingolediego/pawcapsu/pipelines/pipeline/342269/badge.svg?token=4205cc930f76a88900a6e247e6bd80e546fdc617a0f2c3541abf792d82436e77)
Приложение, которое отвечает за главный пользовательский интерфейс. Используется фреймворк *SvelteKit* с настроенным *TypeScript'ом*, *Apollo GraphQL Client* и так же с алиасами на *shared* библиотеку в приложении *API*, которая хранит в себе информацию про все интерфейсы, енамы, типы и такое подобное.