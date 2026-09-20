# 13 — Auto Scaling

## What is Auto Scaling?

Auto Scaling changes compute capacity according to demand and configured policies.

Example:

```text
Low traffic
    |
2 instances

Traffic increases
    |
4 instances

Traffic decreases
    |
2 instances
```

## Why?

Without scaling:

```text
Traffic spike
    |
One server
    |
CPU 100%
    |
Slow responses
```

With scaling:

```text
Traffic spike
    |
Auto Scaling
    |
More instances
    |
Load balancer distributes traffic
```

## Auto Scaling Group

An Auto Scaling Group (ASG) maintains a desired number of instances and can adjust capacity.

Typical setup:

```text
             ALB
              |
       Auto Scaling Group
        /       |       \
      EC2      EC2      EC2
```

## Desired / minimum / maximum

Conceptually:

```text
minimum = 2
desired = 2
maximum = 10
```

The group should not normally go below the minimum or above the maximum.

## Scaling policies

Can react to signals such as:

- CPU utilization
- Request count
- Other CloudWatch metrics

Example:

```text
CPU > threshold
      |
Scale out

CPU < threshold
      |
Scale in
```

## Health replacement

If an instance becomes unhealthy, the ASG can replace it according to configuration.

This is an important reliability property.

## Stateless requirement

If every instance stores user session state locally:

```text
User -> EC2 #1
       session stored in memory

Next request -> EC2 #2
       session missing
```

Solutions include:

- Stateless tokens
- Shared session store
- Redis
- Database

## Scaling vs performance

More servers are not always the answer.

First identify the bottleneck:

```text
CPU?
Memory?
Database?
Network?
Lock contention?
External API?
```

Blindly adding servers can make a database bottleneck worse.

## Interview questions

- What is an ASG?
- What triggers scale-out?
- Why use a load balancer with ASG?
- What happens when an instance becomes unhealthy?
- Why should application instances be stateless?
