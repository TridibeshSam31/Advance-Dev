# 12 — Load Balancing

## Why load balancing?

One server eventually becomes a bottleneck or a single point of failure.

Instead:

```text
                 +-- App 1
                 |
Users -> ALB ----+-- App 2
                 |
                 +-- App 3
```

## Application Load Balancer

ALB is designed for HTTP/HTTPS application traffic.

It can route traffic based on request information such as:

- Host
- Path
- Headers, where supported

Example:

```text
api.example.com/users
       |
       v
      ALB
       |
       v
Backend target group
```

## Target groups

A target group contains the backend targets receiving traffic.

Conceptually:

```text
ALB
 |
Target Group
 |
 +-- EC2 #1
 +-- EC2 #2
 +-- EC2 #3
```

## Health checks

The load balancer can check whether targets are healthy.

Example:

```text
GET /health
```

If an instance fails health checks, traffic can be removed from it.

## TLS termination

A common setup:

```text
Client
  |
HTTPS
  |
ALB
  |
HTTP/internal connection
  |
Application
```

TLS can be terminated at the ALB using an appropriate certificate.

## Why not expose every EC2 directly?

Because a load balancer gives you:

- Stable entry point
- Health checking
- Distribution of traffic
- Integration with scaling
- Centralized TLS handling
- Routing capabilities

## ALB vs NLB

High-level:

**ALB**
- Application layer
- HTTP/HTTPS
- Rich HTTP routing

**NLB**
- Network layer
- Very high performance/low latency use cases
- TCP/UDP/TLS scenarios

Choose based on traffic requirements.

## Stateless backend

Load balancing works best when backend instances are stateless.

Avoid storing important session state only in:

```text
EC2 #1 memory
```

because request 2 may reach:

```text
EC2 #2
```

Use shared state where required:

```text
Redis
Database
S3
```

## Interview question

Why does horizontal scaling usually require stateless services?

Because any instance should be able to handle a request without depending on private memory/state from a previous instance.
