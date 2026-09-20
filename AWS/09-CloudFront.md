# 09 — CloudFront

## What is CloudFront?

Amazon CloudFront is a content delivery network (CDN).

A CDN distributes content through edge locations closer to users.

## Why CDN?

Suppose your origin is in Mumbai:

```text
User in Delhi
      |
      v
Origin in Mumbai
```

A CDN can cache content at an edge location closer to the user:

```text
User
 |
Nearest CloudFront edge
 |
Origin only when needed
```

## What should be cached?

Good candidates:

- Images
- CSS
- JavaScript bundles
- Videos
- Static HTML
- Other public/static assets

Be careful caching personalized or rapidly changing data.

## CloudFront architecture

```text
                    +-- Edge
                    |
User -> CloudFront -+-- Edge
                    |
                    +-- Edge
                         |
                       Origin
```

The origin may be:

- S3
- Load balancer
- EC2
- Another supported HTTP origin

## S3 + CloudFront

```text
                 CloudFront
                /     |     \
             Edge   Edge    Edge
                \     |     /
                     |
                    S3
```

## Origin Access Control

For an S3 origin, Origin Access Control (OAC) allows CloudFront to access the bucket while keeping direct public access to the origin restricted.

The uploaded frontend material specifically teaches this pattern.

## Cache invalidation

If CloudFront has cached an old file, changing the origin does not necessarily mean every edge immediately serves the new version.

You can invalidate cached paths when required.

A stronger frontend deployment strategy is often content-hashed assets:

```text
app.a83f21.js
app.5c912a.js
```

instead of repeatedly reusing:

```text
app.js
```

## SPA routing

React Router routes such as:

```text
/users/123
/dashboard
/settings
```

are not necessarily physical files in S3.

Configure appropriate error/fallback behavior so the application can receive `index.html` and let the client-side router resolve the route.

The uploaded source material explicitly highlights this problem and the need for an `index.html` error-page fallback.

## CDN vs backend

A CDN is most useful when responses can be cached.

For personalized API responses:

```text
GET /me
```

caching requires careful correctness rules.

Do not assume "put everything behind a CDN" is automatically correct.
