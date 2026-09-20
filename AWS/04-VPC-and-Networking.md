# 04 — VPC and Networking

## What is a VPC?

A VPC (Virtual Private Cloud) is an isolated virtual network in AWS.

You define networking concepts such as:

- IP address ranges
- Subnets
- Routes
- Internet connectivity
- Security controls

Mental model:

```text
AWS Region
 |
VPC
 |
 +-- Public Subnet
 |
 +-- Private Subnet
```

## CIDR

A CIDR block defines an IP range.

Example:

```text
10.0.0.0/16
```

A `/16` contains a larger range than a `/24`.

Example subnet:

```text
VPC:    10.0.0.0/16

Subnet: 10.0.1.0/24
```

## Subnet

A subnet is an IP range inside a VPC and is associated with an Availability Zone.

A subnet is commonly described as public or private based on its routing.

### Public subnet

Has a route that allows internet connectivity through an Internet Gateway.

### Private subnet

Does not directly expose resources to the public internet.

Typical architecture:

```text
Internet
   |
Internet Gateway
   |
Public subnet
   |
ALB
   |
Private subnet
   |
Application
   |
Private subnet
   |
Database
```

## Internet Gateway

Provides internet connectivity for resources in a VPC when routing and public addressing are configured appropriately.

## Route table

A route table determines where network traffic goes.

Conceptually:

```text
Destination       Target
0.0.0.0/0         Internet Gateway
10.0.0.0/16       local
```

## NAT Gateway

A private subnet may need outbound internet access without allowing inbound internet connections.

Typical pattern:

```text
Private EC2
   |
NAT Gateway
   |
Internet Gateway
   |
Internet
```

NAT is primarily for outbound connectivity from private resources.

## Security groups vs network ACLs

Security Group:
- Resource-level virtual firewall
- Stateful
- Controls allowed traffic

Network ACL:
- Subnet-level network filter
- Stateless
- Supports allow and deny rules

## DNS

Applications commonly use DNS names instead of raw IP addresses.

Example:

```text
api.example.com
      |
     DNS
      |
Load Balancer
```

## Why databases belong in private subnets

A database normally should not accept arbitrary internet traffic.

Preferred:

```text
Internet
   |
ALB
   |
Backend
   |
RDS
```

Not:

```text
Internet
   |
RDS :5432
```

## Interview questions

- What is a VPC?
- Public vs private subnet?
- What does an Internet Gateway do?
- Why use NAT?
- Security Group vs NACL?
- Why place databases in private subnets?
