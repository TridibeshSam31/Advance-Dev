# 18 — CloudWatch

## What is CloudWatch?

Amazon CloudWatch provides monitoring and observability capabilities for AWS workloads.

Think:

```text
Logs
Metrics
Alarms
Events / automation capabilities
```

## Metrics

Numerical measurements over time.

Examples:

```text
CPU utilization
Request count
Latency
Errors
Memory (when emitted by the workload/agent)
```

## Logs

Applications can emit logs.

Example:

```text
2026-09-20 INFO User login
2026-09-20 ERROR Database timeout
```

Logs help answer:

> What happened?

Metrics help answer:

> How much / how often?

## Alarms

An alarm can react when a metric crosses a configured condition.

Example:

```text
CPU > 80%
   |
CloudWatch Alarm
   |
notification / scaling action
```

## Observability

Three useful pillars:

### Logs

Detailed events.

### Metrics

Numerical measurements.

### Traces

Request flow across services.

CloudWatch is central to AWS monitoring, while distributed tracing may involve additional tooling.

## Application metrics

Do not only monitor CPU.

Track:

```text
HTTP request rate
p95 latency
p99 latency
5xx errors
DB latency
Queue depth
Cache hit rate
```

## Example production architecture

```text
Users
 |
ALB
 |
ECS
 |
Application logs ----> CloudWatch
 |
Metrics -------------> CloudWatch
 |
Alarms --------------> Operations
```

## Alerting principle

An alert should indicate something actionable.

Bad:

```text
Every small CPU spike -> page developer
```

Better:

```text
High error rate sustained for X minutes
```

## Interview questions

- Logs vs metrics?
- What is an alarm?
- What should you monitor for an API?
- Why is CPU alone insufficient?
