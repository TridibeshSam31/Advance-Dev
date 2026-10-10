# Backend API Performance, Debugging & Optimization

> Practical guide to debugging slow APIs and backend bugs using Node.js, Express, Prisma and PostgreSQL.

## Core mindset

Bhai, backend debugging seekhne ke liye ek mindset develop karna padega:

**API slow hai toh turant database, Redis ya code ko blame mat kar. Pehle evidence collect kar, phir bottleneck isolate kar, aur uske baad optimize kar.**

Backend debugging ka professional workflow hai: measure → isolate → fix → verify.

# 1. API response time actually kin cheezon se milkar banta hai?

Maan lo tu `GET /api/dashboard` hit karta hai aur response aane mein 1.2 seconds lagte hain.

1. **Request received:** Network, reverse proxy aur server queue.
2. **Middleware:** Authentication, validation, logging.
3. **Business logic:** Service functions, loops, transformations.
4. **Database / external APIs:** SQL queries, Redis, AI providers, payment APIs.
5. **Response preparation:** Serialization, JSON conversion, response send.

Ye logical breakdown hai; exact timing boundaries alag se instrument karni padengi.

### Response time ke alag meanings

- **Server processing time:** Request server par receive hone se response complete hone tak ka time.
- **Database query time:** SQL queries ko execute karne mein laga time.
- **Client-observed latency:** Browser se request start hone se response receive hone tak ka time; ismein network bhi include hai.
- **TTFB:** Browser ko response ka pehla byte milne tak ka time.

Inko mix mat karna. Server logs mein 100 ms dikh rahe hain, lekin browser mein 600 ms lag rahe hain, toh network, proxy, queueing ya client-side factors investigate karne honge.

# 2. Step one: API ki timing measure karna

Express mein request-duration logging add karo:

```ts
import type { Request, Response, NextFunction } from "express";
import { performance } from "node:perf_hooks";

export function requestTiming(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = performance.now();

  res.once("finish", () => {
    const durationMs = performance.now() - start;

    console.log({
      method: req.method,
      path: req.route?.path ?? req.path,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    });
  });

  next();
}
```

Middleware ko routes se pehle register karo:

```ts
app.use(requestTiming);
app.use("/api", apiRouter);
```

Example output:

```text
GET /api/users      200   35.42 ms
GET /api/dashboard  200  843.17 ms
POST /api/generate  200  4200.53 ms
```

Ab guesswork ke bajaye measurable information hai.

**Important:** `finish` event batata hai ki response data server ke writable stream ko hand off ho gaya hai; iska matlab ye nahi ki client ne saare bytes receive kar liye. Aur `req.route?.path` ko middleware mein log karne se route pattern available na bhi ho sakta hai, isliye production mein route templates ko router level par explicitly instrument karna better hai.

Production logging mein raw query strings, tokens, passwords ya personal data log mat karna.

# 3. Interactive latency model: slow API ko kaise diagnose karein?

Ek hypothetical model mein teen durations consider karo:

- Server overhead.
- Database work.
- External API.

Agar operations sequential hain, estimated duration:

```text
server overhead + database duration + external API duration
```

Agar database aur external API independent hain aur parallel chal sakte hain:

```text
server overhead + max(database duration, external API duration)
```

Example: server overhead 100 ms, database 650 ms aur external API 200 ms ho:

- Sequential: approximately 950 ms.
- Parallel: approximately 750 ms.

Agar external API 2 seconds le rahi hai aur database 50 ms, toh database index optimize karna primary fix nahi hoga.

Ye simplified model hai. Real timings mein network, scheduling, contention aur dependency overhead bhi hote hain.

# 4. Step two: Route ke andar exact bottleneck pakadna

Maan lo endpoint:

```ts
app.get("/api/dashboard", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
    });

    const credits = await fetchCreditsFromProvider(user!.id);

    res.json({ user, projects, credits });
  } catch (error) {
    next(error);
  }
});
```

Is code mein teen major operations hain:

1. User query.
2. Projects query.
3. External provider call.

Agar inmein se koi ek slow hai, total response slow ho sakta hai.

### Har stage ka duration log karo

```ts
import { performance } from "node:perf_hooks";

async function measure<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = performance.now();

  try {
    return await operation();
  } finally {
    const durationMs = performance.now() - start;

    console.log({
      stage: name,
      durationMs: Number(durationMs.toFixed(2)),
    });
  }
}
```

Usage:

```ts
const user = await measure("user-query", () =>
  prisma.user.findUnique({
    where: { id: req.user!.id },
  })
);

const projects = await measure("projects-query", () =>
  prisma.project.findMany({
    where: { userId: req.user!.id },
  })
);

const credits = await measure("credits-provider", () =>
  fetchCreditsFromProvider(user!.id)
);
```

Example output:

```text
user-query         12 ms
projects-query    480 ms
credits-provider  920 ms
```

Ab investigation ka direction clear hai: external provider aur projects query ko priority do.

`measure()` operation ke andar thrown errors ko swallow nahi karta; error propagate hota hai aur timing `finally` mein record hoti hai.

# 5. Step three: Sequential code ko parallel kab chalana chahiye?

Maan lo do independent operations hain:

```ts
const projects = await getProjects(userId);
const notifications = await getNotifications(userId);
```

Agar projects 300 ms aur notifications 200 ms lete hain, sequential execution roughly 500 ms le sakta hai.

Dono independent hain toh:

```ts
const [projects, notifications] = await Promise.all([
  getProjects(userId),
  getNotifications(userId),
]);
```

Execution time roughly slower operation ke aas-paas ho sakta hai, yani 300 ms, plus overhead.

Lekin blindly har query ko `Promise.all()` mein mat daalna:

- Agar second query ko first query ka result chahiye, parallel execution possible nahi.
- Agar 1000 queries ek saath chala di, database pool overload ho sakta hai.
- `Promise.all()` mein ek promise reject hui toh aggregate promise reject ho jaata hai, lekin baaki already-started operations automatically cancel nahi hote.
- Database transactions mein operations ko parallelize karna ORM aur transaction constraints ke kaaran useful ya supported nahi bhi ho sakta.

**Rule:** independent operations parallel karo, dependent operations sequential rakho, aur concurrency ko control karo.

# 6. Step four: Slow database queries debug karna

Node.js backend mein API latency ka common cause unnecessary database work hota hai.

## 6.1 Prisma query logging

Development mein query events enable karo:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "warn" },
  ],
});

prisma.$on("query", (event) => {
  console.log({
    durationMs: event.duration,
    query: event.query,
  });
});
```

Ab SQL query aur Prisma-reported duration inspect kar sakta hai.

Caution: query logging development mein useful hai, lekin production mein sensitive parameters aur high log volume ka risk hai. Full SQL logs ko uncontrolled production logging mein mat chalao.

## 6.2 `EXPLAIN ANALYZE` se actual query plan inspect karo

Example query:

```sql
SELECT id, name, email
FROM users
WHERE email = 'student@example.com';
```

Run:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, name, email
FROM users
WHERE email = 'student@example.com';
```

Plan mein ye cheezein dekho:

- `Seq Scan`: table sequentially scan ho rahi hai.
- `Index Scan`: index ke through matching rows retrieve ho rahi hain.
- `actual time`: nodes ki measured execution timing.
- `rows`: actual rows kitni process hui.
- `Buffers`: data pages read ya cache se access hue.

`Seq Scan` apne aap mein bug nahi hai. Chhoti table ya large fraction of rows retrieve karte waqt sequential scan index se faster ho sakti hai.

Agar email lookup frequent hai aur email unique honi chahiye, schema mein appropriate unique constraint/index consider karo:

```sql
CREATE UNIQUE INDEX users_email_key
ON users (email);
```

Existing constraints inspect karna zaroori hai; agar unique index already hai, duplicate index create mat karo.

## 6.3 N+1 query problem

Bad pattern:

```ts
const posts = await prisma.post.findMany();

for (const post of posts) {
  post.author = await prisma.user.findUnique({
    where: { id: post.authorId },
  });
}
```

100 posts hain toh roughly 101 queries chal sakti hain.

Better:

```ts
const posts = await prisma.post.findMany({
  take: 20,
  include: {
    author: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});
```

Ye relation loading ko optimize karne ka common approach hai. Actual number aur shape of SQL queries Prisma configuration aur version ke hisaab se vary kar sakte hain; logs se verify karo.

## 6.4 Connection pool bhi bottleneck ho sakta hai

Maan lo SQL query sirf 20 ms leti hai, lekin API response 500 ms hai. Possible reason: database connection available hone ka wait.

Do metrics alag rakho:

- Query execution time.
- Connection acquisition / pool wait time.

Prisma version, driver adapter aur deployment architecture ke hisaab se pool metrics expose karne ka tareeka different ho sakta hai. Pool size ko bina measurement badha dena bhi galat hai — PostgreSQL par excessive connections performance aur memory dono kharab kar sakte hain.

# 7. Step five: Common backend bugs ko pehchaano

### Duplicate API requests

Frontend effect loops, retry loops, repeated button submissions ya duplicate event handlers. Request initiator aur correlation IDs inspect karo.

### Request hangs

External API timeout missing, unresolved promise, database lock ya stream response finish na hona. Stage timings aur timeout logs use karo.

### Node.js CPU spike

Large synchronous loops, expensive JSON transformations, regex ya CPU-heavy calculations event loop ko block kar sakte hain.

### Database latency spike

Slow query plan, lock contention, connection pool exhaustion, large result sets ya N+1 queries.

### Intermittent 500 errors

Unhandled errors, upstream failures, timeout exceptions ya invalid data. Stack traces aur sanitized error context log karo.

# 8. Step six: External API calls ke liye timeouts aur error handling

AI APIs, payment gateways aur third-party services kabhi-kabhi slow ya unavailable ho sakti hain.

```ts
async function fetchProviderData() {
  const response = await fetch(
    "https://provider.example.com/data",
    {
      signal: AbortSignal.timeout(3000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Provider returned ${response.status}`
    );
  }

  return response.json();
}
```

Is example mein request ka timeout 3 seconds hai. Timeout aane par fetch reject hoga aur calling code ko error handle karna chahiye.

Production mein:

- Timeouts ko service ke latency expectations ke according set karo.
- Retries sirf suitable errors par, bounded attempts aur backoff ke saath karo.
- Non-idempotent operations, jaise payment creation, ko bina idempotency protection blindly retry mat karo.
- Third-party outage ke liye graceful fallback ya circuit breaker consider karo.
- Agar endpoint external provider ka wait kar rahi hai, user ko meaningful loading state ya asynchronous job pattern dena useful ho sakta hai.

# 9. Node.js backend ko debugger se kaise debug karein?

Logs se timing pata chalti hai, lekin har bug timing issue nahi hota. Kabhi wrong variable, incorrect condition, null value, ya unexpected execution path hota hai.

## Method A: VS Code breakpoints

Example Express route:

```ts
app.get("/api/users/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

Breakpoint in lines par lagana useful hoga:

1. `const userId = req.params.id`
2. `prisma.user.findUnique(...)`
3. `if (!user)`
4. `res.json(user)`

Debugger controls:

- **Continue:** execution aage chalao.
- **Step Over:** current line execute karke next line par jao.
- **Step Into:** function ke andar jao.
- **Watch:** kisi variable ki value observe karo.
- **Call Stack:** function tak execution kaise pahunchi, dekho.

## Method B: Node Inspector

```bash
node --inspect-brk dist/server.js
```

Ye Node Inspector enable karta hai aur first line par execution pause karta hai. Chrome DevTools ya VS Code debugger se attach kar sakta hai.

Development mein apne project ke actual start command ka use karo. Production server ko bina security precautions ke publicly accessible inspector port ke saath expose mat karna.

# 10. Error handling aur structured logging

Ek professional backend mein sirf `console.log("error")` sufficient nahi hota.

Har failure ke liye ye information useful hoti hai:

- Request ID.
- Route aur HTTP status.
- Error type aur stack trace.
- Operation ka naam.
- Request duration.
- Relevant dependency, jaise PostgreSQL ya external provider.

Express error middleware ka basic example:

```ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

app.use((
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error({
    message: err.message,
    method: req.method,
    path: req.path,
    stack: err.stack,
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error",
  });
});
```

Ye middleware routes ke baad register hona chahiye.

Production mein isko structured logger jaise Pino ke saath implement karna better hai. Request ID ko har related log event ke saath propagate karo, lekin tokens, passwords aur sensitive request bodies log mat karna. Expected client errors ko har baar unexpected server failures ki tarah report bhi mat karo.

# 11. Load testing: ek user ke liye fast hona enough nahi hai

Maan lo endpoint 10 requests par fast hai, lekin 500 concurrent users aate hi 5 seconds lene lagta hai.

Possible causes:

- Database connection pool exhaust ho gaya.
- CPU event loop block kar raha hai.
- External API rate limit hit ho gayi.
- Database queries locks ka wait kar rahi hain.
- Memory ya network saturation ho rahi hai.

Load testing ke liye [k6](https://grafana.com/docs/k6/latest/) ya [Autocannon](https://github.com/mcollina/autocannon) use kar sakta hai.

Example k6 script:

```js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300"],
  },
};

export default function () {
  const response = http.get(
    "http://localhost:3000/api/health"
  );

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
```

Run:

```bash
k6 run load-test.js
```

Yahan `p(95)<300` ka matlab hai ki test ke 95% HTTP request durations 300 ms se kam hone chahiye. Ye example target hai, universal production standard nahi.

Sirf `/api/health` test karne se business endpoints ki performance prove nahi hogi. Realistic test mein representative database queries, authentication aur application workload include karo. Production-like data aur safe test environment use karna.

# 12. Complete backend debugging playbook

## Request measurement
- [ ] Slow endpoint identify kiya.
- [ ] Server-side duration aur browser latency compare ki.
- [ ] Status codes aur request IDs inspect kiye.

## Code investigation
- [ ] Route ke har major stage ki timing measure ki.
- [ ] Sequential operations mein dependencies check ki.
- [ ] Repeated calls aur event-loop blocking investigate ki.

## Database
- [ ] Prisma query count aur duration inspect ki.
- [ ] N+1 aur oversized result sets check kiye.
- [ ] `EXPLAIN ANALYZE` aur indexes review kiye.
- [ ] Connection pool wait aur locking investigate ki.

## Reliability
- [ ] External API timeouts set kiye.
- [ ] Error handling aur bounded retries verify kiye.
- [ ] Logs se sensitive information remove ki.

## Validation
- [ ] Fix se pehle aur baad same workload test kiya.
- [ ] Latency percentiles aur error rate compare ki.
- [ ] Load test se concurrency behaviour validate kiya.

# 13. Practical debugging workflow for a real endpoint

Existing backend mein bina architecture ko unnecessarily badle debugging aur optimization karna seekho.

Ek slow endpoint ke liye:

1. **Bottleneck identify karo:** evidence kya hai?
2. **Logging/profiling add karo:** kaunsa stage slow hai?
3. **Exact bug ya inefficient code identify karo.**
4. **Minimal safe fix implement karo.**
5. **Fix verify karo:** before/after metrics compare karo.

Yahi process actual backend debugging sikhata hai — sirf optimization tricks yaad karne se nahi, balki root cause identify karke prove karne se.

## References

- [k6 documentation](https://grafana.com/docs/k6/latest/)
- [Autocannon](https://github.com/mcollina/autocannon)
- [Prisma documentation](https://www.prisma.io/docs)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)


# Appendix A — Interactive latency model ke worked example

Hypothetical API timings ko change karke bottleneck identify karne ka model:

- Server overhead: 100 ms.
- Database work: 650 ms.
- External API: 200 ms.

Agar operations sequential hain, estimated total duration:

`100 + 650 + 200 = 950 ms`

Agar database aur external API independent hain aur parallel chal sakte hain:

`100 + max(650, 200) = 750 ms`

Model assume karta hai ki sequential durations add hoti hain, ya independent database/external work fully overlap kar sakti hai. Real timings mein network, scheduling, contention aur dependency overhead bhi hote hain.

# Appendix B — Practical next step for a real backend

Existing backend mein bina architecture ko unnecessarily badle debugging aur optimization karna seekhna zyada valuable hai.

Ek slow endpoint ke liye endpoint ka Express route/controller, related service function aur Prisma query inspect karo. Agar available ho toh Network tab ka timing screenshot ya server logs bhi collect karo.

Analysis ka sequence:

1. Bottleneck kahan hai aur uska evidence kya hai?
2. Kaun si logging ya profiling add karni hai?
3. Exact bug ya inefficient code kya hai?
4. Minimal safe fix kya hoga?
5. Fix ke baad improvement kaise verify karni hai?

Ye process root cause identify karke prove karne par focus karta hai, sirf optimization tricks yaad karne par nahi.
