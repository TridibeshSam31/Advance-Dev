# 07 — EBS

## What is EBS?

Amazon Elastic Block Store (EBS) provides block storage volumes for EC2.

Think:

```text
EC2
 |
 +-- CPU
 +-- RAM
 +-- EBS volume
       |
       +-- filesystem
       +-- application files
       +-- data
```

## Block storage vs object storage

### EBS

Block storage.

Designed to behave like a disk attached to compute.

### S3

Object storage.

Designed for objects/files accessed through an API.

```text
EBS:
EC2 -> filesystem -> file

S3:
Application -> S3 API -> object
```

## Persistence

EBS volumes persist independently of the lifecycle of the running compute process, subject to volume/instance configuration and deletion settings.

Do not assume every EC2 local storage path is durable.

## Snapshots

EBS snapshots are point-in-time backups of EBS volumes.

Useful for:

- Backup
- Recovery
- Creating new volumes
- Disaster recovery workflows

## Performance

EBS volume types differ in performance and cost characteristics.

Choose based on:

- IOPS
- Throughput
- Latency requirements
- Capacity
- Workload

## When to use EBS

Good for:

- EC2 operating systems
- Application files
- Databases running on EC2
- Persistent block storage

Do not use EBS as your default choice for every file.

For large static assets, S3 is usually a better fit.

## Interview question

Why not store user-uploaded images directly on the EC2 filesystem?

Because the filesystem of one server is a poor shared storage layer when applications scale horizontally.

Better:

```text
Users
  |
Backend
  |
S3
```

Then multiple application instances can access the same object store.
