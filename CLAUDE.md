# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Dev server at http://localhost:4200 (auto-reloads)
npm run build       # Production build to dist/
npm test            # Run all tests with Vitest
npm run test-coverage  # Tests with coverage report
npm run lint        # ESLint
npm run format      # Prettier (formats src/**/*.{ts,html,css})
```

To run a single test file:
```bash
npx vitest run src/app/services/book.spec.ts
```

## Backend

The app expects a Spring Boot REST API running at `http://localhost:8080`. The `BookService` calls `/books` with pagination params (`page`, `size`, `sortBy`).

## Architecture

**Angular 21 standalone components** — no NgModules anywhere. All components declare their own `imports` array.

**State management** uses Angular signals (`signal()`, `WritableSignal`) — no RxJS BehaviorSubject or NgRx.

**Dependency injection** uses `inject()` function only — no constructor injection pattern.

**Subscription cleanup** uses `takeUntilDestroyed(this.destroyRef)` — no manual `ngOnDestroy` unsubscribe.

**Component I/O** uses `input()` and `output()` functions — not `@Input()`/`@Output()` decorators.

### Component tree

```
App
└── BookList          # Smart component: state, pagination, dialog orchestration
    ├── BookTable     # Dumb component: renders Material table, emits editBook/deleteBook
    ├── BookForm      # Dialog: reactive form for create/update (opened via MatDialog)
    └── ConfirmDialog # Shared dialog: yes/no confirmation, receives message string via MAT_DIALOG_DATA
```

**`BookList`** owns all state (books list, loading, pagination signals) and handles all `BookService` calls. It opens `BookForm` and `ConfirmDialog` via `MatDialog`, then reacts to `afterClosed()` to decide whether to create, update, or delete.

**`BookForm`** receives a `Book | null` via `MAT_DIALOG_DATA` — `null` means create, a book object means edit. It closes the dialog with the form value (including `id` if editing).

**`ConfirmDialog`** receives a message string via `MAT_DIALOG_DATA` and closes with `true`/`false`.

### Key interfaces

- `Book` — `{ id?: number, title, author, isbn, genre, publishingYear, language }`. `id` is optional to support the create case.
- `PageResponse<T>` — Spring Page wrapper with `content`, `totalElements`, `totalPages`, `first`, `last`, etc.

## Testing

Tests use **Vitest** (not Jest) with Angular `TestBed`. HTTP calls are tested with `HttpTestingController` from `@angular/common/http/testing`. Use `provideHttpClient()` + `provideHttpClientTesting()` together in test providers.

## TypeScript

Strict mode is fully enabled including `strictTemplates`, `strictInjectionParameters`, `noImplicitReturns`, and `noPropertyAccessFromIndexSignature`.
