# 10 — Route 53

## What is DNS?

DNS maps human-readable names to network destinations.

Instead of remembering:

```text
203.x.x.x
```

users access:

```text
api.example.com
```

## Route 53

Amazon Route 53 is AWS's DNS and domain-related service.

Typical architecture:

```text
api.example.com
      |
   Route 53
      |
      v
Application Load Balancer
```

## Common record types

### A

Maps a hostname to an IPv4 address.

### AAAA

Maps a hostname to an IPv6 address.

### CNAME

Maps a hostname to another hostname.

### Alias

AWS-specific routing mechanism that can point supported names to AWS resources such as CloudFront distributions and load balancers.

## Subdomains

Example:

```text
example.com
www.example.com
api.example.com
admin.example.com
```

A common application setup:

```text
example.com       -> CloudFront
www.example.com   -> CloudFront
api.example.com   -> ALB
```

## DNS TTL

TTL controls how long DNS resolvers may cache a record.

Lower TTL:

- Faster changes
- More DNS queries

Higher TTL:

- More caching
- Changes may take longer to propagate through caches

## DNS is not HTTP

Important:

```text
DNS:
"Where should this hostname go?"

HTTP:
"What should the server do with this request?"
```

## Route 53 + CloudFront

For a frontend:

```text
example.com
    |
Route 53
    |
CloudFront
    |
S3
```

## Route 53 + ALB

For an API:

```text
api.example.com
      |
Route 53
      |
ALB
      |
Backend
```

## Health checks and routing

Route 53 supports health-aware and routing policies for supported architectures.

Do not jump into advanced routing until you understand ordinary DNS records.
