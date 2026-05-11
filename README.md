# Shop API

Simple backend project built with:

- NestJS
- TypeORM
- PostgreSQL
- Docker
- Swagger

This project demonstrates:

- Product CRUD
- Order CRUD
- Entity relations
- Swagger documentation
- PostgreSQL integration
- Docker database setup

---

# Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeORM | ORM |
| PostgreSQL | Database |
| Docker | Run PostgreSQL |
| Swagger | API documentation |

---

# Project Structure

```bash
src/
├── product/
│   ├── dto/
│   ├── entities/
│   ├── product.controller.ts
│   ├── product.service.ts
│   └── product.module.ts
│
├── order/
│   ├── dto/
│   ├── entities/
│   ├── order.controller.ts
│   ├── order.service.ts
│   └── order.module.ts
│
├── app.module.ts
└── main.ts
```

---

# Installation

## 1. Clone project

```bash
git clone https://github.com/alimori/SHOP-API.git
cd shop-api
```

---

## 2. Install dependencies

```bash
pnpm install
```

---

# PostgreSQL Setup (Docker)

## docker-compose.yml

Create file:

```yaml
services:
  postgres:
    image: postgres:16

    container_name: nest-postgres

    restart: unless-stopped

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: shop

    ports:
      - "5432:5432"

    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## Run PostgreSQL

```bash
docker compose up -d
```

---

## Verify container

```bash
docker ps
```

Expected:

```text
nest-postgres   Up   0.0.0.0:5432->5432/tcp
```

---

# Database Connection

## app.module.ts

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'shop',

  autoLoadEntities: true,

  synchronize: true,
})
```

---

# Run Project

```bash
pnpm run start:dev
```

---

# Swagger Documentation

Swagger URL:

```text
http://localhost:3000/api
```

---

# Entities

## Product Entity

```ts
@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}
```

---

## Order Entity

```ts
@Entity()
export class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product;
}
```

---

# Database Relation

```text
Product 1 ────────∞ Order
```

One product can have many orders.

---

# API Endpoints

# Product APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /products | Create product |
| GET | /products | Get all products |
| PUT | /products/:id | Update product |
| DELETE | /products/:id | Delete product |

---

# Order APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /orders | Create order |
| GET | /orders | Get all orders |
| PUT | /orders/:id | Update order |
| DELETE | /orders/:id | Delete order |

---

# Example Requests

## Create Product

POST `/products`

```json
{
  "title": "Laptop",
  "price": 1200
}
```

---

## Create Order

POST `/orders`

```json
{
  "productId": 1,
  "quantity": 2
}
```

---

# Swagger DTO Example

```ts
export class CreateOrderDto {

  @ApiProperty({
    example: 1,
    description: 'Product ID',
  })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity',
  })
  quantity: number;
}
```

---

# Useful Docker Commands

## Start database

```bash
docker compose up -d
```

---

## Stop database

```bash
docker compose down
```

---

## View logs

```bash
docker logs nest-postgres
```

---

# Future Improvements

- DTO validation
- JWT Authentication
- Pagination
- Filtering
- Migrations
- Unit testing
- Clean architecture
- Microservices

---

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

---

# Author
[Ali Mortazavi](https://www.linkedin.com/in/ali-mortazavi-a1204310b/)
Built for learning NestJS + PostgreSQL + TypeORM.
