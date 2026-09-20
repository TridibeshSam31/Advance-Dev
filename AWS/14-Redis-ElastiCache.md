# 14 — Redis / ElastiCache

## What is Redis?

Redis is an in-memory data store commonly used for:

- Caching
- Sessions
- Rate limiting
- Distributed locks
- Queues/streams in appropriate designs
- Pub/Sub

## Basic cache pattern

```text
Client
  |
Backend
  |
Redis
  |
  | hit
  v
Response
```

On a miss:

```text
Backend
  |
Redis MISS
  |
PostgreSQL
  |
Redis SET
  |
Response
```

## Cache-aside

Common pattern:

```text
1. Check cache
2. If hit -> return
3. If miss -> query DB
4. Store result in cache
5. Return result
```

Pseudo-code:

```js
let value = await redis.get(key);

if (!value) {
  value = await db.query(...);
  await redis.set(key, JSON.stringify(value), { EX: 60 });
}

return value;
```

## TTL

TTL = Time To Live.

Example:

```text
user:123
TTL = 60 seconds
```

After expiration, the key is removed/considered expired according to Redis behavior.

## Cache invalidation

The hard part is not reading from cache.

It is keeping cached data correct.

Example:

```text
DB updated
 |
Old cache still exists
 |
User receives stale value
```

Possible approaches:

- Short TTL
- Explicit invalidation
- Write-through patterns
- Versioned keys

## ElastiCache

Amazon ElastiCache is a managed caching service for supported in-memory engines such as Redis/Valkey depending on AWS offering and current configuration.

The important concept:

```text
Your application
      |
Managed cache
      |
AWS handles infrastructure operations
```

## Rate limiting

Redis can support distributed rate limiting.

Example:

```text
user:123:requests
```

Increment and expire within a window.

Architecture:

```text
Client
 |
ALB
 |
Backend instances
 |   |   |
 +---Redis---+
```

Without shared Redis, each instance could maintain its own counter and produce inconsistent limits.

## Distributed locking

Redis can be used for coordination in some designs, but locking correctness is subtle.

Never use a distributed lock casually for business-critical correctness without understanding failure modes.

## Interview questions

- Why Redis instead of PostgreSQL for cache?
- What is cache-aside?
- What is TTL?
- What is cache invalidation?
- Why is Redis useful with multiple backend instances?
