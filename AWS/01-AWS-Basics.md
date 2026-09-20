# 01 — AWS Basics

## What is AWS?

Amazon Web Services (AWS) is a cloud computing platform that provides on-demand access to compute, storage, networking, databases, security, messaging, monitoring and many other services.

The core idea is simple:

```text
Traditional:
Buy hardware -> install OS -> maintain hardware -> scale manually

Cloud:
Request resources -> configure them -> pay for usage -> scale as required
```

AWS is therefore an infrastructure platform, not simply "hosting".

## Cloud concepts

### On-demand computing

Resources can be created when needed.

Example:

```text
Need a server
   |
Launch EC2
   |
Use it
   |
Terminate it when no longer needed
```

### Scalability

The ability to handle increasing workload by adding resources.

Two common forms:

- Vertical scaling: make one machine larger.
- Horizontal scaling: add more machines.

```text
Vertical:
2 CPU -> 8 CPU

Horizontal:
1 server -> 4 servers
```

### Elasticity

The ability to increase and decrease resources as demand changes.

Scalability asks: "Can I handle more load?"

Elasticity asks: "Can capacity automatically grow and shrink with demand?"

### High availability

Keeping an application available despite failures.

A common strategy is deploying across multiple Availability Zones.

### Fault tolerance

The system continues operating when part of the system fails.

High availability and fault tolerance are related but not identical.

### Global infrastructure

AWS resources are deployed in Regions and Availability Zones. Edge locations support services such as CloudFront.

## The five foundation services

| Service | Category | Main job |
|---|---|---|
| EC2 | Compute | Virtual servers |
| S3 | Storage | Object storage |
| RDS | Database | Managed relational databases |
| VPC | Networking | Private cloud network |
| IAM | Security | Identity and permissions |

## Shared responsibility model

AWS secures the infrastructure it operates.

You remain responsible for things such as:

- IAM configuration
- Application security
- OS patching on self-managed EC2
- Network rules
- Data protection
- Secrets
- Application code

The exact responsibility depends on the service.

Example:

```text
EC2:
AWS -> physical infrastructure
You -> guest OS + application + configuration

Managed service:
AWS handles more operational work
You still configure and secure your application/data
```

## Core mental model

Think of a backend as several layers:

```text
Identity
   |
Network
   |
Compute
   |
Storage / Database
   |
Caching / Messaging
   |
Observability
```

AWS provides a service for many pieces of this architecture.

## Key questions

- Why use cloud instead of buying servers?
- What is elasticity?
- What is horizontal vs vertical scaling?
- What is high availability?
- What does AWS manage vs what do you manage?
- Why do Regions and AZs exist?
