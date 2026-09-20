# AWS Study Notes

A structured AWS study folder focused on **backend engineering, cloud deployment, and system design**.

## Source basis

These notes are built around:
- The existing `AWS/info.txt` in the `Advance-Dev` repository.
- The uploaded 100xDevs AWS EC2 deployment material.
- The uploaded 100xDevs frontend deployment material covering S3 + CloudFront.

The source material is expanded into a study sequence rather than copied verbatim.

## Study order

1. AWS Basics
2. Global Infrastructure
3. IAM
4. VPC and Networking
5. EC2
6. Security Groups
7. EBS
8. S3
9. CloudFront
10. Route 53
11. RDS
12. Load Balancing
13. Auto Scaling
14. Redis / ElastiCache
15. SQS / SNS
16. Docker / ECR / ECS
17. Lambda
18. CloudWatch
19. Secrets Manager
20. AWS Architecture
21. Interview Questions

## How to study

For every service, learn four things:

1. **What problem does it solve?**
2. **How does it work?**
3. **Where does it fit in an architecture?**
4. **What trade-offs does it introduce?**

Do not try to memorize AWS product names. Learn the architecture decisions behind them.

## Practical target

By the end, you should be able to explain and build:

```text
Client
  |
Route 53
  |
CloudFront
  |
S3 ------------------ Frontend
  |
ALB
  |
ECS / EC2 ------------ Backend
  |       \
  |        Redis
  |
RDS PostgreSQL

Async work:
Backend -> SQS -> Worker

Observability:
EC2/ECS/RDS -> CloudWatch

Security:
IAM + VPC + Security Groups + Secrets Manager
```
