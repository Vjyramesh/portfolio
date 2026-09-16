# Portfolio Frontend — Project Spec

API-driven portfolio site for a senior frontend developer. React (TypeScript) + Vite, consuming the sibling GraphQL backend (`../backend`). Built test-first (TDD).

This file is the single source of truth for stack and architecture decisions. Update it whenever a project-level decision is made or changed — do not let decisions live only in chat history or PR descriptions.

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Runtime/Framework | React 19 + TypeScript | Already scaffolded |
| Build tool | Vite | Already scaffolded, `@vitejs/plugin-react`, React Compiler (babel) enabled |
| Styling | Tailwind CSS v4 | ✅ Installed via `@tailwindcss/vite` plugin — no separate PostCSS/`tailwind.config.js` needed for v4's default setup |
| Data layer | Apollo Client v4 (GraphQL) | ✅ Installed. All content is fetched from the backend's GraphQL API — no local/static content files, no MDX |
| API endpoint | `http://localhost:4000/graphql` (dev) | Configured via `VITE_GRAPHQL_URI` env var (see `.env.development`/`.env.example`), not hardcoded. Backend CORS defaults to `http://localhost:3000`, but Vite's default dev port is `5173` — `CORS_ORIGINS` on the backend will need to include the actual frontend dev origin before live queries will succeed |
| Testing | Vitest + React Testing Library + MSW | ✅ Installed and verified. TDD workflow (see below); Vitest chosen over Jest to reuse Vite's config/transform pipeline directly |
| Component workbench | Storybook v10 (`@storybook/react-vite`) | ✅ Installed and verified. Used to develop/document `src/blocks/` primitives and `src/components/` in isolation. Scoped to those two folders only (see "Folder structure"). Addons: `addon-a11y`, `addon-docs`. Run with `npm run storybook`; build with `npm run build-storybook` |
| Linting | oxlint | Already scaffolded |
| Routing | `react-router` v8 (data router) | ✅ Installed. `createBrowserRouter`/`RouterProvider` wired in `src/router.tsx`/`src/main.tsx`, currently a single root route rendering `<App />`; real page routes still to be added |
| Forms & validation | `react-hook-form` + `zod` + `@hookform/resolvers` | ✅ Installed. Used for form submission (e.g. Contact Us) with `zodResolver` bridging zod schemas into `react-hook-form`; no real form built yet — backend has no Contact mutation |
| Internationalization | `i18next` + `react-i18next` + `i18next-browser-languagedetector` | ✅ Installed and configured. Config in `src/i18n/`, initialized in `src/main.tsx`. Covers the app's own UI strings only (nav, labels, actions, states) — backend content is not localized (see note below). Type-safe `t()` keys via `src/i18n/i18n.d.ts` |
| Theming | CSS-variable driven (`data-theme` + `prefers-color-scheme`) | ✅ Configured. Three modes — **light / dark / system** — defined entirely in CSS variables (`src/index.css`). `<html data-theme>` carries the user's choice; the OS media query resolves `system`. No React provider — JS is limited to a one-line attribute setter. See "Theming" below |

## Architecture principles

- **API-driven**: no section renders hardcoded/static content. Every category (Basic Info, Experience, Works, Skills, Blogs, Case Study, White Paper, Certifications, Education, Contact) is backed by a GraphQL query against the backend. UI components take data via props/hooks sourced from Apollo queries, not inline constants.
- **TDD (red-green-refactor)**: for every component, hook, or data-access module, a failing test is written first (Vitest + React Testing Library for component behavior; MSW to intercept and mock `/graphql` calls), then the minimum implementation to pass it, then refactor. No implementation code is written without a preceding failing test.
- **Contract-first for unbuilt backend features**: for categories where the backend has no GraphQL module yet, the frontend defines the query/type shape it needs and mocks it via MSW so component work isn't blocked on backend sequencing. Real integration replaces the mock once the backend module exists — no other frontend changes should be required if the contract was defined accurately.
- **Component-based development — shared blocks over duplication**: if two or more components need the same kind of UI primitive (input field, checkbox, button, select, etc.), that primitive belongs in `src/blocks/`, not copy-pasted or reimplemented per feature. See "Folder structure" below.
- **Accessibility is a build requirement, not a polish pass**: every block and component must meet WCAG 2.2 **Level AA as a hard minimum** and **target Level AAA**. See "Accessibility" below — this is a merge gate, not a nice-to-have.

## Folder structure

| Folder | Contains | Rules |
|---|---|---|
| `src/blocks/` | Shared, reusable UI primitives used by more than one feature/section component — e.g. `Input`, `Checkbox`, `Select`, `TextArea`, `Button`, `Radio` | Presentation-only: props in, markup out. No Apollo hooks, no `react-router` hooks, no feature-specific logic. Each block lives in its own folder with a colocated test AND a Storybook story (`Button/Button.tsx` + `Button/Button.test.tsx` + `Button/Button.stories.tsx`) under TDD. Exported from `src/blocks/index.ts` so consumers import from `../blocks` rather than deep-importing individual files. **Seeded:** `Button` block exists as the reference implementation of this pattern |
| `src/components/` | Feature/section-specific components — e.g. the Experience timeline, Works grid, Contact form | Compose blocks from `src/blocks/`; own their data fetching (Apollo hooks) and business logic. If a component needs an input/checkbox/etc., it must reuse the matching block instead of writing its own. May have colocated `.stories.tsx` for isolated development where useful |
| `src/lib/` | Cross-cutting non-UI code — e.g. `apolloClient.ts` | No React components |
| `src/test/` | Test harness — `setup.ts`, `mocks/`, `smoke/` | Shared MSW server/handlers also live here so both block and component tests can reuse them |

Storybook stories (`*.stories.tsx`) are colocated with their block/component and are the **only** things Storybook indexes — its `stories` glob in `.storybook/main.ts` is scoped to `src/blocks/**` and `src/components/**`, so stray stories elsewhere won't appear. `.storybook/preview.tsx` imports `src/index.css`, so blocks render with the real Tailwind styles.

**Rule of two**: the first component that needs an input/checkbox/etc. can write it inline; the moment a *second* component needs the same kind of primitive, extract it into `src/blocks/` and refactor the first consumer to use it too — don't leave two copies.

## Accessibility

Standard: **WCAG 2.2**. **Level AA is a MUST** (non-negotiable minimum — a block/component that fails AA is not done and does not merge). **Level AAA is the TARGET** — meet it wherever achievable; where a specific AAA criterion is impractical, AA still holds and the gap is documented on the component.

Applies to every block in `src/blocks/` and every component in `src/components/`, no exceptions.

Concrete requirements each block/component must satisfy:

- **Semantics & roles**: use native HTML elements first (`<button>`, `<label>`, `<nav>`, `<input>`); reach for ARIA only to fill genuine gaps, never to paper over a wrong element. Every interactive element has an accessible name.
- **Keyboard**: fully operable by keyboard alone — logical tab order, visible focus indicator, no keyboard traps, Enter/Space/Escape behave as expected.
- **Forms**: every control has an associated `<label>`; errors are programmatically linked (`aria-describedby`) and announced, not conveyed by color alone.
- **Color & contrast**: AA requires ≥ 4.5:1 for normal text and ≥ 3:1 for large text / UI components; **AAA target is ≥ 7:1 normal and ≥ 4.5:1 large**. Never encode meaning in color alone.
- **Images & media**: meaningful images have `alt`; decorative images use empty `alt=""`.
- **Motion & preferences**: respect `prefers-reduced-motion`; content reflows without loss down to 320px width and up to 200% zoom.

Tooling & verification:

- **Storybook `addon-a11y`** (already installed) runs axe against every story — each block/component must be clean of violations in its story before it's considered done. `.storybook/preview.tsx` currently sets `a11y.test: 'todo'`; flip to `'error'` once the block library is established so CI fails on violations.
- **Automated checks catch ~part of it, not all** — keyboard operation, focus order, and screen-reader semantics still require manual verification per component. axe passing is necessary, not sufficient.
- Accessibility assertions belong in the colocated component tests where practical (e.g. asserting accessible names/roles via React Testing Library queries, which already push toward accessible markup).

## Internationalization (i18n)

Stack: `i18next` + `react-i18next`, with `i18next-browser-languagedetector`. Config lives in `src/i18n/` and is initialized once via `import './i18n'` in `src/main.tsx`.

- **Scope — UI strings only**: i18n covers the app's *own* chrome — nav labels, button/action text, form labels, validation and loading/error/empty states, section headings. **Dynamic content from the GraphQL backend (works, blogs, skills, etc.) is NOT localized here** — the backend serves a single language, so translating that content is a backend/data concern, out of scope for the frontend i18n layer until the API supports it.
- **No hardcoded user-facing strings**: blocks and components must render text via the `t()` hook (`useTranslation`) against a namespace, never inline string literals. This is the i18n counterpart to the accessibility gate.
- **Structure — one folder per language, one file per component/namespace**: resources live under `src/i18n/locales/<lng>/<namespace>.json`, where each language is its own folder and each component (or shared concern) is its own file within it. A component that has its own strings gets a namespace file named after it (e.g. the `ContactForm` component → `locales/<lng>/contactForm.json`); the component then calls `useTranslation('contactForm')`. The `common` namespace (default) holds only genuinely cross-cutting tokens — actions and states — not component-specific copy. Every language folder must contain the *same set* of namespace files so keys stay parallel across locales.
  - Example current tree:
    ```
    src/i18n/locales/
      en/
        common.json   # actions, states (shared, default NS)
        nav.json      # site navigation labels (nav component)
    ```
  - **Adding a component's strings**: create `locales/<lng>/<component>.json` for every language, then register the namespace in `resources` + `ns` in `src/i18n/index.ts`.
  - **Adding a language**: drop in a parallel `locales/<lng>/` folder mirroring the existing namespace files, and add the code to `resources`/`supportedLngs` in `src/i18n/index.ts`.
- **Type safety**: `src/i18n/i18n.d.ts` augments `i18next`'s `CustomTypeOptions` from the `en` resources, so `t('...')` keys are checked at compile time. Requires `resolveJsonModule` (enabled in `tsconfig.app.json`).
- **Language detection**: order is querystring (`?lng=`) → `localStorage` → browser `navigator`, with the choice cached in `localStorage`. Falls back to `en`.

## Theming (light / dark / system)

Three theme modes: **light**, **dark**, and **system** (follow the OS `prefers-color-scheme`). `system` is the default when the user has made no explicit choice.

**CSS-variable driven — no React state/provider.** All theme values live in CSS variables in `src/index.css`; the theme is switched by a single `data-theme` attribute on `<html>`, and the OS media query resolves `system`. There is deliberately no `ThemeProvider`/context.

- **How the CSS resolves a mode** (`src/index.css`): design-token variables default to light on `:root`. Dark values apply when **either** `:root[data-theme="dark"]` (explicit, any OS) **or**, inside `@media (prefers-color-scheme: dark)`, `:root[data-theme="system"]` / `:root:not([data-theme])` (system or no-JS following a dark OS). Explicit `[data-theme="light"]` is excluded from the media rule, so it stays light even on a dark OS. `color-scheme` is set the same way. (The dark values are intentionally written twice — CSS can't share a declaration block across a media-query boundary.)
- **Tailwind `dark:` variant** mirrors that exact condition via a block `@custom-variant dark { … }` in `src/index.css` (explicit dark + system-dark), so `dark:` utilities and the token variables stay in agreement.
- **The only JS** is `src/theme/theme.ts` — vanilla helpers (`getStoredTheme`, `setTheme`, `applyTheme`) that read the user's choice from `localStorage` (key `theme`, default `system`) and write it to `data-theme`. It does **not** decide light vs dark — CSS does. No `matchMedia` in app code.
- **No-flash (FOUC)**: an inline script in `index.html` sets `data-theme` from `localStorage` before first paint. It only sets the attribute (mirrors `applyTheme`); the CSS media query does resolution, so this stays trivial.
- **Persistence**: `localStorage` under the `theme` key.
- **Pending**: a `ThemeToggle` UI control (a `src/blocks/` block, must be accessible + i18n'd) that calls `setTheme()` — not built yet. `system` auto-switching and the setter work today, but there's no in-app switcher.

## Category status

Mirrors the backend spec's status table so both repos reflect the same ground truth.

| Category | Backend API | Frontend | Notes |
|---|---|---|---|
| Skills | ✅ `skills` query, `addSkill`/`updateSkill`/`deleteSkill` mutations | ⚠️ Partial | Backend: name, category, level, proficiency, yearsOfExperience. `AddSkillForm` component built (create only, via `addSkill`), using the shared `Input` block; list/read view against the `skills` query not yet built |
| Works | ✅ `works` query | ❌ Not started | Backend: title, description, shortDescription, image, link, github, technologies, startDate, endDate |
| Basic Info | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| Experience | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| Blogs | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| Case Study | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| White Paper | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| Certifications | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| Education | ❌ Not started | ❌ Not started | No backend module; contract TBD |
| Contact Us | ❌ Not started | ❌ Not started | Likely a mutation, not a query — form submission; no backend module yet |

## Cross-cutting components status

| Component | Status | Notes |
|---|---|---|
| Tailwind setup | ✅ Done | `@tailwindcss/vite` plugin added in `vite.config.ts`; `@import "tailwindcss";` added to `src/index.css`; verified via `npm run build` (preflight/reset rules present in output CSS) |
| Apollo Client setup | ✅ Done | `@apollo/client` v4 + `graphql` installed. Client instance in `src/lib/apolloClient.ts` (`HttpLink` + `InMemoryCache`, URI from `VITE_GRAPHQL_URI`). `ApolloProvider` wraps `<App />` in `src/main.tsx`. Verified via `npm run build` (typecheck + bundle) and a dev-server smoke test |
| Routing shell | ⚠️ Partial | `react-router` installed and wired: `src/router.tsx` defines the router (`createBrowserRouter`), `src/main.tsx` renders `<RouterProvider router={router} />` inside `<ApolloProvider>`. Routes: `/` → `<App />`, and `/admin` → `<Admin />` (`src/pages/admin/Admin.tsx`, a layout rendering `Sidebar` + an `<Outlet />`) with one nested child, `/admin/skills/new` → `<AddSkillPage />` (`src/pages/admin/skills/AddSkillPage.tsx`, thin wrapper around `AddSkillForm`), verified end-to-end against the live backend + MongoDB. The old top-level `/skills/new` route was removed in favor of the nested `/admin` route. Real page routes for the other categories (Works, Blog, Case Study, etc.) not yet built |
| Form handling (react-hook-form + zod) | ✅ Done | `zod`, `react-hook-form`, `@hookform/resolvers` installed. Verified via smoke test using `zodResolver` with `useForm` — invalid input blocks submission and surfaces the zod error message; valid input calls the submit handler with parsed data. No real form (e.g. Contact Us) built yet |
| Vitest + RTL + MSW setup | ✅ Done | `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw` installed. `vite.config.ts` uses `vitest/config`'s `defineConfig` with a `test` block (jsdom environment, `src/test/setup.ts`, `VITE_GRAPHQL_URI` test env override since Vitest doesn't load `.env.development`). Smoke tests added under `src/test/smoke/` prove the harness end-to-end: RTL renders `<App />` in jsdom, MSW intercepts a GraphQL request made through the real `apolloClient` (matching the backend's actual `health` query shape), `react-router`'s `RouterProvider`/`createMemoryRouter` redirects between routes, `react-hook-form` + `zodResolver` validate a form, and `react-i18next` renders + switches translations. `npm run test:run`, `npm run build`, and `npm run test:coverage` all pass |
| Internationalization (i18n) | ✅ Done | `i18next` + `react-i18next` + `i18next-browser-languagedetector`. Config in `src/i18n/index.ts` (fallback `en`, detection order querystring→localStorage→navigator), initialized in `src/main.tsx`. one folder per language, one file per component/namespace under `src/i18n/locales/<lng>/` (currently `en/common.json` + `en/nav.json`); type-safe keys via `src/i18n/i18n.d.ts` (`resolveJsonModule` enabled). Scoped to UI strings; backend content not localized. Verified via smoke test (English render + runtime language switch) and `npm run build` |
| Theming (light/dark/system) | ✅ Done | CSS-variable driven (no React provider). `data-theme` on `<html>` + `prefers-color-scheme` media query resolve the mode in `src/index.css`; Tailwind `dark:` variant mirrors it via block `@custom-variant`. Vanilla `src/theme/theme.ts` (`getStoredTheme`/`setTheme`/`applyTheme`) + `localStorage`, pre-paint attribute setter in `index.html`, default `system`. Verified via 5 unit tests + build (compiled CSS inspected) + dev smoke. Pending: an in-app `ThemeToggle` block (no UI switcher yet) |
| Layout (nav/footer) | ⚠️ Partial | Admin `Sidebar` component built (`src/components/Sidebar/`): `<nav>` landmark with a link per content category (Basic Info, Experience, Works, Skills, Blogs, Case Studies, White Papers, Certifications, Education, Contact Us), using `react-router`'s `NavLink` (`aria-current="page"` on the active link) and its own `sidebar` i18n namespace. Composed into `Admin` (`src/pages/admin/Admin.tsx`), the parent layout for all `/admin/*` routes, which renders `Sidebar` alongside an `<Outlet />` for the matched child page. Only `/admin/skills/new` is wired so far; the rest of the category paths the Sidebar links to have no matching route yet (see "Open decisions"). Public site nav/footer still not started |
| `src/blocks/` scaffolding | ⚠️ Partial | Convention documented above (rule of two). `Button` and `Input` blocks exist (component + colocated test + story), exported from `src/blocks/index.ts`. `Input` is a labeled text field with border/hover/focus/focus-visible states meeting WCAG 2.2 AA non-text contrast (≥3:1 borders/focus ring) and AA text contrast (≥4.5:1 label/error text), `forwardRef` so it works directly with `react-hook-form`'s `register()`. `AddSkillForm` was refactored to consume it for all 5 fields instead of inline `<input>`s. Other primitives (Checkbox, Select, etc.) extracted on demand |
| Storybook | ✅ Done | v10 `@storybook/react-vite`, scoped to `src/blocks/**` + `src/components/**` in `.storybook/main.ts`, Tailwind imported in `.storybook/preview.tsx`. Addons: a11y + docs. Verified via `npm run build-storybook` (Button story compiles/renders). Note: the init's `@storybook/addon-vitest` browser-test integration (Playwright) was intentionally removed — it broke the Vitest config and duplicates the existing jsdom + RTL TDD suite. Story-based browser testing can be revisited later if needed |

## Open decisions

- Define page routes for the remaining content categories (Works, Blog, Case Study, White Paper, etc.) and wire them as children of `Admin` under `/admin/*` in `src/router.tsx`, following the `/admin/skills/new` pattern (`src/pages/admin/<category>/`) — the `Sidebar` component already links to `/admin/<category>` for all of them.
- Define GraphQL contracts for the 8 categories with no backend module, so MSW mocks and backend implementation stay in sync.
- Contact form: mutation against backend vs. third-party form service — undecided now that the project is API-driven end-to-end. Once decided, build the actual form with `react-hook-form` + `zod` (already installed) and redirect on success via `react-router`.
- Deployment target for frontend (Vercel/Netlify/etc.) and how it points at the backend's deployed GraphQL URL per environment.

## Legend
- ✅ Done — implemented, covered by passing tests, and (for any UI) WCAG 2.2 AA-clean
- ⚠️ Partial — implemented but has known gaps
- ❌ Not started — no implementation found
