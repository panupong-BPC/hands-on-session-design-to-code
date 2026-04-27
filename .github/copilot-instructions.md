# Copilot Instructions — One Corporate Portal

## Architecture Overview

This is a **monorepo** for the One Corporate Portal with a multi-agent Figma-to-code pipeline.

| Directory | Purpose |
|-----------|---------|
| `frontend/` | Next.js 15 web app (React 19, TypeScript, Tailwind CSS, shadcn/ui) |
| `backend/` | Go BFF service workspace; the current active service root is `backend/oneks-auth-bff-service/` |
| `.github/agents/` | 7 specialized agents coordinated by `IBM Dev` through a user-selected pipeline: frontend-only (`Figma Reader` → `Frontend` → `Code Reviewer`), backend-only (`Figma Reader` → `API Designer` → `Backend` → `Code Reviewer`), or full-stack (`Figma Reader` → `API Designer` → `Backend` → `Frontend` → `API Client Generator` → `Code Reviewer`) |


## Agent Pipeline

Features are orchestrated by `IBM Dev`. Before delegating, the orchestrator must ask the user to choose or confirm a pipeline for every task. The only supported pipelines are: frontend-only (`Figma Reader` → `Frontend` → `Code Reviewer`), backend-only (`Figma Reader` → `API Designer` → `Backend` → `Code Reviewer`), and full-stack (`Figma Reader` → `API Designer` → `Backend` → `Frontend` → `API Client Generator` → `Code Reviewer`). Downstream agents must be invoked by their exact case-sensitive names, and the selected pipeline must run in that exact order with no implicit default to full-stack. Use `.github/architecture.json` to resolve target roots before delegating, and do not search for paths that are already mapped.

## Frontend (React / Next.js) Conventions

- **Framework**: Next.js 15 with App Router, React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS variables and theme files under `frontend/src/theme/`
- **Import alias**: `@/` maps to `./src/*` (see `tsconfig.json`)
- **Localization**: `LanguageProvider` context + `useLanguage()` hook with `t()` (EN/TH)
- **Translations**: stored in `frontend/src/lib/data.ts`
- **Icons**: Lucide React
- **Forms**: react-hook-form + zod validation
- **Charts**: Recharts
- **Dev server**: `npm run dev` (Turbopack, port 9002)
- **Shared UI state**: `frontend/components.json` exists, but `frontend/src/components/ui/` is not scaffolded in the current tree; verify or generate shared UI components before importing them

### Feature Structure Convention
```
frontend/src/features/{feature-name}/
├── index.ts              # Public exports
├── {feature-name}-page.tsx  # Feature container (entry point)
├── hooks/                # Optional: feature-specific custom hooks
├── types.ts              # Optional: feature-specific types/interfaces
├── components/           # Optional: feature-specific UI components
└── data/                 # Optional: static data, mock data, configuration
```

Current examples:
- `frontend/src/features/login/` contains `index.ts`, `login-page.tsx`, `types.ts`, and `hooks/use-login.ts`
- `frontend/src/features/welcome/` contains `index.ts` and `welcome-page.tsx`
- Do not create empty `components/` or `data/` folders just to satisfy a template

### Key Rules
- Localize new or changed user-facing text with `t("key")` from `useLanguage()` and add keys in `frontend/src/lib/data.ts`
- Prefer Tailwind utilities for layout/spacing and existing theme variables from `frontend/src/theme/` for portal-specific colors or gradients
- `"use client"` directive on components using hooks/state
- Thin page files: just import and render the feature component
- Give interactive elements an accessible name; use `aria-label` when visible text or an associated label is not already sufficient
- Responsive with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- No `any` types — explicit TypeScript everywhere
- Feature-specific components stay inside the feature folder
- Shared components go in `frontend/src/components/`
- Verify `@/components/ui/*` imports exist before using them, or generate them first
- Update `.github/architecture.json` when adding or renaming top-level frontend areas

## Backend (Go) Conventions

- **Language**: Go with standard library (`net/http`, `database/sql`, `encoding/json`, `log/slog`)
- **Current service root**: `backend/oneks-auth-bff-service/`
- **Module**: `oneks-auth-bff-service` (see `backend/oneks-auth-bff-service/go.mod`)
- **New service convention**: create `backend/oneks-{serviceName}-bff-service/` and never place service files directly in `backend/`
- **API routes**: follow the active service router and API contract; templates commonly use `/rest/api/v1/backendForFrontends/{serviceName}/...`
- **Database**: PostgreSQL via `database/sql` + `github.com/lib/pq`
- **Configuration**: Environment variables (see `backend/oneks-auth-bff-service/internal/config/config.go`)
- **Service port**: 8087 (default)

### Project Structure
```
backend/oneks-auth-bff-service/
├── cmd/server/main.go          # Entry point
├── internal/
│   ├── config/                 # Configuration (env vars)
│   ├── constant/               # Feature constants + error codes
│   │   ├── {feature}.go        # Business constants (LogPrefix, etc.)
│   │   └── {feature}_error.go  # Error code structs
│   ├── handler/                # HTTP handlers (controllers)
│   ├── middleware/             # HTTP middleware (logging, CORS)
│   ├── model/                  # Request/Response DTOs + DB entities
│   ├── repository/             # Database access layer (interface + impl)
│   ├── router/                 # Route definitions
│   └── service/                # Business logic
├── pkg/apperror/               # Custom error types
├── deploy/                     # Dockerfile, migrations, and deploy assets
│   ├── Dockerfile
│   └── migrations/
├── go.mod
├── go.sum
└── Makefile
```

### Naming Rules
- Files: `snake_case.go` → `feature_handler.go`, `feature_service.go`
- Types/Structs: `PascalCase` → `FeatureService`, `FeatureEntity`
- Methods: `PascalCase` exported, `camelCase` unexported
- Constants: `PascalCase` exported → `LogPrefix`, `ErrNotFound`
- Interfaces: `PascalCase` → `FeatureRepository`
- DB tables/columns: `UPPER_SNAKE_CASE` in SQL strings

### Constants Pattern (Two Files Per Feature)
```go
// internal/constant/feature.go
const LogPrefix = "[FeatureService]"

// internal/constant/feature_error.go
var ErrNotFound = ErrorCode{Code: "E404", Title: "Not Found", Message: "Resource not found"}
```

### Handler Pattern
```go
func (h *FeatureHandler) GetList(w http.ResponseWriter, r *http.Request) {
    lang := r.URL.Query().Get("lang")
    if lang == "" {
        writeError(w, http.StatusBadRequest, "lang parameter required")
        return
    }
    result, err := h.svc.GetList(r.Context(), lang)
    if err != nil {
        writeError(w, http.StatusInternalServerError, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, model.APIResponse{Status: "success", Data: result})
}
```

### Repository Pattern
```go
type FeatureRepository interface {
    FindAll(ctx context.Context) ([]model.FeatureEntity, error)
    FindByID(ctx context.Context, id int64) (*model.FeatureEntity, error)
    Create(ctx context.Context, entity *model.FeatureEntity) error
}

type featureRepo struct { db *sql.DB }

func NewFeatureRepository(db *sql.DB) FeatureRepository {
    return &featureRepo{db: db}
}
```

### Model/DTO Pattern
```go
type CreateFeatureRequest struct {
    Name   string `json:"name" validate:"required"`
    UserID string `json:"userId" validate:"required"`
}

type FeatureResponse struct {
    ID   int64  `json:"id"`
    Name string `json:"name"`
}

type APIResponse struct {
    Status  string `json:"status"`
    Data    any    `json:"data,omitempty"`
    Message string `json:"message"`
}
```

### Key Rules
- All production APIs must return real database-backed data; never return mocked or hardcoded collections outside `_test.go` files
- Use `context.Context` on all service and repository methods
- `log/slog` structured JSON logging with `logPrefix` at method entry/exit
- Repository interface + implementation pattern for testability
- Request DTOs: `json` tags + validation
- Unit tests may use mock repository structs, but only in `_test.go` files
- `defer rows.Close()` / `defer db.Close()` for resource cleanup
- Errors bubble up — handlers decide HTTP status codes
- Prefer Go stdlib; only add third-party deps when necessary
- Update `.github/architecture.json` when introducing a new backend service root

## Build & Run Commands

```bash
# Frontend
cd frontend && npm install                  # Install deps
cd frontend && npm run dev                  # Dev server (Turbopack, port 9002)
cd frontend && npm run build                # Production build
cd frontend && npm run lint                 # ESLint
cd frontend && npm run typecheck            # TypeScript strict check
cd frontend && npx shadcn@latest add [name] # Add shadcn component; verify components.json CSS path first

# Backend
cd backend/oneks-auth-bff-service && make tidy        # Install/tidy deps
cd backend/oneks-auth-bff-service && make run         # Run server (port 8087)
cd backend/oneks-auth-bff-service && make build       # Build binary
cd backend/oneks-auth-bff-service && make test        # Run tests
cd backend/oneks-auth-bff-service && make test-cover  # Run tests with coverage
cd backend/oneks-auth-bff-service && make lint        # go vet
cd backend/oneks-auth-bff-service && make fmt         # gofmt
curl http://localhost:8087/health           # Health check
```

## Key Patterns to Follow

1. **Creating a new BE feature**: Add handler/service/repository/model files inside the resolved service root, usually `backend/oneks-auth-bff-service/internal/`, then wire `router.go` and `main.go`
2. **Creating a new FE feature**: Create `frontend/src/features/{feature-name}/` with `index.ts`, `{feature-name}-page.tsx`, and only the optional folders/files the feature actually needs
3. **DTOs must match across stack**: OpenAPI field names = Go `json` tags = TypeScript interface fields (all `camelCase`)
4. **Localization**: Add EN/TH entries to `frontend/src/lib/data.ts`, use `t("key")` in components
5. **Reference `.github/architecture.json`** for all file paths — never search manually for mapped locations
6. **Update `.github/architecture.json`** whenever a change adds or renames top-level frontend or backend areas

---

## 1. Design Tokens (Tailwind CSS)

### 1.1 Colors

Color tokens are defined via CSS variables in `frontend/src/theme/globals.scss` and related theme files under `frontend/src/theme/`, then mapped in `frontend/tailwind.config.ts`. Prefer Tailwind token classes. If inline styles are necessary, reference existing CSS custom properties or gradients from `frontend/src/theme/` instead of raw hex/rgb values.

#### Core Color Tokens (via CSS Variables)

| Token Class | CSS Variable | Usage |
|---|---|---|
| `bg-background` | `--background` | Page background |
| `text-foreground` | `--foreground` | Primary text |
| `bg-primary` | `--primary` | Brand primary / CTA |
| `text-primary-foreground` | `--primary-foreground` | Text on primary |
| `bg-secondary` | `--secondary` | Secondary surfaces |
| `bg-muted` | `--muted` | Muted backgrounds |
| `text-muted-foreground` | `--muted-foreground` | Secondary text |
| `bg-card` | `--card` | Card backgrounds |
| `text-card-foreground` | `--card-foreground` | Card text |
| `bg-accent` | `--accent` | Accent surfaces |
| `bg-destructive` | `--destructive` | Error/danger |
| `border` | `--border` | Default borders |
| `ring` | `--ring` | Focus rings |

#### Usage Convention

```tsx
// ✅ Good — Tailwind tokens
<div className="bg-card text-card-foreground border rounded-lg p-4 shadow-sm" />
<span className="text-muted-foreground text-sm" />
<Button variant="destructive">Delete</Button>

// ❌ Bad — raw values
<div style={{ backgroundColor: "#fff", color: "#333" }} />
```

### 1.2 Typography

#### Font Families
Defined in `frontend/tailwind.config.ts`:
- `font-body` → Plus Jakarta Sans / Inter (body text)
- `font-headline` → Space Grotesk (headings)

#### Usage
```tsx
<h1 className="font-headline text-2xl font-bold">Heading</h1>
<p className="font-body text-base">Body text</p>
```

### 1.3 Spacing

Use Tailwind spacing utilities exclusively:

| Pattern | Examples |
|---|---|
| Padding | `p-4`, `px-6`, `py-2` |
| Margin | `m-4`, `mt-2`, `mb-6` |
| Gap | `gap-4`, `gap-x-2`, `gap-y-6` |
| Space between | `space-y-4`, `space-x-2` |

### 1.4 Border Radius

| Tailwind Class | Usage |
|---|---|
| `rounded-lg` | Cards, containers |
| `rounded-xl` | Large cards |
| `rounded-2xl` | Hero cards |
| `rounded-full` | Avatars, pills |

### 1.5 Shadows

Use Tailwind shadow utilities:
- `shadow-sm` — subtle cards
- `shadow` — default elevation
- `shadow-md` — elevated cards
- `shadow-lg` — modals, popovers

---

## 2. Component Library (shadcn/ui)

### 2.1 shadcn/ui Components

The project uses **shadcn/ui** configuration in `frontend/components.json` with Radix dependencies available, but `frontend/src/components/ui/` is not scaffolded in the current tree. Verify a shared UI component exists before importing it, or generate it first.

#### Import Pattern
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

#### Adding New Components
```bash
cd frontend && npx shadcn@latest add [component-name]
```

Before running the generator, verify that `frontend/components.json` points to the live global stylesheet imported by `frontend/src/app/layout.tsx`. The current live stylesheet is `frontend/src/theme/globals.scss`.

### 2.2 Shared Components (`frontend/src/components/`)

Use `frontend/src/components/` for cross-feature reusable UI only. The directory is currently sparse, so keep code inside a feature until it is genuinely shared.

### 2.3 Utility: `cn()`

For conditional class merging:
```tsx
import { cn } from "@/lib/utils";

<div className={cn("flex items-center gap-2", isActive && "bg-primary text-primary-foreground")} />
```

---

## 3. Architecture & Project Structure

### 3.1 Overall Structure

```
frontend/src/
├── app/                     # Next.js App Router (routes, layouts, pages)
│   ├── layout.tsx           # Root layout (fonts, providers, theme import)
│   ├── page.tsx             # Root route redirect
│   ├── login/
│   │   ├── actions.ts       # Auth server actions
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── welcome/
│   │   └── page.tsx
│   └── images/
├── components/              # Shared reusable UI components
├── contexts/                # App-wide React contexts
│   └── language-context.tsx # EN/TH language provider
├── features/                # Feature modules (primary code organization)
│   ├── login/
│   │   ├── hooks/use-login.ts
│   │   ├── index.ts
│   │   ├── login-page.tsx
│   │   └── types.ts
│   └── welcome/
│       ├── index.ts
│       └── welcome-page.tsx
├── hooks/                   # Shared global hooks
│   └── use-mobile.tsx       # Mobile detection hook
├── lib/                     # Shared utilities
│   ├── api-client.ts        # Authenticated client fetch helper
│   ├── data.ts              # Translations + shared data
│   └── utils.ts             # cn() helper
└── theme/
    ├── globals.scss         # Live global stylesheet entry
    └── styles.scss          # Shared SCSS theme primitives
```

### 3.2 Feature Module Structure

Every feature folder under `frontend/src/features/{feature-name}/` follows:

```
{feature-name}/
├── index.ts                 # Required: public exports
├── {feature-name}-page.tsx  # Required: feature container component
├── hooks/                   # Optional: feature-specific hooks
├── types.ts                 # Optional: feature types
├── components/              # Optional: feature-only UI pieces
└── data/                    # Optional: static data, mock data, config
```

**Rules:**
- Feature containers compose child components and connect hooks/data
- Presentational components receive props and render UI
- Feature-specific data stays in the feature `data/` folder when the feature actually needs static or mock content
- Only move code to `src/components/` or `src/lib/` when reused across features
- Use `@/` import alias for all imports

---

## 4. State Management

### 4.1 Local UI State (Default)

```tsx
const [isOpen, setIsOpen] = useState(false);
const [activeTab, setActiveTab] = useState("overview");
```

### 4.2 Complex State — useReducer

```tsx
const [state, dispatch] = useReducer(featureReducer, initialState);
```

### 4.3 Form State — react-hook-form + zod

```tsx
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "", email: "" },
});
```

### 4.4 App-Wide State — React Context

For low-frequency, cross-cutting concerns (language, theme, auth):
```tsx
const { language, t } = useLanguage();
```

### 4.5 Server State

When API integration grows, use React Query or SWR. Until then, feature hooks abstract fetch logic.

---

## 5. Routing (Next.js App Router)

### 5.1 File-System Routes

```
frontend/src/app/
├── page.tsx              # / → redirect to /login
├── layout.tsx            # Root layout
├── login/
│   ├── actions.ts
│   ├── layout.tsx
│   └── page.tsx          # /login
└── welcome/
    └── page.tsx          # /welcome
```

### 5.2 Page File Convention

Page files must be thin — just import and render:
```tsx
import { LoginPage } from "@/features/login";

export default function LoginRoute(): React.JSX.Element {
    return <LoginPage />;
}
```

### 5.3 Navigation

```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";

<Link href="/feature-name">Go to Feature</Link>

const router = useRouter();
router.push("/feature-name");
```

---

## 6. Localization (EN + TH)

### 6.1 Architecture

- **Provider**: `frontend/src/contexts/language-context.tsx`
- **Translations**: `frontend/src/lib/data.ts`
- **Hook**: `useLanguage()` returns `{ language, setLanguage, t }`

### 6.2 Key Naming Convention

```ts
// camelCase: {featureName}{Section}{Item}
"loginTitle": { en: "Sign in", th: "เข้าสู่ระบบ" },
"welcomeGreetingTitle": { en: "Welcome", th: "ยินดีต้อนรับ" },
```

### 6.3 Usage

```tsx
const { t } = useLanguage();
<h1>{t("loginTitle")}</h1>
```

---

## 7. Accessibility

### 7.1 ARIA Labels (Required)

Every interactive element needs an accessible name. Use `aria-label` when visible text or an associated `<label>` is not already sufficient:

```tsx
<Button aria-label="login.form.button.submit">{t("loginTitle")}</Button>
<input aria-label="login.form.input.userId" />
```

Pattern: `{feature}.{section}.{elementType}.{descriptiveName}`

---

## 8. Responsive Design

Use Tailwind responsive prefixes (mobile-first):

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
<h1 className="text-lg md:text-xl lg:text-2xl font-bold" />
```

Breakpoints: `sm` ≥640px, `md` ≥768px, `lg` ≥1024px, `xl` ≥1280px

For programmatic checks: `useIsMobile()` from `@/hooks/use-mobile`

---

## 9. Backend Project Structure (Go)

```
backend/oneks-auth-bff-service/
├── cmd/server/main.go           # Entry point + dependency wiring
├── internal/
│   ├── config/config.go         # Environment-based configuration
│   ├── constant/                # Feature constants + error codes
│   ├── handler/                 # HTTP handlers (route handlers)
│   ├── middleware/              # Logging, CORS middleware
│   ├── model/                   # Request DTOs, Response DTOs, DB entities
│   ├── repository/              # Database access (interface + sql.DB impl)
│   ├── router/router.go         # Route definitions + middleware chain
│   └── service/                 # Business logic
├── pkg/apperror/errors.go       # Typed error constructors (NotFound, BadRequest, etc.)
├── deploy/
│   ├── Dockerfile               # Multi-stage Docker build
│   └── migrations/              # SQL migrations and seed data
├── go.mod                       # Go module definition
├── go.sum
└── Makefile                     # Build, run, test, lint commands
```

---

## 10. Error Handling

### Frontend
Use try/catch in hooks, API helpers such as `frontend/src/lib/api-client.ts`, or route-level server actions, and propagate errors through hook return values or action results:
```tsx
const { data, isLoading, error } = useFeatureData(params);
if (error) return <ErrorDisplay message={error} />;
```

### Backend
Use custom `AppError` types from `pkg/apperror/`:
```go
apperror.NotFound("Resource not found")    // 404
apperror.BadRequest("Invalid input")       // 400
apperror.Unauthorized("Missing token")     // 401
apperror.Internal("Unexpected error")      // 500
```
