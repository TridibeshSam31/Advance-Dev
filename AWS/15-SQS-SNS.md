# 15 — SQS and SNS

## Why messaging?

Synchronous architecture:

```text
User
 |
API
 |
Worker
 |
Long task
 |
Response
```

The user may wait too long.

Asynchronous architecture:

```text
User
 |
API
 |
Queue
 |
Immediate response

Worker
 |
Queue
 |
Process task
```

## SQS

Amazon Simple Queue Service is a managed message queue.

A producer sends messages.

A consumer processes them.

```text
Producer -> SQS -> Consumer
```

## Example

Image processing:

```text
Upload
 |
Backend
 |
SQS
 |
Image worker
 |
Resize image
 |
S3
```

The API does not need to perform the entire job.

## Visibility timeout

When a consumer receives a message, the message can become temporarily invisible to other consumers while processing occurs.

If processing fails and the message becomes visible again, another attempt can occur.

## Dead-letter queue

A DLQ stores messages that repeatedly fail processing.

```text
Main Queue
   |
   +--> successful -> done
   |
   +--> repeated failure -> DLQ
```

This prevents a permanently broken message from being retried forever in the main flow.

## At-least-once delivery

Design consumers to tolerate duplicate processing.

This leads directly to:

### Idempotency

If the same message is processed twice, the final business result should remain correct.

Example:

Bad:

```text
chargeCard()
chargeCard()
```

Potentially charges twice.

Better:

```text
process payment with idempotency key
```

## SNS

Amazon Simple Notification Service is a publish/subscribe messaging service.

Concept:

```text
Publisher
   |
  SNS
 / | \
SQS SQS Lambda
```

One event can be delivered to multiple subscribers.

## SQS vs SNS

| SQS | SNS |
|---|---|
| Queue | Pub/sub |
| Consumers pull/process | Publisher sends to topic |
| Work distribution | Fan-out |
| Useful for async jobs | Useful for notifications/events |

## Combined pattern

```text
Application
    |
   SNS
  /   \
SQS   SQS
 |      |
Worker Worker
```

This is a common decoupling pattern.

## Interview questions

- Why use SQS?
- What is a DLQ?
- What is visibility timeout?
- Why should consumers be idempotent?
- SQS vs SNS?
- How would you process millions of jobs asynchronously?
