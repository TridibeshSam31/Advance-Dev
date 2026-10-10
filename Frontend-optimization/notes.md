# Frontend Optimization: Fundamentals to Advanced

> Full-stack application frontend optimization — browser rendering, network and bundles, React runtime, Core Web Vitals, and architecture.

## Core principle

Frontend optimization ka ek hi golden rule hota hai:

> "Browser ko kam se kam kaam do, jitna do usko jaldi execute karwao, aur user ko kabhi wait mat karao."

Frontend optimization ko sirf `useMemo`, `React.memo` aur lazy loading tak limit mat karo. Ek real full-stack application ko optimize karne ke liye browser, React, network, backend APIs, database aur caching — in sabko ek system ki tarah samajhna padega.

Examples React + Vite/Next.js, Node.js + Express, Prisma aur PostgreSQL stack ko dhyan mein rakhkar diye gaye hain. Ye patterns dashboards, chat apps, editors aur AI tools par apply hote hain.

## 1. Website slow kyun hoti hai?

Website ki slowness alag-alag jagah se aa sakti hai:

1. **Browser / Rendering:** HTML, CSS parse karna, layout aur pixels draw karna.
2. **Network / Download:** JS bundles, fonts, images aur API responses download karna.
3. **Frontend JavaScript:** React renders, expensive calculations aur event handlers.
4. **Backend + Database:** API processing, SQL queries, connection pooling aur external services.

Slow website aur slow API same problem nahi hain. Agar API 100 ms mein response de rahi hai, lekin browser 800 ms JavaScript execute kar raha hai, toh database optimize karne se user ko khaas benefit nahi milega. Isi tarah, agar React rendering fast hai lekin database query 2 seconds le rahi hai, toh `useMemo` laga kar problem solve nahi hogi.

## 2. Optimization ka sahi order

1. **Measure:** Problem kahan hai, evidence se identify karo.
2. **Find the bottleneck:** Network, JavaScript, rendering, API ya database?
3. **Optimize:** Sabse bade bottleneck ko target karo.
4. **Measure again:** Before vs after compare karo.
5. **Prevent regression:** Tests, monitoring aur performance budgets lagao.

Bina measurement ke har jagah optimization karna aksar time waste karta hai aur code ko unnecessarily complicated bana deta hai.

# Pillar 1 — Browser Critical Rendering Path (CRP)

## 3. URL enter karne se pixels dikhne tak

Jab user `app.example.com/dashboard` open karta hai, browser ka process broadly aisa hota hai:

1. **DNS + Connection:** Domain ka IP, connection aur TLS setup.
2. **HTML Download:** Browser document receive karta hai.
3. **DOM + CSSOM:** HTML aur CSS ke trees bante hain.
4. **Render Tree + Layout:** Visible content ki geometry calculate hoti hai.
5. **Paint + Composite:** Pixels aur visual layers screen par aati hain.

DNS, connection setup aur HTML download ke steps browser, connection reuse aur caching par depend karte hain; har navigation par ye saare steps dobara hona zaroori nahi.

### DOM kya hai?

HTML:

```html
<body>
  <main>
    <h1>Dashboard</h1>
    <button>Refresh</button>
  </main>
</body>
```

Browser HTML ko parse karke DOM (Document Object Model) banata hai. DOM page ke elements ko objects aur relationships ke form mein represent karta hai.

Conceptually:

```text
document
  └── body
      └── main
          ├── h1
          └── button
```

JavaScript DOM ko read aur modify kar sakta hai:

```js
document.querySelector("h1").textContent = "Analytics";
```

**Optimization connection:** unnecessary DOM elements, repeated DOM updates aur bahut badi lists browser ka kaam badha sakti hain.

### CSSOM kya hai?

CSS:

```css
h1 {
  font-size: 32px;
  color: navy;
}

button {
  padding: 12px 16px;
}
```

Browser CSS rules ko parse karke CSSOM (CSS Object Model) banata hai. Ye batata hai ki elements par kaun se styles apply honge.

DOM + CSSOM se browser rendering ke liye zaroori structure aur styles determine karta hai. Render tree mein `display: none` wale elements include nahi hote, lekin `visibility: hidden` wale elements layout mein jagah le sakte hain.

### Layout, Paint aur Composite

- **Layout:** element ki width, height aur position calculate karna.
- **Paint:** text, backgrounds, borders aur doosre visual details draw karna.
- **Composite:** alag visual layers ko final frame mein combine karna.

Example:

```css
/* Element ki geometry badal sakti hai */
.box {
  left: 20px;
}

/* Element ko visually move karne ka aksar cheaper tareeka */
.box {
  transform: translateX(20px);
}
```

`left` change karne par layout dobara calculate karna pad sakta hai. `transform` animation aksar layout ko avoid kar sakti hai aur compositing par chal sakti hai.

**Important correction:** `transform` hamesha sirf GPU compositing hi karega, aisa guarantee nahi hai. Browser animation ke context aur properties ke hisaab se layout, paint ya layer allocation ki zaroorat ho sakti hai. `transform` aur `opacity` generally achhe animation choices hain.

## 4. JavaScript loading: normal, async aur defer

### Normal script

HTML parser script par rukta hai; script download aur execute hone ke baad parsing continue hoti hai.

```html
<script src="/legacy-app.js"></script>
```

Flow: HTML parse → script download/execute → HTML parse continue.

### `async`

Download parallel hota hai. Script ready hote hi execute hoti hai, jis waqt HTML parsing interrupt ho sakti hai.

```html
<script src="/analytics.js" async></script>
```

Analytics jaisi independent scripts ke liye useful.

### `defer`

Download parallel hota hai; classic deferred scripts HTML parsing complete hone ke baad aur document order mein execute hoti hain.

```html
<script src="/legacy-app.js" defer></script>
```

Flow: HTML parse + download parallel → HTML complete → scripts execute in order.

Module scripts, jaise `type="module"`, by default defer jaisa behaviour rakhte hain. React/Vite/Next.js projects mein script loading aksar bundler ya framework manage karta hai, isliye blindly har script par `defer` lagana solution nahi hai.

## 5. CSS aur fonts ka performance impact

CSS render-blocking ho sakti hai kyunki browser ko styled content render karne ke liye relevant CSS ki zaroorat hoti hai.

Practical techniques:

- Initial viewport ke liye zaroori CSS ko priority do.
- Unused CSS aur unnecessary UI libraries reduce karo.
- Fonts ke liye sirf required weights aur subsets load karo.
- Above-the-fold hero image ko bina wajah lazy-load mat karo.
- Critical resources ko preload tabhi karo jab unki high priority sach mein useful ho.

Example font preload:

```html
<link
  rel="preload"
  href="/fonts/app-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Har asset ko preload kar dena optimization nahi hai. Isse doosre important resources ke saath network competition badh sakta hai.

# Pillar 2 — Network, Bundles aur Initial Loading

## 6. Bundle size kam karna kyun zaroori hai?

Maan lo ek application ke JavaScript assets 2 MB hain. User sirf login page open karta hai, lekin bundle mein charting library, admin dashboard, editor aur analytics ka code bhi included hai.

Iska cost sirf download tak limited nahi hai:

1. Bytes download karne padte hain.
2. JavaScript parse aur compile hoti hai.
3. Code execute hota hai.
4. Components initialize hote hain.
5. Main thread par doosre kaam ke liye kam time bach sakta hai.

Bundle optimization ka goal sirf download size nahi, initial page ko usable banane ka total cost reduce karna hai.

### 6.1 Code splitting aur lazy loading

React example:

```tsx
import { lazy, Suspense } from "react";

const AnalyticsChart = lazy(
  () => import("./AnalyticsChart")
);

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Chart load ho raha hai...</p>}>
      <AnalyticsChart />
    </Suspense>
  );
}
```

`lazy()` component ka code tab load karne deta hai jab React ko us component ko render karna hota hai. Bundler ko isse separate chunk banane ka mauka milta hai.

Agar `AnalyticsChart` dashboard ke initial render mein hi immediately render hota hai, toh download initial navigation ke aas-paas hi start ho sakta hai. Ye tab zyada useful hai jab component kisi later route, tab ya user action par chahiye.

Route-level splitting:

```text
/login        → Login code
/dashboard    → Dashboard code
/editor       → Editor code
/settings     → Settings code
```

Har route ka code har visitor ko pehle hi download karwana zaroori nahi.

### 6.2 Tree shaking

Tree shaking build-time par unused exports remove karne ki technique hai.

```tsx
// Unnecessary imports ka risk
import * as utilities from "./utilities";

// Better: explicit usage
import { formatDate } from "./utilities";
```

Ye ES Modules ke saath generally achha kaam karti hai, lekin sirf named imports use karne se tree shaking guarantee nahi hoti. Package ke exports, bundler configuration aur side effects bhi matter karte hain.

`lodash/debounce` jaise targeted import ka fayda ho sakta hai, lekin exact bundle impact build analyzer se verify karna chahiye.

### 6.3 Images: format, size aur loading priority

- **Modern image formats:** WebP aur AVIF kai images ko JPEG/PNG se smaller bana sakte hain. Actual savings image content, quality aur encoder par depend karti hain.
- **Responsive dimensions:** Mobile par 2000-pixel wide image bhejne ki jagah suitable image size serve karo, using `srcset` and `sizes`.
- **Lazy loading:** Below-the-fold images ko defer kar sakte ho. Hero/LCP image ko lazy-load karna ulta LCP kharab kar sakta hai.

Example:

```html
<img
  src="/product-640.webp"
  srcset="
    /product-320.webp 320w,
    /product-640.webp 640w,
    /product-1280.webp 1280w
  "
  sizes="(max-width: 600px) 100vw, 640px"
  width="640"
  height="480"
  alt="Product preview"
  loading="lazy"
/>
```

`width` aur `height` browser ko image ka aspect ratio pehle se batate hain, jisse unexpected layout shifts reduce ho sakte hain. `loading="lazy"` sirf un images par use karo jo initial viewport ke liye critical nahi hain.

### 6.4 Caching aur compression

Hashed static asset ke liye:

```http
Cache-Control: public, max-age=31536000, immutable
```

Example filenames:

```text
assets/index-Bqd9zE5C.js
assets/style-A8d21F.css
```

Jab content badalta hai, filename hash badal jaata hai. Isse purane cached assets aur naye deployments ke beech conflict kam hota hai.

HTML ke liye generally revalidation ya shorter caching policy chahiye, taaki browser latest asset references discover kar sake.

**Compression:** Brotli aur gzip HTML, CSS aur JavaScript jaise text resources ke transfer size ko reduce karte hain. Lekin compression ka fayda network transfer par hota hai; client-side JavaScript execution cost apne aap disappear nahi hoti.

# Pillar 3 — React Runtime Optimization

## 7. React re-render actually hota kya hai?

Maan lo ek dashboard mein ye components hain:

```text
Dashboard
├── Navbar
├── Sidebar
├── CreditBalance
├── PromptEditor
└── GenerationHistory
```

User prompt editor mein type karta hai. Agar input state `Dashboard` mein rakhi hai, toh har keystroke par `Dashboard` re-render ho sakta hai. Uske child components bhi normally re-render ke liye eligible hote hain.

Har re-render ka matlab poora browser page repaint hona nahi hai. React component function dobara chala sakta hai, phir reconciliation ke through decide karta hai ki actual DOM mein kya change karna zaroori hai.

### Sabse effective optimization: state ko sahi jagah rakhna

Bad approach:

```tsx
function Dashboard() {
  const [prompt, setPrompt] = useState("");

  return (
    <>
      <Navbar />
      <Sidebar />
      <CreditBalance />
      <PromptEditor
        value={prompt}
        onChange={setPrompt}
      />
    </>
  );
}
```

Is design mein prompt har baar change hone par parent render hota hai.

Better approach:

```tsx
function Dashboard() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <CreditBalance />
      <PromptEditor />
    </>
  );
}

function PromptEditor() {
  const [prompt, setPrompt] = useState("");

  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
    />
  );
}
```

Ab typing ki state `PromptEditor` ke andar local hai. Unrelated dashboard components ko typing ke har update par re-render karne ki zaroorat nahi padti.

**Senior engineer ka rule:** pehle state placement improve karo; uske baad hi memoization consider karo.

## 8. `useMemo`, `useCallback` aur `React.memo`

### `useMemo`

Calculation ka result cache karta hai.

```tsx
const filteredUsers = useMemo(() => {
  return users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );
}, [users, query]);
```

Useful jab calculation genuinely expensive ho ya stable result reference useful ho.

### `useCallback`

Function reference ko renders ke beech stable rakhta hai.

```tsx
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);
```

Useful jab stable callback kisi memoized child ya dependency array ke liye matter karta hai.

### `React.memo`

Same props ke saath parent-driven re-render ko skip karne ka mauka deta hai.

```tsx
const UserRow = React.memo(function UserRow({
  name,
}: {
  name: string;
}) {
  return <div>{name}</div>;
});
```

Useful jab component render costly ho aur props frequently unchanged hon.

In teenon ko har jagah lagana optimization nahi hai. Memoization ka apna overhead hota hai, aur local state ya consumed context change hone par memoized component phir bhi render kar sakta hai.

### 8.1 Infinite API loop: ek real production bug

Problematic code:

```tsx
const refreshCredits = useCallback(async () => {
  const response = await fetchCredits(token);
  setUser(response.user);
}, [token, user]);

useEffect(() => {
  refreshCredits();
}, [refreshCredits]);
```

Problem:

1. `refreshCredits` ke andar `user` dependency hai.
2. API response aata hai aur `setUser()` state update karta hai.
3. Component re-render hota hai.
4. `user` change hua, isliye `refreshCredits` ka reference badal jaata hai.
5. Effect dobara execute hota hai aur API call phir hoti hai.

Agar har response state ko change karta rahe, toh repeated requests ka loop ban sakta hai.

Safer pattern:

```tsx
const refreshCredits = useCallback(async () => {
  const response = await fetchCredits(token);

  setUser((previousUser) => ({
    ...previousUser,
    ...response.user,
  }));
}, [token]);

useEffect(() => {
  if (!token) return;

  void refreshCredits();
}, [token, refreshCredits]);
```

Functional state update se callback ko purane `user` variable ki zaroorat nahi padti. Lekin ye fix tabhi correct hai jab `response.user` ko existing state ke saath merge karna intended ho aur `token` hi relevant changing dependency ho.

Production mein saath mein ye bhi karo:

- Network tab mein duplicate requests inspect karo.
- Component mount/unmount aur effect executions trace karo.
- Request cancellation ya stale-response protection consider karo.
- API retries aur rate limits define karo.
- React Strict Mode ke development behaviour ko actual production infinite loop se confuse mat karo.

**Golden rule:** `useEffect` ko sirf isliye mat use karo ki koi state badli aur tujhe doosri state calculate karni hai. Derived state aksar render ke waqt calculate ki ja sakti hai.

## 9. Lists: 10,000 rows render karna

```tsx
{messages.map((message) => (
  <MessageRow key={message.id} message={message} />
))}
```

Ismein 10,000 React elements aur potentially bahut saare DOM nodes honge. Initial rendering, memory aur scrolling costly ho sakte hain.

### Virtualization / windowing

Virtualization mein browser ko har item ek saath render nahi karna padta. Libraries jaise `react-window` aur `@tanstack/react-virtual` visible rows aur spacers ke through scroll area maintain karne mein help karti hain.

**Virtualization data fetching ka replacement nahi hai.** Agar 10,000 messages server se download kar raha hai, toh network cost abhi bhi hai. Iske liye pagination ya cursor-based fetching alag se useful hai.

## 10. Debouncing vs throttling

### Debounce — user rukega, tab action

Search box mein user ke typing stop karne ke 300 ms baad request bhejo.

```text
c → ca → cat → pause → one search request
```

### Throttle — interval mein maximum controlled execution

Scroll ya pointer movement ke expensive processing ko limit karo. Example: 100 ms ke interval mein at most one execution.

Search debounce example:

```tsx
useEffect(() => {
  const timeoutId = setTimeout(() => {
    void searchUsers(query);
  }, 300);

  return () => clearTimeout(timeoutId);
}, [query]);
```

Ye simple pattern har query change par previous timer cancel karta hai. Production implementation mein empty query handling, request cancellation aur stale responses ko bhi handle karna chahiye.

Debounce ka matlab API response cache karna nahi hai. Agar user wahi query dobara karta hai, toh caching ya data-fetching library ki zaroorat alag se ho sakti hai.

## 11. Frontend memory aur rendering ke advanced issues

| Problem | Kya hota hai | Practical solution |
|---|---|---|
| Memory leak | Unused references memory hold karte rehte hain | Event listeners, subscriptions aur timers cleanup karo |
| Stale response | Purani request baad mein aakar naya result overwrite kar deti hai | `AbortController`, request identity ya query-library protections |
| Too many renders | State updates baar-baar large tree ko affect karte hain | State colocation, profiling, targeted memoization |
| Heavy main-thread task | UI interactions block hoti hain | Task split karo, Web Worker ya suitable async processing |
| Too many DOM nodes | Layout, style calculation aur memory cost badhti hai | Virtualization, pagination, simpler DOM |

Web Worker CPU-heavy JavaScript ko background thread par chala sakta hai, lekin DOM ko directly manipulate nahi kar sakta. Use tab karo jab actual main-thread CPU bottleneck ho.

# Pillar 4 — Core Web Vitals aur Performance Measurement

## 12. Core Web Vitals

Google ke Core Web Vitals real-world user experience measure karte hain.

| Metric | Full name | Kya measure karta hai? | Good target |
|---|---|---|---|
| LCP | Largest Contentful Paint | Main content kitni jaldi visible hota hai | ≤ 2.5 seconds |
| INP | Interaction to Next Paint | User interaction ke response mein UI kitni responsive hai | ≤ 200 ms |
| CLS | Cumulative Layout Shift | Unexpected layout movement kitni hoti hai | ≤ 0.1 |

Ye Google ke “good” thresholds hain, generally real users ke 75th percentile par evaluate kiye jaate hain.

INP ka matlab sirf API response time nahi hai. API jaldi respond kar sakti hai, phir bhi heavy JavaScript ke kaaran UI next paint delay ho sakta hai.

## 13. Kaunsa tool kis problem ke liye?

- **Chrome DevTools — Network:** Slow API, duplicate requests, large JS files, cache headers aur image download time.
- **Chrome DevTools — Performance:** Main-thread long tasks, scripting, rendering, layout aur paint bottlenecks.
- **Lighthouse / PageSpeed Insights:** Performance audits, loading diagnostics aur Core Web Vitals opportunities.
- **React DevTools Profiler:** Kaun se components render hue, rendering mein kitna time laga aur optimization se kya benefit mila.
- **Prisma logs + PostgreSQL `EXPLAIN ANALYZE`:** Slow queries, excessive database calls aur query execution plans.

Disciplined debugging workflow:

1. DevTools mein problematic action reproduce karo.
2. Network timing se API aur asset delays identify karo.
3. Performance trace se main-thread bottlenecks inspect karo.
4. Agar backend slow hai, request trace aur database query timing compare karo.
5. Ek targeted change karo.
6. Same conditions mein dobara measure karo.

# Pillar 5 — Full-Stack API, Backend aur Database Optimization

## 14. Ek user action ki complete journey

Dashboard ke credits fetch hone ka flow:

1. React component: `useEffect` ya query hook data request start karta hai.
2. HTTP request: Network se Express server tak.
3. Middleware: Authentication, validation, authorization.
4. Controller / Service: Business logic execute hoti hai.
5. Prisma + PostgreSQL: SQL query, indexes aur database execution.
6. JSON response: Result browser ko return hota hai.
7. React UI update: State/cache update aur required rendering.

Agar response 1.5 seconds leta hai, toh sirf frontend rendering dekhna kaafi nahi. Backend mein har segment ka latency budget samajhna hoga.

## 15. API optimization: har render par request mat bhejo

Bad approach:

```tsx
function CreditBalance() {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetch("/api/credits")
      .then((response) => response.json())
      .then((data) => setCredits(data.credits));
  });

  return <p>{credits} credits</p>;
}
```

Is effect mein dependency array nahi hai. Har render ke baad request chalegi. Response se state update hoti hai, phir render aur request dobara.

Basic fix:

```tsx
useEffect(() => {
  let active = true;

  async function loadCredits() {
    const response = await fetch("/api/credits");
    if (!response.ok) throw new Error("Failed to load credits");

    const data = await response.json();

    if (active) {
      setCredits(data.credits);
    }
  }

  void loadCredits();

  return () => {
    active = false;
  };
}, []);
```

Ye repeat-on-every-render problem ko fix karta hai aur unmounted component par state update se bachata hai. Ye request ko physically cancel nahi karta; cancellation ke liye `AbortController` use kar sakte hain. Real application mein loading/error states aur authentication handling bhi honi chahiye.

### 15.1 Data fetching library kab use karein?

React Query / TanStack Query jaise tools server state ke liye useful hain.

```tsx
const { data, isPending, error } = useQuery({
  queryKey: ["credits"],
  queryFn: async () => {
    const response = await fetch("/api/credits");

    if (!response.ok) {
      throw new Error("Failed to load credits");
    }

    return response.json();
  },
});
```

Configuration ke according caching, refetching, retries aur request deduplication manage ki ja sakti hai.

Benefits:

- Same data ko multiple components consume kar sakte hain.
- Har component apna duplicate fetching mechanism nahi banata.
- Loading aur error states consistent hoti hain.
- Cache invalidation ko deliberately control kiya ja sakta hai.

Credits jaise frequently changing data ko indefinitely stale cache se show nahi karna chahiye. Stale time, refetch behaviour aur mutation ke baad invalidation decide karni padegi.

## 16. Pagination aur N+1 problem

Maan lo API 10,000 users return kar rahi hai:

```http
GET /api/users
```

```sql
SELECT * FROM users;
```

Ye unnecessarily large payload, memory usage aur rendering work create kar sakta hai.

Better design:

```http
GET /api/users?limit=20&cursor=abc123
```

Cursor-based pagination large ya changing datasets ke liye useful hai. Cursor ko deterministic, indexed sort order ke saath implement karna chahiye.

### N+1 problem

100 posts fetch kiye aur har post ke author ko alag query se fetch kiya:

```text
1 query: posts fetch
100 queries: each post's author
-------------------------------
101 database queries
```

Prisma example:

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

Prisma relation ko efficiently retrieve karne ka plan use kar sakta hai. Actual SQL query strategy relation configuration aur Prisma version par depend karti hai; generated SQL inspect karna useful hai.

## 17. Database optimization: PostgreSQL + Prisma

Teen techniques par focus karo:

1. **Indexes:** Frequently filtered ya joined columns par appropriate indexes query ko faster bana sakte hain. Lekin indexes writes aur storage ki cost badhate hain.
2. **Query analysis:** `EXPLAIN ANALYZE` se actual query plan aur execution timing inspect karo.
3. **Connection pooling:** Har API request par naya database connection create karna costly ho sakta hai. Suitable pool configuration connection overhead aur concurrency ko manage karne mein help karti hai.

Example:

```sql
EXPLAIN ANALYZE
SELECT id, email
FROM users
WHERE email = 'student@example.com';
```

Agar email unique lookup hai aur appropriate index available hai, PostgreSQL index use kar sakta hai. Lekin query plan actual table size, statistics aur query conditions par depend karega.

Fast database query ka matlab automatically fast endpoint nahi hai. Endpoint mein middleware, multiple queries, external APIs, serialization aur network latency bhi ho sakti hai.

Isliye backend mein end-to-end request timing aur per-operation tracing dono valuable hain.

## 18. SSR, CSR aur streaming

- **CSR — Client-Side Rendering:** Browser JavaScript download karke UI render karta hai. Interactive dashboards aur highly client-driven apps mein useful.
- **SSR — Server-Side Rendering:** Server request ke waqt HTML generate karta hai. Initial content browser ko JavaScript hydration complete hone se pehle mil sakta hai.
- **Streaming SSR:** Server ready content ko parts mein bhej sakta hai, jabki slower sections baad mein complete hote hain.

Next.js mein ye decisions route aur component level par important hote hain.

SSR automatically faster nahi hota. Server rendering ka time, hydration cost, data fetching waterfalls aur caching strategy matter karte hain. Agar page mostly private, highly interactive dashboard hai, toh CSR kaafi suitable ho sakta hai. Agar public landing page ka initial content important hai, toh SSR ya static rendering useful ho sakti hai.

## 19. CDN, caching layers aur data freshness

```text
Browser cache
    ↓
CDN / Edge cache
    ↓
Application / React Query cache
    ↓
Express API
    ↓
Redis cache (optional)
    ↓
PostgreSQL
```

Har layer ka purpose alag hai:

- Browser cache: static assets ko dobara download karne se bachana.
- CDN: cacheable resources ko user ke geographically closer serve karna.
- React Query: client par server data ko reuse karna.
- Redis: suitable backend results ya frequently accessed data ko cache karna.
- PostgreSQL: authoritative persistent data store karna.

Sabse important risk stale data aur incorrect cache invalidation hai. User ne credits spend kiye aur UI purane cached credits dikhati rahi, toh application technically fast hai par incorrect behaviour kar rahi hai.

Private user-specific API responses ko publicly shared CDN cache mein serve karne se pehle authentication aur cache isolation carefully design karni chahiye.

## 20. Full-stack performance symptom map

| Symptom | Likely bottleneck | First action |
|---|---|---|
| Initial screen late dikhti hai | Large JS bundle ya slow server response | Network waterfall aur LCP inspect karo |
| Search typing lag karti hai | Expensive rendering ya synchronous computation | React Profiler aur Performance trace |
| Credits API baar-baar chalti hai | Effect dependency ya duplicate fetching | Network request initiator inspect karo |
| User list load hone mein der | Large payload, N+1 ya slow query | Pagination, query count aur SQL plan |
| Images aane par layout jump karta hai | Missing dimensions ya late-loaded content | Dimensions, aspect ratio aur reserved space |
| Navigation ke baad page slow hai | Route bundle, uncached data ya waterfall | Route splitting aur fetch sequence |

Ye debugging ki starting point hai, final diagnosis nahi. Ek symptom ke multiple causes ho sakte hain.

# Practical implementation roadmap

1. **Baseline:** Lighthouse report, Network waterfall, initial bundle size aur slowest API record karo.
2. **Loading:** Route-level code splitting, images, font loading, compression aur cache headers optimize karo.
3. **React:** Unnecessary effects, repeated renders, unstable props, long lists aur expensive calculations inspect karo.
4. **Backend:** API latency, payload size, N+1 queries, database indexes aur connection pooling inspect karo.
5. **Prove the improvement:** Before/after metrics, repeatable tests aur production monitoring ke saath changes validate karo.

Theory ko ek hi din mein saare hooks yaad karne ka topic mat banao. Ek existing application choose karo, uski performance measure karo aur phir ek-ek bottleneck fix karo.

## References

- [Web.dev — Optimize Core Web Vitals](https://web.dev/articles/optimize-vitals)
- [React documentation](https://react.dev/reference/react)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance)
- [Prisma documentation](https://www.prisma.io/docs)


# Appendix A — Senior Frontend Engineer Summary Checklist

Har naya feature ya project banate waqt ye 5 sawaal poocho:

1. **Bundle:** Kya heavy library poori app mein chahiye ya lazy-load ho sakti hai?
2. **Network:** Kya images WebP format mein hain aur unke dimensions defined hain?
3. **State:** Kya mera `useEffect` kisi unnecessary dependency par baar-baar chal raha hai?
4. **DOM:** Kya main 1,000 se zyada DOM nodes render kar raha hoon bina virtualization ke?
5. **Animation:** Kya main CSS `transform` aur `opacity` use kar raha hoon ya slow `margin`/`left`?

# Appendix B — Frontend Performance Quiz

### Question 1

User search mein har keystroke par 500 users filter karne ke baad API call hoti hai. Pehla suitable improvement kya hai?

- Har jagah `React.memo` lagana.
- Search requests debounce karna aur local filtering cost profile karna.
- PostgreSQL par har field ka index banana.

**Answer:** Search requests debounce karna aur local filtering cost profile karna. Debounce rapid input changes ko ek request mein reduce kar sakta hai. Agar local filtering bhi expensive hai, usko independently profile karo.

### Question 2

React component ke har render par same expensive calculation ho rahi hai. Calculation ka result dependencies ke saath reuse karna hai.

- `useCallback`
- `useEffect`
- `useMemo`

**Answer:** `useMemo`. Ye calculation ke result ko dependencies unchanged rehne tak reuse kar sakta hai.

### Question 3

API response 80 ms hai, lekin button click ke baad UI 600 ms tak freeze hoti hai.

- Sirf database index add karna.
- Main-thread Performance trace aur expensive frontend work inspect karna.
- Saare API responses par 1-year caching lagana.

**Answer:** Main-thread Performance trace aur expensive frontend work inspect karna. Fast API response ke bawajood heavy synchronous JavaScript ya rendering interaction ko block kar sakti hai.

### Question 4

Dashboard mein 20,000 records hain. User ko ek waqt mein 20 records hi dikhane hain.

- Sirf `useMemo` lagana.
- Har render par poore 20,000 DOM nodes banana.
- Pagination aur/or virtualization consider karna.

**Answer:** Pagination aur/or virtualization consider karna. Pagination transferred data ko reduce kar sakti hai; virtualization rendered DOM ko. Dono alag problems solve karte hain.
