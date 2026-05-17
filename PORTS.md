# Service Ports

---

# Shop Service

## Swagger API

http://localhost:3000/api

---

# RabbitMQ

## RabbitMQ Management UI

http://localhost:15672

### Default Credentials

Username:
```text
guest
```

Password:
```text
guest
```

### AMQP Port

```text
5672
```

---

# Kafka

Kafka does NOT provide a browser UI by default.

## Kafka Broker

```text
localhost:9092
```

---

# MongoDB

## MongoDB Connection

```text
mongodb://localhost:27017
```

---

# Mongo Express (Optional GUI)

http://localhost:8081

---

# PostgreSQL

## PostgreSQL Connection

Host:
```text
localhost
```

Port:
```text
5432
```

Database:
```text
shop
```

Username:
```text
postgres
```

Password:
```text
1234
```

---

# MinIO

## MinIO Console

http://localhost:9001

### Credentials

Username:
```text
minioadmin
```

Password:
```text
minioadmin
```

---

## MinIO API

```text
http://localhost:9000
```

---

# Email Service

Microservice listening internally through RabbitMQ.

No HTTP port required.

---

# Order History Service

Microservice listening internally through Kafka.

No HTTP port required.

---

# Useful Tools

## PostgreSQL GUI

- DataGrip
- DBeaver
- pgAdmin

---

## MongoDB GUI

- Mongo Compass

---

## API Testing

- Swagger
- Insomnia
- Postman

---

## Kafka GUI

Recommended:

- Kafka UI
- AKHQ
- Conduktor

---

# Suggested Kafka UI Docker

```yaml
kafka-ui:
  image: provectuslabs/kafka-ui

  ports:
    - "8080:8080"

  environment:
    KAFKA_CLUSTERS_0_NAME: local
    KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
```

Then open:

http://localhost:8080

---