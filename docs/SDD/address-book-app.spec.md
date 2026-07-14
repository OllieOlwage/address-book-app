# Address Book App — Software Design Document

**Ticket:** #1  
**Author:** Claude (Dev-ITS Workflow)  
**Status:** DRAFT  
**Complexity:** HIGH  
**Date:** 2026-07-14  

---

## 1. Overview

A full-stack Address Book application allowing users to manage contacts via a REST API backend and Angular frontend. All CRUD operations persist across page refreshes using SQLite.

---

## 2. Architecture

```
┌─────────────────────────────────────┐
│         Angular 17+ Frontend        │
│  (Standalone Components + Material) │
└──────────────────┬──────────────────┘
                   │ HTTP (localhost:4200 → :3000)
┌──────────────────▼──────────────────┐
│       Node.js / Express API         │
│         (Port 3000)                 │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│           SQLite Database           │
│        (data/contacts.db)           │
└─────────────────────────────────────┘
```

### Project Structure
```
address-book-app/
├── backend/
│   ├── src/
│   │   ├── index.ts            # Express app entry point
│   │   ├── routes/
│   │   │   └── contacts.ts     # Contact CRUD routes
│   │   ├── models/
│   │   │   └── contact.ts      # Contact type + validation
│   │   ├── db/
│   │   │   └── database.ts     # SQLite connection + schema
│   │   └── middleware/
│   │       └── errorHandler.ts # Global error handler
│   ├── tests/
│   │   ├── contacts.test.ts    # API integration tests
│   │   └── validation.test.ts  # Validation unit tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.routes.ts
│   │   │   ├── services/
│   │   │   │   └── contact.service.ts
│   │   │   ├── models/
│   │   │   │   └── contact.model.ts
│   │   │   └── components/
│   │   │       ├── contact-list/
│   │   │       ├── contact-form/
│   │   │       └── confirm-dialog/
│   │   ├── environments/
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── docs/
├── .dev-its/
└── README.md
```

---

## 3. Data Model

### Contact Entity

| Field | Type | Constraints |
|-------|------|------------|
| `id` | TEXT (UUID v4) | Primary Key, auto-generated |
| `firstName` | TEXT | Required, max 50 chars, trimmed |
| `lastName` | TEXT | Required, max 50 chars, trimmed |
| `cellNumber` | TEXT | Required, valid phone (E.164 or local formats) |
| `email` | TEXT | Required, valid email (RFC 5322 basic) |
| `createdAt` | TEXT (ISO 8601) | Auto-set on INSERT |
| `updatedAt` | TEXT (ISO 8601) | Auto-set on INSERT and UPDATE |

### SQLite Schema
```sql
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  cellNumber TEXT NOT NULL,
  email TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 4. API Design

**Base URL:** `http://localhost:3000/api`

### Endpoints

| Method | Path | Request Body | Success | Error Cases |
|--------|------|-------------|---------|-------------|
| GET | `/contacts` | — | 200 + `Contact[]` | 500 |
| GET | `/contacts/:id` | — | 200 + `Contact` | 404, 500 |
| POST | `/contacts` | `ContactInput` | 201 + `Contact` | 400 (validation), 500 |
| PUT | `/contacts/:id` | `ContactInput` | 200 + `Contact` | 400, 404, 500 |
| DELETE | `/contacts/:id` | — | 200 + `{ message }` | 404, 500 |

### Request/Response Types

```typescript
interface ContactInput {
  firstName: string;  // required, 1-50 chars
  lastName: string;   // required, 1-50 chars
  cellNumber: string; // required, valid phone
  email: string;      // required, valid email
}

interface Contact extends ContactInput {
  id: string;         // UUID v4
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

interface ValidationError {
  status: 400;
  message: string;
  errors: { field: string; message: string }[];
}
```

### Validation Rules
- `firstName`: non-empty after trim, max 50 characters
- `lastName`: non-empty after trim, max 50 characters
- `cellNumber`: matches `/^\+?[\d\s\-()]{7,15}$/` (international or local)
- `email`: matches standard email regex, max 254 characters

---

## 5. Frontend Design

### Pages / Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ContactListComponent` | Table of all contacts with search/filter |
| `/add` | `ContactFormComponent` | New contact form |
| `/edit/:id` | `ContactFormComponent` | Edit form (pre-populated) |

### Component Breakdown

#### ContactListComponent
- Fetches all contacts on init
- Displays in Material table with columns: Name, Cell, Email, Actions
- Search input filters by firstName, lastName, or email (client-side)
- Delete button opens `ConfirmDialogComponent`
- Edit button navigates to `/edit/:id`
- FAB or button to navigate to `/add`
- Loading spinner while fetching
- Empty state message when no contacts

#### ContactFormComponent (shared for Add/Edit)
- Reactive form with validators matching backend rules
- Mode determined by route (presence of `:id` param)
- On edit: fetches contact by ID and patches form
- Displays inline validation errors on blur/submit
- Submit → POST (add) or PUT (edit) → navigate to `/` on success
- Error toast/snackbar on API failure

#### ConfirmDialogComponent
- Material Dialog
- "Are you sure you want to delete {firstName} {lastName}?"
- Confirm / Cancel buttons

### Services

#### ContactService
- `getAll(): Observable<Contact[]>`
- `getById(id: string): Observable<Contact>`
- `create(input: ContactInput): Observable<Contact>`
- `update(id: string, input: ContactInput): Observable<Contact>`
- `delete(id: string): Observable<void>`
- Base URL configured via `environment.ts`

### Responsive Design
- Angular Material's grid/flex layout
- Table collapses to card layout on mobile (<768px)
- Form fields stack vertically on mobile

---

## 6. Tech Stack Decisions

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Backend runtime | Node.js + Express | Specified in ticket |
| Backend language | TypeScript | Type safety, shared types |
| Database | SQLite (better-sqlite3) | Simple, no external DB, synchronous API |
| Frontend framework | Angular 17+ | Specified in ticket, standalone components |
| UI library | Angular Material | Modern, accessible, responsive |
| Backend tests | Vitest + supertest | Fast, modern, good DX |
| Frontend tests | Karma + Jasmine | Angular default |
| UUID generation | `crypto.randomUUID()` | Built-in Node.js, no dependency |

---

## 7. Testing Strategy

### Backend Tests (Vitest)
- **Unit tests:** Validation functions (valid/invalid inputs for each field)
- **Integration tests:** Each endpoint via supertest (happy path + error cases)
- **Coverage target:** All endpoints, all validation rules, all error codes

### Frontend Tests (Karma/Jasmine)
- **Unit tests:** ContactService (mock HTTP), form validation logic
- **Component tests:** ContactList renders data, ContactForm validates
- **E2E (optional):** Full CRUD flow via Cypress or Playwright

---

## 8. Acceptance Criteria Mapping

| # | Criterion | Implementation |
|---|-----------|---------------|
| AC1 | View list of contacts | `ContactListComponent` + `GET /contacts` |
| AC2 | Add new contact | `ContactFormComponent` (add mode) + `POST /contacts` |
| AC3 | Edit existing contact | `ContactFormComponent` (edit mode) + `PUT /contacts/:id` |
| AC4 | Delete with confirmation | `ConfirmDialogComponent` + `DELETE /contacts/:id` |
| AC5 | Validation errors shown | Reactive form validators + 400 response handling |
| AC6 | Search/filter contacts | Client-side filter pipe on name/email |
| AC7 | Responsive design | Material layout, mobile breakpoint |
| AC8 | Proper API error codes | Express error handler + status codes |
| AC9 | Data persists on refresh | SQLite file-based storage |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| SQLite file locking under concurrent writes | Low (single-user app) | Synchronous better-sqlite3 avoids issues |
| Phone number format variety | Medium | Permissive regex; document accepted formats |
| CORS issues in dev | Low | Configure CORS middleware for localhost:4200 |
| Angular Material version mismatch | Low | Pin to Angular 17-compatible Material version |

---

## 10. Open Questions

1. **Phone number format:** Should we enforce E.164 strictly, or accept common local formats (e.g., `082 123 4567`, `(012) 345-6789`)? *Recommendation: permissive regex accepting both.*
2. **Pagination:** The ticket doesn't mention pagination. For simplicity, load all contacts. Acceptable for a learning project.
3. **Authentication:** Not mentioned in ticket — omitting auth entirely.

---

## 11. Out of Scope
- User authentication / multi-tenancy
- Pagination / infinite scroll
- Contact groups / categories
- Import/export (CSV, vCard)
- Profile photos
