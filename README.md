# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## References

https://next-auth.js.org/getting-started/client
https://www.prisma.io/docs/concepts/components/prisma-schema/relations/relation-mode#indexes
https://www.prisma.io/docs/guides/database/planetscale#differences-to-consider
https://tanstack.com/table/v8/docs/api/features/pagination
https://next-auth.js.org/providers/email
https://next-auth.js.org/configuration/options#session
https://trpc.io/docs/client/nextjs/ssg

`npx prisma db seed`

```mermaid
erDiagram
    Committee ||--o{ Membership : has
    Employee ||--o{ Membership : in
    Template o|--o{ Committee : has
    Committee ||--o{ Notification : has
    User ||--o{ Notification : has
    User ||--o{ Session : has
    User ||--o{ Account : has
    Employee {
        Int id PK
        String name
        Boolean is_active
        Committee[] committees
    }
    Committee {
        Int id PK
        String bond "Vínculo"
        string name "Órgão"
        Boolean is_active
        DateTime(N) begin_date
        DateTime(N) end_date
        String(N) ordinance "Portaria"
        String(N) observations
        Membership[] members
        Template(N) template
        Int(N) template_id FK
        Notification[] notifications
    }
    Membership {
        Int id PK
        Employee employee
        Int employee_id FK
        Committee committee
        Int committee_id FK
        String role "@default('Membro(a)')"
        Boolean is_active
        String(N) ordinance "Portaria"
        DateTime(N) begin_date
        DateTime(N) end_date
        String(N) observations
    }
    Template {
        Int id PK
        String name
        Committee[] committees
    }
    Notification {
        Int id PK
        Boolean is_on "@default(true)"
        DateTime(N) last_sent
        Committee committee
        Int committee_id FK "@@unique([committee_id, user_id])"
        User   user
        String user_id 	   FK "@@unique([committee_id, user_id])"
    }
    User {
        String id PK "@default(cuid())"
        String(N) name
        String(N) email UK
        DateTime(N) emailVerified
        String(N) image
        Account[] accounts
        Session[] sessions
        Notification[] notifications
    }
    VerificationToken {
        String identifier "@@unique([identifier, token])"
        String token UK "@@unique([identifier, token])"
        DateTime expires

    }
    Session {
        String id              "@default(cuid())"
        String sessionToken UK
        String userId FK
        DateTime expires
        User user
    }
    Account {
        String id                  PK "@default(cuid())"
        String userId  FK
        User user
        String type
        String provider          "@@unique([provider, providerAccountId])"
        String providerAccountId "@@unique([provider, providerAccountId])"
        String(N) refresh_token
        String(N) access_token
        Int(N) expires_at
        String(N) token_type
        String(N) scope
        String(N) id_token
        String(N) session_state
    }
```
