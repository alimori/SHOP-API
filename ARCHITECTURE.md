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
   ↓
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

