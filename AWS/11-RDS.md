# 11 — RDS

## What is RDS?

Amazon Relational Database Service (RDS) is a managed relational database service.

It supports relational engines such as PostgreSQL and MySQL.

Instead of manually operating every part of a database server:

```text
EC2
 |
Install PostgreSQL
 |
Configure
 |
Backups
 |
Patching
 |
Monitoring
```

RDS handles much of the infrastructure management.

## What RDS does not solve

RDS does not automatically fix:

- Bad schema design
- Missing indexes
- N+1 queries
- Poor SQL
- Long transactions
- Connection exhaustion
- Bad application architecture

You still need database engineering knowledge.

## Typical architecture

```text
Internet
   |
ALB
   |
Backend
   |
RDS PostgreSQL
```

The database should normally be isolated from direct public internet access.

## Multi-AZ

RDS can support high-availability configurations using multiple Availability Zones, depending on engine and configuration.

The idea is:

```text
Application
     |
Database service
   /     \
AZ-A    AZ-B
```

## Read replicas

Read replicas are used for read scaling and certain replication/DR scenarios.

Conceptually:

```text
                Primary
               /       \
             Read     Read
           Replica   Replica
```

Important:

Read replicas are not the same thing as a high-availability standby.

## Backups

RDS supports automated backup capabilities and snapshots.

Understand:

- Backup
- Snapshot
- Restore
- Point-in-time recovery
- Retention

## Connection management

A backend with many concurrent requests can exhaust database connections.

This is why connection pooling matters.

```text
1000 requests
     |
connection pool
     |
limited DB connections
     |
PostgreSQL
```

## PostgreSQL example

Application:

```text
Node.js
   |
DATABASE_URL
   |
RDS PostgreSQL
```

Do not put database passwords directly in source code.

Use a secret management strategy.

## Interview questions

- RDS vs EC2 PostgreSQL?
- Multi-AZ vs Read Replica?
- Why use connection pooling?
- Why put RDS in private subnets?
- How would you scale database reads?
- What happens when a DB connection pool is exhausted?
