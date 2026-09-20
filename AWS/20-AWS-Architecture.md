# 20 — AWS Architecture

This file is the architecture layer tying the individual services together.

## 1. Basic frontend + backend

```text
                 Internet
                    |
               Route 53
              /         \
             /           \
      CloudFront          ALB
          |                |
          S3          Backend servers
                           |
                    PostgreSQL / RDS
```

## 2. Production-style backend

```text
                    Route 53
                        |
                      ALB
                        |
              +---------+---------+
              |                   |
            ECS 1               ECS 2
              |                   |
              +---------+---------+
                        |
                 Redis / Cache
                        |
                     RDS
```

## 3. Private database

```text
                 Internet
                    |
                   ALB
                    |
              Public subnet
                    |
              Private subnet
                    |
                 Backend
                    |
              Private subnet
                    |
                   RDS
```

The goal is to prevent direct public database access.

## 4. Async architecture

```text
Client
  |
API
  |
SQS
  |
Worker
  |
S3 / RDS
```

The API returns quickly while background processing happens asynchronously.

## 5. Fan-out architecture

```text
               Application
                    |
                   SNS
                /   |   \
              SQS  SQS  Lambda
               |    |
             Worker Worker
```

One event can trigger multiple independent processing pipelines.

## 6. Static React deployment

```text
React source
    |
npm run build
    |
dist/
    |
S3
    |
CloudFront
    |
Route 53
    |
Users
```

The uploaded frontend material specifically demonstrates the S3 + CloudFront path and explains Origin Access Control and SPA fallback behavior.

## 7. Container deployment

```text
Developer
    |
Docker build
    |
ECR
    |
ECS
    |
ALB
    |
Users
```

## 8. Full architecture

```text
                         Users
                           |
                       Route 53
                           |
                       CloudFront
                      /          \
                     /            \
                  S3              ALB
              Frontend             |
                                ECS / EC2
                               /    |    \
                              /     |     \
                           Redis    |     Worker
                                    |
                                   RDS
                                    |
                                  SQS
                                    |
                                  Worker

Security:
IAM + VPC + Security Groups + Secrets Manager

Observability:
CloudWatch
```

## 9. How to design an AWS architecture

Do not start with:

> Which AWS service should I use?

Start with:

### Step 1 — Requirements

Ask:

- How many users?
- How much traffic?
- Read/write ratio?
- Availability target?
- Latency requirement?
- Data size?
- Compliance?
- Budget?

### Step 2 — Workload

Classify:

```text
Compute?
Storage?
Database?
Cache?
Queue?
Streaming?
Static content?
```

### Step 3 — Failure

Ask:

> What happens when this component dies?

For each critical component:

```text
Single server?
Single AZ?
Single database?
Single queue consumer?
```

### Step 4 — Scale

Ask:

> What happens at 10x traffic?

Then determine the bottleneck.

### Step 5 — Security

Ask:

- What should be public?
- What should be private?
- Who can access the database?
- Where are secrets stored?
- Which IAM role needs which permission?

### Step 6 — Observability

Define:

- Logs
- Metrics
- Alerts
- Health checks

## Architecture trade-offs

### EC2

More control, more operations.

### ECS/Fargate

Containers with less server management.

### Lambda

Event-driven, serverless, but constrained by its execution model.

### RDS

Managed relational DB, less operational work than self-managing DB on EC2.

### S3

Excellent object storage, not a relational database.

### Redis

Fast in-memory state/cache, but introduces consistency and invalidation considerations.

## Golden rule

AWS architecture is not:

```text
Use the maximum number of AWS services.
```

It is:

```text
Use the simplest architecture that satisfies
availability + scalability + security + latency + cost requirements.
```
