# VendorFlow

VendorFlow is a full-stack business management system for tracking customers, orders, payments, invoices, notifications, and dashboard analytics. It is built as a React frontend with an Express, Prisma, and MySQL backend.

## Features

- JWT authentication with access and refresh tokens
- Customer management with status and outstanding balance tracking
- Product and order lifecycle management
- Payment tracking for paid, partial, pending, and overdue payments
- Dashboard summary with recent orders, notifications, analytics, and insights
- PDF invoice generation and stored invoice uploads
- Reports export support
- Swagger API documentation
- Seeded demo accounts and sample business data

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| UI | Framer Motion, Lucide React, React Toastify |
| Backend | Node.js, Express.js |
| Database | MySQL with Prisma ORM |
| Auth | JWT, bcrypt |
| Documents | PDFKit |
| API Docs | Swagger UI |
| Testing | Jest, Supertest |
| Linting | ESLint |

## Project Structure

```text
Vendor-Flow/
  backend/
    prisma/              # Prisma schema, migrations, and seed script
    src/
      config/            # Prisma and Swagger configuration
      controllers/       # Request handlers
      middleware/        # Auth, role, validation, and error middleware
      routes/            # API route definitions
      services/          # Business logic helpers
      validations/       # Request validation rules
      app.js             # Express app setup
      server.js          # Server entry point
    tests/               # Backend tests
    uploads/             # Generated invoice files
  frontend/
    public/              # Static assets
    src/
      components/        # Shared UI components
      context/           # Auth context
      pages/             # App pages
      services/          # API service wrappers
      utils/             # Utility helpers
    eslint.config.js     # Frontend lint configuration
```

## Prerequisites

- Node.js 18 or newer
- npm
- MySQL server
- A MySQL database named `vendorflow`, or any MySQL database configured in `DATABASE_URL`

## Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mysql://USER:PASSWORD@localhost:3306/vendorflow
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
INVOICE_DIR=uploads/invoices
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Database Setup

From the `backend` folder:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

The seed script creates demo users, customers, products, orders, payments, notifications, and invoices.

## Running Locally

Start the backend API:

```bash
cd backend
npm run dev
```

Start the frontend app in a second terminal:

```bash
cd frontend
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- API documentation: `http://localhost:5000/api/docs`
- Health check: `http://localhost:5000/api/health`

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@vendorflow.test` | `Admin@12345` |
| Staff | `staff@vendorflow.test` | `Staff@12345` |

## Available Scripts

Backend scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend with Nodemon |
| `npm start` | Start the backend with Node |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run development migrations |
| `npm run prisma:deploy` | Deploy migrations in production |
| `npm run seed` | Seed demo data |
| `npm test` | Run backend tests |

Frontend scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production assets |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Main API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET|POST /api/customers`
- `GET|POST /api/products`
- `GET|POST /api/orders`
- `GET /api/payments`
- `PUT /api/payments/:id/status`
- `GET /api/reports/analytics`
- `GET /api/reports/insights`
- `GET /api/notifications`
- `POST /api/invoices/orders/:orderId/generate`

Swagger documentation is available at `/api/docs` when the backend is running.

## Verification

Run these checks before deployment or handoff:

```bash
cd backend
npm test
npm run prisma:generate
```

```bash
cd frontend
npm run lint
npm run build
```

## Deployment Notes

Frontend:

- Deploy the `frontend` folder to Vercel, Netlify, or another static hosting provider.
- Set `VITE_API_URL` to the deployed backend API URL.

Backend:

- Deploy the `backend` folder to Render, Railway, or another Node.js host.
- Set `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, and `INVOICE_DIR`.
- Use `npm run prisma:deploy` during deployment to apply migrations.

Database:

- Use MySQL or a MySQL-compatible hosted database.
- Keep production credentials out of source control.

## Troubleshooting

If dependencies are missing after cleanup:

```bash
cd backend
npm install

cd ../frontend
npm install
```

If Prisma cannot connect, verify that MySQL is running and that `DATABASE_URL` points to the correct database.

If the frontend cannot reach the backend, confirm that `VITE_API_URL` matches the backend URL and that `FRONTEND_URL` is allowed by the backend CORS configuration.
