# Online Shop (Clothes)

## Overview

Full-stack online shop for clothes. Backend: Node.js + Express.js, MongoDB (Mongoose), JWT authentication, bcrypt password hashing, validation, modular structure. Frontend: HTML/CSS/JS in `public/` (landing, register/login, catalog, cart, profile, orders). All static files served from Express.

## Setup & Installation

1. Установите Node.js и MongoDB.
2. В терминале:
   ```bash
   cd backend
   npm install
   npm start
   ```
3. Сервер запустится на http://localhost:5000
4. Откройте http://localhost:5000 в браузере.

## API Documentation

### Auth

- `POST /api/auth/register` — регистрация (username, email, password)
- `POST /api/auth/login` — вход (email, password)

### Products

- `GET /api/products` — список товаров
- `GET /api/products/:id` — товар по id

### Orders

- `POST /api/orders` — оформить заказ (требует JWT)
- `GET /api/orders` — мои заказы (JWT)
- `GET /api/orders/:id` — заказ по id (JWT)

### Users

- `GET /api/users/profile` — профиль (JWT)
- `GET /api/users/orders` — история заказов (JWT)

## Структура

- backend/models — схемы Mongoose
- backend/routes — роуты Express
- backend/controllers — логика
- backend/middleware — middleware
- backend/config — конфиги
- backend/public — фронтенд

## Запуск

- Все работает из коробки. Для теста добавьте товары в базу вручную или через MongoDB Compass.
