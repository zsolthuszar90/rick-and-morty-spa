# Rick & Morty SPA

[![CI](https://github.com/zsolthuszar90/rick-and-morty-spa/actions/workflows/ci.yml/badge.svg)](https://github.com/zsolthuszar90/rick-and-morty-spa/actions/workflows/ci.yml)

Lists [Rick & Morty](https://rickandmortyapi.com/) characters in a table, with a
profile page for each. Coding assignment.

## Features

The home page lists characters in a table with their avatar, name, species and
status. Clicking a name opens that character's profile, which has a Back button.
Both pages show a skeleton while loading and an alert if the request fails.

## Toolchain decisions

This is my go-to setup for SPA projects, so most of it was less a decision than a
default I already trust. It's a small app either way, and my main worry was
over-engineering it.

**Vite + React + TypeScript.** React is what I work in daily, and Vite is the
fastest way to get a client-side app running with it: instant dev server, and one
config that Vitest reuses. TypeScript is always a must in my code.

**TanStack Router.** My go-to router these days, mostly for the type safety:
routes, params and search params are all typed. That last part suits both bonus
tasks, since `?page=2&q=rick` gets parsed and validated at the route.

**TanStack Query.** I reach for it any time data comes from a server. Caching
and request handling come for free, and `keepPreviousData` makes the pagination
easy.

**Tailwind + shadcn/ui.** What I style with day to day. I'd rather reuse a
component than reuse a CSS class: the styles stay next to the markup they belong
to, so there's no stylesheet to keep in sync and no class names to invent. shadcn
fits that, since it copies component source into the repo rather than hiding it
behind a package, so anything I need can be changed in place.

**Vitest + Testing Library + jsdom.** Shares the Vite config, so no second build
pipeline to maintain. Integration tests are the same tools at a wider scope, not
a separate library.

**MSW** for mocking in tests. I like that it fakes the server rather than my
code, so the real `fetch` still runs and the test breaks if I ask for the wrong
URL.

**Playwright** for e2e, against a production build rather than the dev server.

**A hand-written API client**, rather than the official `rickmortyapi` package.
Its calls resolve on every response and hand back a status code instead of
throwing, so TanStack Query would treat a 404 as a success and never show an
error state. It also has no way to pass an `AbortSignal`, so requests can't be
cancelled. Wrapping it to fix both would be more code than the client it
replaces.

## Implementation decisions

**The API returns 404 for two different things**: a name search that matched
nothing, and a character id that doesn't exist. The first is a normal empty
result, so it comes back as an empty page. The second stays an error. Same
status code, opposite handling.

**Route params are parsed at the route boundary.** `/character/abc` is rejected
before anything is requested, so `id` is a number everywhere inside instead of a
string that might turn into `NaN`.

**Back uses browser history when there is any**, so returning to the table keeps
its state, and falls back to the character list when the profile was opened from
a direct link.

**Skeletons mirror the real layout** — same columns, same row count as a real
page — so nothing moves when the data arrives.

**Search runs on the server, not over the rows already loaded.** Filtering the
current page would mean searching 20 of 826 characters, so "beth" on page one
finds nothing. The query lives in the URL as `?q=`, the input stays instant, and
only the request is debounced.

**The API's rate limit is left in place rather than worked around.** One page
costs 21 requests against a limit of about 30, so user easily gets throttled. Requests retry past the block, and a toast explains the
wait.

**Avatars have empty alt text.** The name is in the next cell, so a screen reader
would otherwise announce it twice.

## Getting started

```bash
npm install
npm run dev
```

`build` typechecks then builds, `preview` serves the result. `lint` runs oxlint,
`format` and `format:check` run Prettier. `test` and `test:watch` run Vitest,
`test:e2e` runs Playwright (needs `npx playwright install chromium` first).

A pre-commit hook formats and lints the staged files, then typechecks and runs
the tests. A pre-push hook runs the Playwright suite, which needs the network
since it hits the real API. CI runs everything again on push.
