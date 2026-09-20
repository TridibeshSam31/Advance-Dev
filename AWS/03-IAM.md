# 03 — IAM

IAM = Identity and Access Management.

It answers:

> Who is allowed to perform which action on which AWS resource?

## Main concepts

### IAM User

Represents a person or long-lived identity.

### IAM Group

Collection of users to which common permissions can be attached.

### IAM Role

An identity with permissions that can be assumed.

Roles are extremely important for AWS services.

Example:

```text
EC2
 |
IAM Role
 |
Policy
 |
S3:GetObject
```

The application does not need hard-coded AWS access keys.

### Policy

A JSON document defining permissions.

Example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

## Policy structure

Important fields:

- Effect: Allow / Deny
- Action: operation
- Resource: resource being accessed
- Principal: identity receiving the permission in resource-based policies
- Condition: optional restrictions

## Least privilege

Give the smallest permission set necessary.

Bad:

```text
EC2 -> AdministratorAccess
```

Better:

```text
EC2
 |
Role
 |
s3:GetObject
 |
Specific bucket
```

## Authentication vs authorization

Authentication:

> Who are you?

Authorization:

> What are you allowed to do?

IAM is primarily about identity and authorization.

## Root account

The AWS account root user has extremely powerful privileges.

Best practice:

- Do not use root for everyday work.
- Enable MFA.
- Create appropriate IAM identities/roles.
- Avoid creating long-lived credentials unnecessarily.

## Access keys

Access keys are credentials for programmatic access.

Never commit them:

```text
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

into Git.

Use:

- IAM roles
- Environment/secret management where appropriate
- AWS credential tooling

## IAM in an application

Preferred:

```text
EC2/ECS
   |
IAM Role
   |
S3 / SQS / CloudWatch
```

Avoid:

```text
Application
   |
hard-coded AWS keys
```

## Important interview questions

- User vs Role?
- Why are IAM roles preferred for EC2/ECS?
- What is least privilege?
- What is a policy?
- Authentication vs authorization?
- Why should root not be used for daily work?
