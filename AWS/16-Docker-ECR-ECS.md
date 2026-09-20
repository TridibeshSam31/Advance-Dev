# 16 — Docker, ECR and ECS

## Why containers?

Suppose your application needs:

```text
Node.js 22
PostgreSQL client
specific dependencies
environment configuration
```

A container packages the application and its runtime environment.

```text
Docker Image
   |
   +-- Application
   +-- Runtime
   +-- Dependencies
```

## Docker image vs container

Image:

> Template/package.

Container:

> Running instance of an image.

```text
Image
 |
 +--> Container 1
 |
 +--> Container 2
```

## ECR

Amazon Elastic Container Registry stores container images.

Workflow:

```text
Dockerfile
   |
docker build
   |
Docker image
   |
push
   |
ECR
```

## ECS

Amazon Elastic Container Service runs containers.

Conceptual architecture:

```text
                 ALB
                  |
                 ECS
          +-------+-------+
          |               |
       Task 1           Task 2
          |               |
       Container        Container
```

## ECS concepts

### Cluster

Logical grouping of ECS resources.

### Task definition

Describes how a container/task should run.

Contains concepts such as:

- Image
- CPU/memory
- Environment
- Ports
- IAM roles
- Logging

### Task

A running instance of a task definition.

### Service

Maintains a desired number of tasks.

## ECS launch options

At a high level, ECS can run workloads using:

- EC2 capacity
- Fargate

Fargate removes much of the server management burden.

## Deployment flow

```text
Developer
   |
Docker build
   |
ECR
   |
ECS deployment
   |
New task
   |
ALB
   |
Users
```

## Why containers help

- Reproducible environment
- Easier deployments
- Isolation
- Consistent local/production runtime
- Easier horizontal scaling

## ECS vs EC2

EC2 asks:

> How do I manage this server?

ECS asks:

> How do I run and manage these containers?

They solve different layers of the problem.

## Interview questions

- Image vs container?
- ECR vs ECS?
- ECS task vs service?
- Why use Fargate?
- How does ALB connect to ECS?
