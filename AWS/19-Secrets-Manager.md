# 19 — Secrets Manager

## The problem

Applications need secrets:

```text
DATABASE_PASSWORD
JWT_SIGNING_SECRET
API_KEYS
OAuth client secrets
```

Bad:

```js
const password = "super-secret-password";
```

Bad:

```text
.env committed to Git
```

## AWS Secrets Manager

Secrets Manager stores sensitive values securely and allows applications to retrieve them using AWS permissions.

Concept:

```text
Application
   |
IAM Role
   |
Secrets Manager
   |
Secret
```

## Why use secret management?

- Avoid secrets in source code
- Centralized management
- Controlled access
- Rotation support for appropriate secrets
- Auditing/integration with AWS security tooling

## IAM + Secrets Manager

Example:

```text
ECS Task Role
      |
      | secretsmanager:GetSecretValue
      |
Secrets Manager
      |
DATABASE_URL
```

The task should only be allowed to access the required secret.

## Environment variables

Environment variables are useful for configuration, but putting secrets into environment variables does not automatically make them secure.

The important question is:

> Where did the secret come from and who can access it?

## Secret vs configuration

Configuration:

```text
PORT=3000
NODE_ENV=production
```

Secret:

```text
DB_PASSWORD=...
JWT_SECRET=...
```

Treat secrets differently.

## Rotation

Secrets Manager can support secret rotation workflows.

Rotation changes the secret without requiring developers to manually edit application code.

## Secret leakage checklist

Never commit:

```text
AWS keys
Database passwords
Private keys
JWT secrets
API tokens
```

Check:

```text
.gitignore
Git history
CI logs
Docker images
Application logs
```

## Interview questions

- Why not commit secrets?
- IAM role vs secret?
- How would ECS access DB credentials?
- What is secret rotation?
