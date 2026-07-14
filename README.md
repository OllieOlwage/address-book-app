# Address Book App

A full-stack Address Book application for managing contacts. Built with Angular 19 + Node.js/Express + SQLite.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, Angular Material, TypeScript |
| Backend | Node.js, Express 5, TypeScript |
| Database | SQLite (better-sqlite3) |
| Testing | Vitest + supertest (backend), Karma + Jasmine (frontend) |

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the App

Start both the backend and frontend in separate terminals:

```bash
# Terminal 1 — Backend API (port 3000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 4200)
cd frontend
ng serve
```

Open http://localhost:4200 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | List all contacts |
| GET | `/api/contacts/:id` | Get contact by ID |
| POST | `/api/contacts` | Create a new contact |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |

## Running Tests

```bash
# Backend tests (27 tests)
cd backend
npm test

# Frontend tests
cd frontend
ng test
```

## Project Structure

```
address-book-app/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express app entry point
│   │   ├── routes/contacts.ts    # CRUD route handlers
│   │   ├── models/contact.ts     # Types + validation
│   │   ├── db/database.ts        # SQLite connection
│   │   └── middleware/            # Error handling
│   └── tests/                    # Vitest test suites
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── contact-list/     # Main list with search
│       │   ├── contact-form/     # Add/Edit form
│       │   └── confirm-dialog/   # Delete confirmation
│       ├── services/             # HTTP client service
│       └── models/               # TypeScript interfaces
└── docs/SDD/                     # Design specification
```

## Features

- View, add, edit, and delete contacts
- Form validation (name, phone, email)
- Search/filter by name or email
- Responsive design (table on desktop, cards on mobile)
- Data persists in SQLite (survives page refresh)
- Proper error handling with meaningful messages
