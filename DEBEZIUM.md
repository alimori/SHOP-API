# Register Debezium Connector

Debezium is used for Capture Data Change (CDC) on database.

## STEP 1 — RUN DOCKER

First ensure containers running:

```
docker compose up -d
```

---

## STEP 2 — CHECK DEBEZIUM

Open:

http://localhost:8083/

You should see JSON response.

---

## STEP 3 — OPEN TERMINAL

Open terminal INSIDE:

shop-api/

Example:

C:\Ali\Projects\shop-api

**VERY IMPORTANT:**
You must be in SAME folder where:

***docker-compose.yml*** exists
debezium folder exists

---


## STEP 4 — RUN CURL
```
Windows PowerShell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8083/connectors" `
  -ContentType "application/json" `
  -InFile ".\debezium\register-order-connector.json"
```