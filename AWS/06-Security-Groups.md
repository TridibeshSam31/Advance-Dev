# 06 — Security Groups

## What is a Security Group?

A Security Group (SG) is a virtual firewall associated with supported AWS resources such as EC2.

It controls network traffic.

Example:

```text
Internet
   |
   | TCP 443
   v
Security Group
   |
  EC2
```

## Inbound rules

Inbound rules control traffic coming into the resource.

Example:

| Protocol | Port | Source | Purpose |
|---|---:|---|---|
| TCP | 22 | Your IP | SSH |
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS |

Do not expose SSH to the whole internet unless there is a specific reason and compensating controls.

## Outbound rules

Outbound rules control traffic leaving the resource.

The exact default configuration depends on how the security group is configured.

## Stateful behavior

Security groups are stateful.

If an allowed inbound connection is established, return traffic is generally allowed automatically.

This is different from stateless network ACL behavior.

## Ports

Common ports:

```text
22    SSH
80    HTTP
443   HTTPS
3000  Node development
5432  PostgreSQL
6379  Redis
```

## Principle

Only expose ports that are required.

Bad:

```text
0.0.0.0/0 -> many internal ports
```

Better:

```text
Internet -> 443 -> ALB

ALB -> 8080 -> Backend

Backend -> 5432 -> Database
```

## Layered security groups

A clean architecture can use separate SGs:

```text
ALB-SG
  allows 443 from Internet

Backend-SG
  allows application port from ALB-SG

DB-SG
  allows 5432 from Backend-SG
```

This is much better than opening the database to the internet.

## Security group vs firewall

A security group is a cloud network control. Application-level authorization is still necessary.

For example:

```text
SG says:
"Can connect to port 443"

Application says:
"Is this user allowed to delete this account?"
```

These solve different problems.
