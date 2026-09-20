# 02 — AWS Global Infrastructure

## Hierarchy

```text
AWS
 |
 +-- Region
      |
      +-- Availability Zone
      |      |
      |      +-- Data centers
      |
      +-- Availability Zone
      |
      +-- Availability Zone
```

## Region

A Region is a geographic AWS location containing multiple isolated Availability Zones.

Examples:

- Mumbai: `ap-south-1`
- US East (N. Virginia): `us-east-1`

Choose a Region based on factors such as:

- Latency to users
- Service availability
- Compliance/data residency
- Pricing
- Disaster recovery requirements

## Availability Zone

An Availability Zone is an isolated infrastructure location inside a Region.

A production application should avoid making one AZ a single point of failure when availability matters.

Example:

```text
                 Region
        +----------+----------+
        |                     |
       AZ-A                  AZ-B
        |                     |
      App 1                  App 2
```

## Data centers

AWS operates physical data centers underneath its cloud infrastructure. You normally interact with logical AWS resources rather than individual data centers.

## Edge locations

CloudFront uses a global network of edge locations to serve content closer to users.

```text
Origin
  |
CloudFront
  |
+--------+---------+
Edge A   Edge B   Edge C
```

## Region vs AZ

Remember:

```text
Region = geographic area

AZ = isolated infrastructure location within a Region
```

## Multi-AZ design

Bad:

```text
Internet -> App in AZ-A -> DB
```

If AZ-A fails, the application can become unavailable.

More resilient:

```text
             Load Balancer
              /          \
            AZ-A         AZ-B
             |             |
           App A         App B
              \           /
               \         /
                 Database
```

For databases, the exact high-availability mechanism depends on the database service.

## Multi-Region

Multi-Region means deploying components across different AWS Regions.

Possible reasons:

- Disaster recovery
- Global latency
- Regulatory requirements
- Business continuity

But Multi-Region is significantly more complex.

Do not use it just because it sounds "more scalable".

## Exam/interview distinction

**Scalability** = handle more workload.

**Availability** = remain accessible.

**Durability** = data remains intact.

**Fault tolerance** = continue functioning despite component failure.

These are different properties.
