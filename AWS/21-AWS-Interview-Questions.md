# 21 — AWS Interview Questions

## Beginner

### 1. What is AWS?

A cloud platform providing on-demand infrastructure and managed services.

### 2. What is EC2?

Elastic Compute Cloud, AWS's virtual compute service.

### 3. What is S3?

Object storage for files and other objects.

### 4. What is RDS?

Managed relational database service.

### 5. What is VPC?

A logically isolated virtual network in AWS.

### 6. What is IAM?

Identity and Access Management for authentication/authorization and permissions.

---

## Networking

### 7. What is a Region?

A geographic AWS location containing multiple Availability Zones.

### 8. What is an Availability Zone?

An isolated infrastructure location within a Region.

### 9. Public vs private subnet?

A public subnet has routing that can provide internet connectivity; a private subnet is not directly exposed to the public internet.

### 10. What is an Internet Gateway?

A VPC component providing internet connectivity when appropriate routing/addressing is configured.

### 11. What is a NAT Gateway?

Provides outbound internet access for private resources without making them directly reachable from the internet.

### 12. Security Group vs NACL?

Security Groups are stateful, resource-level controls. NACLs are stateless subnet-level controls.

---

## EC2

### 13. What is an AMI?

A template used to launch EC2 instances.

### 14. What is EBS?

Block storage associated with EC2.

### 15. How do you SSH into EC2?

A common Linux workflow uses an SSH key and the instance's reachable address:

```bash
chmod 400 key.pem
ssh -i key.pem ubuntu@<address>
```

### 16. Why use Nginx?

As a reverse proxy, TLS termination point, static server and traffic entry point.

---

## S3

### 17. S3 vs EBS?

S3 is object storage. EBS is block storage attached to compute.

### 18. Why use S3 for user uploads?

It provides durable shared object storage that is independent of a specific backend server.

### 19. What is versioning?

Keeping multiple versions of an object.

### 20. What are lifecycle rules?

Rules that transition or delete objects according to conditions.

---

## CloudFront

### 21. What is a CDN?

A distributed network for delivering content closer to users.

### 22. Why use CloudFront with S3?

S3 stores the content; CloudFront caches/distributes it closer to users.

### 23. What is OAC?

Origin Access Control allows CloudFront to securely access an origin such as S3 without requiring the origin to be publicly accessible.

### 24. Why can React routes return 404 after S3 deployment?

Because `/dashboard` is a client-side route, not necessarily an S3 object. Configure fallback behavior to serve `index.html`.

---

## Database

### 25. RDS vs PostgreSQL on EC2?

RDS provides managed database infrastructure and operational features; PostgreSQL on EC2 gives more direct control but more operational responsibility.

### 26. Multi-AZ vs Read Replica?

Multi-AZ primarily supports availability/failover. Read replicas primarily support read scaling and replication use cases.

### 27. Why connection pooling?

Opening a new database connection for every request is expensive and can exhaust DB resources. Pooling reuses a controlled set of connections.

---

## Load balancing

### 28. Why use a load balancer?

To distribute traffic, perform health checks and provide a stable entry point to multiple backend instances/tasks.

### 29. Why should application servers be stateless?

Because any instance should be able to handle a request when traffic is distributed across instances.

### 30. What is health checking?

The load balancer checks whether a target is capable of serving traffic.

---

## Scaling

### 31. Vertical vs horizontal scaling?

Vertical: larger machine.

Horizontal: more machines.

### 32. What is Auto Scaling?

Automatically adjusts compute capacity according to configured policies and workload signals.

### 33. What happens when traffic drops?

A properly configured scaling policy can reduce capacity toward the desired level.

---

## Redis

### 34. Why Redis?

Fast in-memory access for caching and other low-latency use cases.

### 35. What is cache-aside?

Read cache first; on miss, read database and populate cache.

### 36. Why is cache invalidation difficult?

Because cached values can become stale when the source of truth changes.

---

## Messaging

### 37. Why use SQS?

To decouple producers and consumers and process work asynchronously.

### 38. What is a DLQ?

A queue for messages that repeatedly fail processing.

### 39. What is visibility timeout?

A period during which a received SQS message is hidden from other consumers while being processed.

### 40. Why idempotency?

Because asynchronous systems can deliver/retry work more than once.

### 41. SQS vs SNS?

SQS is a queue. SNS is a pub/sub notification/fan-out mechanism.

---

## Containers

### 42. ECR vs ECS?

ECR stores container images. ECS runs container workloads.

### 43. Image vs container?

Image is the packaged template. Container is a running instance.

### 44. Why use containers?

Reproducible deployments, dependency isolation and easier operational consistency.

---

## Serverless

### 45. What is Lambda?

Event-driven serverless compute.

### 46. When would you avoid Lambda?

When the workload requires long-running processes, specialized runtime behavior, or does not fit Lambda's execution/concurrency model.

---

## Security

### 47. Why use IAM roles?

They provide temporary/service-assumed permissions without embedding long-lived access keys into applications.

### 48. What is least privilege?

Grant only the permissions required to perform a task.

### 49. Why use Secrets Manager?

To securely store and control access to sensitive credentials and secrets.

---

## System design questions

### 50. Design a scalable URL shortener on AWS.

Expected discussion:

```text
Route 53
   |
ALB / API
   |
ECS/EC2
   |
Redis
   |
RDS
```

Discuss:
- Read-heavy workload
- Cache
- Database indexes
- Horizontal scaling
- Idempotency
- Monitoring

### 51. Design image upload.

```text
Client
 |
Backend
 |
Presigned S3 URL
 |
S3
 |
Event
 |
SQS/Lambda
 |
Image processing
```

Discuss:
- Large file uploads
- Direct-to-S3 upload
- Async processing
- Metadata in DB

### 52. Design a notification system.

```text
Application
 |
SNS
 |
+---- SQS -> Email worker
+---- SQS -> Push worker
+---- SQS -> SMS worker
```

Discuss:
- Fan-out
- Retries
- DLQ
- Idempotency
- Rate limits

### 53. Design a highly available API.

Discuss:

```text
Route 53
 |
ALB
 |
Multi-AZ ECS/EC2
 |
Redis
 |
Multi-AZ database configuration
```

Then discuss:
- Health checks
- Auto scaling
- Backups
- Monitoring
- Failure recovery

---

# Final revision checklist

Before saying "I know AWS", you should be able to explain without notes:

- [ ] Region
- [ ] Availability Zone
- [ ] VPC
- [ ] Public/private subnet
- [ ] Internet Gateway
- [ ] NAT Gateway
- [ ] Route table
- [ ] Security Group
- [ ] IAM User
- [ ] IAM Role
- [ ] IAM Policy
- [ ] EC2
- [ ] AMI
- [ ] EBS
- [ ] S3
- [ ] S3 Versioning
- [ ] S3 Lifecycle
- [ ] CloudFront
- [ ] OAC
- [ ] Route 53
- [ ] RDS
- [ ] Multi-AZ
- [ ] Read Replica
- [ ] ALB
- [ ] Target Group
- [ ] Auto Scaling
- [ ] Redis
- [ ] Cache-aside
- [ ] SQS
- [ ] DLQ
- [ ] SNS
- [ ] Docker
- [ ] ECR
- [ ] ECS
- [ ] Lambda
- [ ] CloudWatch
- [ ] Secrets Manager

## Final architecture test

Draw this from memory:

```text
User
 |
Route 53
 |
CloudFront -------- S3
 |
ALB
 |
ECS/EC2
 |      \
Redis    SQS
 |
RDS

IAM + VPC + Security Groups + Secrets Manager
CloudWatch -> logs + metrics + alarms
```

If you can explain why every arrow exists, you understand the architecture.
