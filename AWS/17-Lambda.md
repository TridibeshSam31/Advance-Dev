# 17 — Lambda

## What is Lambda?

AWS Lambda is a serverless compute service.

You deploy a function and AWS manages the underlying execution infrastructure.

Conceptually:

```text
Event
  |
Lambda
  |
Function execution
```

## Traditional server

```text
EC2
 |
Node.js process
 |
Running continuously
```

## Serverless function

```text
Request/event
 |
Lambda starts execution
 |
Function runs
 |
Execution ends
```

The exact execution model includes reuse of execution environments, so do not assume a brand-new machine for every invocation.

## Common triggers

Lambda can respond to events from AWS services and HTTP/API integrations.

Examples:

```text
S3 upload -> Lambda
Queue message -> Lambda
HTTP request -> Lambda
Scheduled event -> Lambda
```

## Example: image processing

```text
Client
 |
S3 upload
 |
Lambda
 |
Resize image
 |
S3
```

## Stateless design

Do not rely on local memory as durable application state.

Store durable state in services such as:

- S3
- DynamoDB
- RDS
- Redis where appropriate

## Lambda limitations

Lambda is not automatically the best choice for every backend.

Consider:

- Execution duration
- Cold starts
- Memory/CPU
- Concurrency
- Networking
- Observability
- Cost model
- Stateful workloads

## Lambda vs EC2

EC2:

```text
You manage server
Long-running processes
More control
```

Lambda:

```text
AWS manages execution infrastructure
Event-driven
Less server management
```

## Lambda vs ECS

Use ECS when you want long-running containerized services and more control over runtime behavior.

Use Lambda when the workload fits an event-driven function model.

## Interview questions

- What is serverless?
- When would Lambda be a bad fit?
- What is a cold start?
- How do you make Lambda functions idempotent?
- How do you handle asynchronous failures?
