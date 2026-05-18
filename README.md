# Shop Microservices Architecture

Author: [Ali Mortazavi](https://www.linkedin.com/in/ali-mortazavi-a1204310b/)

---

# Overview

This project is a production-style backend architecture using:

- NestJS
- PostgreSQL
- MongoDB
- Redis
- RabbitMQ
- Kafka
- MinIO
- Event-Driven Architecture
- Outbox Pattern
- Internal Events
- External Microservices
- Transactional Event Publishing

---

# High Level Architecture


```
                ┌──────────────┐
                │   Frontend   │
                └──────┬───────┘
                       │
                       ▼
               ┌──────────────┐
               │  Shop API    │
               └──────┬───────┘
                      │
      ┌───────────────┼─────────────────┐
      ▼               ▼                 ▼

 PostgreSQL         Redis            Outbox Events
      │               │                     │
      │               │                     │
      ▼               ▼                     ▼

 Product Data    Product Cache      Kafka / RabbitMQ

                                          │
                  ┌───────────────────────┼──────────────────────┐
                  ▼                       ▼                      ▼

            Email Service        SMS Service         Order History Service
             (RabbitMQ)            (Kafka)                 (Kafka)

                  ▼                       ▼                      ▼

               Gmail                 SMPP/Fake SMS           MongoDB

```

# Detailed Architecture

```text
                                    ┌──────────────────────┐
                                    │      Swagger UI      │
                                    │ localhost:3000/api   │
                                    └──────────┬───────────┘
                                               │
                                               ▼

┌─────────────────────────────────────────────────────────────────────┐
│                           SHOP SERVICE                              │
│                         (NestJS Monolith)                           │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Product Module                                               │   │
│  │ Order Module                                                 │   │
│  │ Category Module                                              │   │
│  │ Upload Module (MinIO)                                        │   │
│  │ Outbox Module                                                │   │
│  │ Internal Event System                                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Transaction Flow                                             │   │
│  │                                                              │   │
│  │ CREATE PRODUCT                                               │   │
│  │   ├── Save Product in PostgreSQL and Cache in Redis                            │   │
│  │   ├── Save Outbox Event                                      │   │
│  │   └── Commit Transaction                                     │   │
│  │                                                              │   │
│  │ CREATE ORDER                                                 │   │
│  │   ├── Save Order in PostgreSQL                               │   │
│  │   ├── Save Outbox Event                                      │   │
│  │   └── Commit Transaction                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Outbox Processor                                             │   │
│  │                                                              │   │
│  │ Reads Unprocessed Events                                     │   │
│  │                                                              │   │
│  │ Product Events ─────────────► RabbitMQ                       │   │
│  │ Order Events ───────────────► Kafka                          │   │
│  │                                                              │   │
│  │ Also emits Internal NestJS Events                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Internal Logging Consumer                                    │   │
│  │                                                              │   │
│  │ Consumes Product Events                                      │   │
│  │ Stores Logs into MongoDB                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘


                PRODUCT EVENTS                     ORDER EVENTS
            (create/update/delete)            (create/update/delete)

                        │                                 │
                        ▼                                 ▼

         ┌────────────────────────┐      ┌────────────────────────┐
         │       RabbitMQ         │      │         Kafka          │
         └──────────┬─────────────┘      └──────────┬─────────────┘
                    │                                │
                    ▼                                ▼

┌────────────────────────────────┐   ┌────────────────────────────────┐
│         EMAIL SERVICE          │   │      ORDER HISTORY SERVICE     │
│                                │   │                                │
│ Consumes Product Events        │   │ Consumes Order Events          │
│                                │   │                                │
│ Sends Email to Admin           │   │ Saves Order History            │
│                                │   │ into MongoDB                   │
└────────────────────────────────┘   └────────────────────────────────┘



                     ┌───────────────────────┐
                     │      PostgreSQL       │
                     │                       │
                     │ products              │
                     │ orders                │
                     │ categories            │
                     │ outbox_events         │
                     └───────────────────────┘


                     ┌───────────────────────┐
                     │        MongoDB        │
                     │                       │
                     │ logs                  │
                     │ orderhistories        │
                     └───────────────────────┘


                     ┌───────────────────────┐
                     │         MinIO         │
                     │                       │
                     │ File Storage          │
                     │ Attachments           │
                     └───────────────────────┘
```

---

# Event Flow

## Product Events

```text
Product Created/Updated/Deleted
        │
        ▼
PostgreSQL Transaction
        │
        ▼
Outbox Event Saved
        │
        ▼
Outbox Processor
        │
        ▼
RabbitMQ
        │
        ├──► Email Service
        └──► Future Services
```

---

## Order Events

```text
Order Created/Updated/Deleted
        │
        ▼
PostgreSQL Transaction
        │
        ▼
Outbox Event Saved
        │
        ▼
Outbox Processor
        │
        ▼
Kafka
        │
        ├──► Order History Service
        └──► Future Analytics Services
```

---

# Database Design

## PostgreSQL

Main transactional database.

### Tables

- products
- orders
- categories
- outbox_events

---

## MongoDB

Used for logging/history.

### Collections

- logs
- orderhistories

---

# Internal Events

Used inside Shop Service.

Examples:

- product.created
- product.updated
- product.deleted
- order.created
- order.updated
- order.deleted

Consumers:

- LoggingConsumer
- Future Audit Services
- Future Metrics Services

---

# Why Outbox Pattern?

The Outbox Pattern guarantees:

- Database transaction consistency
- No lost events
- Reliable event publishing
- Eventual consistency
- Retry capability

Without it:

❌ DB commit may succeed but event publish fail

With Outbox:

✅ DB + Event saved atomically

---

# Why Kafka for Orders?

Kafka is ideal for:

- Event streaming
- Event replay
- Analytics
- Multiple consumers
- High throughput
- Event history

Order events are business-critical.

---

# Why RabbitMQ for Products?

RabbitMQ is ideal for:

- Task queues
- Background jobs
- Email sending
- Notifications
- Work distribution

Product notifications fit RabbitMQ very well.

---

# Why MongoDB?

MongoDB is ideal for:

- Flexible schemas
- Logging
- Event history
- Audit trails
- Large append-only datasets

---

# Why MinIO?

MinIO provides:

- S3-compatible object storage
- File uploads
- Attachments
- Media storage
- Local development alternative to AWS S3

---

# Production Improvements

Future improvements:

- JWT Authentication
- Role-Based Access Control (RBAC)
- API Gateway
- CQRS
- Redis Cache
- Elasticsearch
- Kubernetes
- CI/CD
- Distributed Tracing
- OpenTelemetry
- Prometheus + Grafana
- Dead Letter Queues
- Retry Policies
- Idempotency
- Saga Pattern
- Event Versioning

---

# Clean Architecture Layers

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Cross-cutting concerns:

- Logging
- Validation
- Events
- Messaging
- Transactions
- Exception Handling

---

# Technologies

| Technology | Usage |
|---|---|
| NestJS | Backend Framework |
| PostgreSQL | Main Database |
| MongoDB | Logs & History |
| RabbitMQ | Product Messaging |
| Kafka | Order Streaming |
| MinIO | File Storage |
| Swagger | API Documentation |
| TypeORM | ORM |
| Mongoose | Mongo ODM |

---

# Current Features

✅ Products CRUD  
✅ Orders CRUD  
✅ Categories CRUD  
✅ Pagination  
✅ Validation  
✅ Swagger  
✅ PostgreSQL  
✅ MongoDB Logging  
✅ RabbitMQ Events  
✅ Kafka Events  
✅ Transactional Outbox  
✅ Internal Events  
✅ Email Microservice  
✅ Order History Microservice  
✅ MinIO Uploads  
✅ Dockerized Infrastructure  

---

**Note:** See all services [here](./PORTS.md)

---

**Optional:** [Read NestJs Architectures + Comparison](./ARCHITECTURES-COMPARE.md)