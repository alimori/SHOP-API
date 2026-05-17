# NestJs Backend Architecture

## 1. Big Picture: Production Backend Architecture

Real systems are NOT like:

```
controller → service → repository → database
```

They are layered + bounded + event-driven:

```
API Layer (Controllers)
   ↓
Application Layer (Use Cases)
   ↓
Domain Layer (Business Rules)
   ↓
Infrastructure Layer (DB / External Services)
```

## 2. Real Module Structure (NestJS)

Instead of “feature = folder”, production uses bounded contexts:

```
src/
 ├── modules/
 │    ├── product/
 │    │     ├── domain/
 │    │     ├── application/
 │    │     ├── infrastructure/
 │    │     ├── presentation/
 │    │
 │    ├── order/
 │    ├── user/
 │    ├── payment/
 │
 ├── shared/
 ├── config/
 ├── database/
 ```

## 3. Example: Product Module (Real Structure)

### 1. Domain Layer (PURE BUSINESS LOGIC)
```
product/domain/product.entity.ts
```
```
export class Product {
  constructor(
    public readonly id: number,
    public name: string,
    public price: number,
  ) {}

  applyDiscount(percent: number) {
    this.price = this.price - (this.price * percent) / 100;
  }
}
```
**Note:** No database, no NestJS, pure logic.

### 2. Application Layer (Use Cases)

```
product/application/create-product.usecase.ts
```

```
@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly repo: ProductRepository,
  ) {}

  async execute(dto: CreateProductDto) {
    const product = new Product(
      Date.now(),
      dto.name,
      dto.price,
    );

    return this.repo.save(product);
  }
}
```
**Note:** This is business flow (not controller logic).

---

### Infrastructure Layer (DB / TypeORM)

```
product/infrastructure/typeorm/product.repository.ts
```

```
@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private repo: Repository<ProductEntity>,
  ) {}

  save(product: Product) {
    return this.repo.save(product);
  }
}
```
**Note:** Only DB logic here.

---

### 4. Presentation Layer (Controller)

```
product/presentation/product.controller.ts
```

```
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(dto);
  }
}
```
**Note:** Controller should be very thin.

---

## 4. Why this architecture is used

Big systems like Uber/Divar need:
- scalability
- testability
- separation of concerns
- multiple teams working in parallel

---

## 5. Order Module (Real-world flow)

**Order depends on Product + Payment + User**

```
Order Service does NOT directly talk to DB
It orchestrates use cases
```

**Application Layer**

```
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private productRepo: ProductRepository,
    private orderRepo: OrderRepository,
  ) {}

  async execute(dto: CreateOrderDto) {

    const product = await this.productRepo.findById(dto.productId);

    if (!product) throw new Error('Product not found');

    const order = new Order(
      Date.now(),
      product,
      dto.quantity,
    );

    return this.orderRepo.save(order);
  }
}
```

## 6. Event-driven communication (VERY IMPORTANT)
In real systems:

```
Order created
   ↓
Event fired
   ↓
Payment service listens
Notification service listens
```

---

**Example:**

```
this.eventEmitter.emit('order.created', order);
```

## 7. Module Structure (Final Production Version)

```
order/
 ├── domain/
 │     ├── order.entity.ts
 │
 ├── application/
 │     ├── create-order.usecase.ts
 │     ├── cancel-order.usecase.ts
 │
 ├── infrastructure/
 │     ├── order.repository.ts
 │
 ├── presentation/
 │     ├── order.controller.ts
 │
 ├── order.module.ts
```

## 8. Key Differences (Tutorial vs Production)

| Tutorial NestJS            | Production Architecture    |
| -------------------------- | -------------------------- |
| Service handles everything | UseCases handle logic      |
| Controller calls service   | Controller calls use cases |
| Direct repo usage          | Repository abstraction     |
| Monolithic service         | Modular architecture       |
| Tight coupling             | Loose coupling             |


## 9. Problems in simple architecture

If you use:

```
controller → service → repo
```
You get:

- ❌ hard to scale
- ❌ hard to test
- ❌ messy logic
- ❌ tight coupling

## 10. Why companies like Uber/Divar use layered architecture

Because:

- ✅ multiple teams
- ✅ microservices
- ✅ complex business rules
- ✅ high traffic systems
- ✅ independent deployment

## 11. Mental Model

Think like this:
```
Controller → API Gateway

UseCase → Business Brain

Repository → Data Access Layer

Domain → Rules of Universe
```

## 12. When should YOU use this?

| Project size   | Architecture           |
| -------------- | ---------------------- |
| small project  | simple service layer   |
| medium project | modular service        |
| large project  | layered (DDD style)    |
| enterprise     | microservices + events |


## 13. Evolution of Backend Architecture

Most developers evolve like this:
```
Simple CRUD app
```
↓
```
Modular monolith
```
↓
```
Clean Architecture
```
↓
```
Event-driven architecture
```
↓
```
Microservices
```

## 14. What is Clean Architecture?

Clean Architecture separates:
```
Business logic
from
Framework/Database/HTTP
```

Meaning:
```
Your business should NOT depend on NestJS
```

---

### Clean Architecture Layers

```
Presentation Layer
   ↓
Application Layer
   ↓
Domain Layer
   ↓
Infrastructure Layer
```

---

### Example (Shop)
### Presentation Layer

HTTP Controllers
```
POST /orders
```

---

### Application Layer

Use cases:
```
CreateOrderUseCase
```

---

### Domain Layer

Pure business rules:
```
Order
Product
Price calculation
Discount rules
```

---

### Infrastructure Layer

Technical implementations:
```
TypeORM
PostgreSQL
Redis
RabbitMQ
Kafka
```

---

### Real Folder Structure

```
src/
 ├── modules/
 │
 │   ├── order/
 │   │    ├── domain/
 │   │    ├── application/
 │   │    ├── infrastructure/
 │   │    ├── presentation/
 │
 │   ├── product/
 │
 ├── shared/
 ├── config/
```

## 15. What are Microservices?

Instead of:
```
ONE BIG APP
```

You split system into:
```
Small independent services
```

---

### Example

Instead of:
```
shop-api
```
You create:
```
product-service
order-service
payment-service
notification-service
user-service
```
Each has:
```
own DB
own deployment
own logic
```

### Real Uber-style Architecture
```
API Gateway
    ↓
-------------------
| User Service    |
| Order Service   |
| Payment Service |
| Driver Service  |
-------------------
```

## 16. Why Microservices?

### Benefits

- ✅ independent deployment
- ✅ scaling services independently
- ✅ team separation
- ✅ fault isolation
- ✅ technology flexibility

### Problems

- ❌ complexity
- ❌ distributed systems
- ❌ network failures
- ❌ eventual consistency
- ❌ monitoring difficulty

---

### IMPORTANT

Microservices are NOT automatically better.

Small projects should NOT use them.

## 16. Event-Driven Architecture

This is where systems become REALLY scalable.

### Traditional Request Flow
```
Order Service
   ↓
calls Payment Service
   ↓
waits
```

This is synchronous.

---

### Event-driven Flow
```
Order Created
    ↓
Event Bus
    ↓
Payment listens
Notification listens
Analytics listens
```

Services don’t directly call each other.

---

### Example Event Flow
### User creates order
```
POST /orders
```
↓

```
OrderCreatedEvent
```
↓

Consumers react:
```
Payment Service
Notification Service
Inventory Service
Analytics Service
```

---

### Why Events are Powerful

Services become:
```
loosely coupled
```

instead of:
```
tightly coupled
```

## 17. NestJS Event Example (Simple)
Install
```
npm install @nestjs/event-emitter
```

---

### app.module.ts
```
EventEmitterModule.forRoot()
```

---

### Emit Event
```
this.eventEmitter.emit(
  'order.created',
  {
    orderId: 1,
    productId: 2,
  },
);
```

---

### Listen to Event
```
@OnEvent('order.created')
handleOrderCreated(payload: any) {
  console.log(payload);
}
```

---

### Real Production Event Systems

Simple event emitter only works INSIDE app.

Production systems use:

| Broker        | Purpose           |
| ------------- | ----------------- |
| RabbitMQ      | queues/events     |
| Apache Kafka  | huge-scale events |
| Redis Pub/Sub | lightweight       |
| Amazon SQS    | cloud queues      |

## 18. Real Production Example
### Order Service
```
creates order
```
↓

Publishes:
```
order.created
```
↓

---

### Payment Service
```
listens to event
```
↓

charges user

↓

publishes:
```
payment.completed
```
↓

---

### Notification Service
```
sends SMS/email
```

## 19. Eventual Consistency

Microservices avoid giant transactions.

Instead:
```
system becomes eventually consistent
```
Meaning:
```
order created
payment processed later
notification sent later
```

## 20. Real Production Architecture
```
Client
  ↓
API Gateway
  ↓
------------------------
| Product Service      |
| Order Service        |
| Payment Service      |
| Notification Service |
------------------------
  ↓
RabbitMQ / Kafka
```

## 21. Biggest Microservice Problems
### ❌ Distributed Transactions
```
service A succeeds
service B fails
```
Hard problem.

---

### ❌ Debugging

Request travels through many services.

---

### ❌ Monitoring

Need:
```
logs
tracing
metrics
```

---

### ❌ Deployment Complexity

Many Docker containers.

## 22. What Companies ACTUALLY Do

Most companies use:
```
Modular Monolith FIRST
```
Then split only critical services.

---

### Example

Start:
```
shop-api
```
Later split:
```
payment-service
notification-service
```