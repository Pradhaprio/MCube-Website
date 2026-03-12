# 1. architecture

- Frontend: `React + Vite + Tailwind CSS`, mobile-first public storefront and owner dashboard in one app.
- Backend: `Node.js + Express`, JWT-protected owner routes, consent-based lead capture, local uploads, optional SMTP email.
- Data: local JSON persistence for zero-setup development in `backend/src/data/store.json`; PostgreSQL mode is supported through `STORAGE_DRIVER=postgres` and `DATABASE_URL`.
- Privacy rule enforced: visitors browse without login, phone numbers are collected only through visible forms with a consent checkbox, anonymous analytics store no personal identity.

# 2. folder structure

```text
M-Cube Mobile website/
  backend/
    src/
      config/
      controllers/
      data/
      middleware/
      routes/
      services/
      utils/
    uploads/
  database/
    schema.sql
  docs/
    project-output.md
  frontend/
    public/
    src/
      api/
      components/
      context/
      lib/
      pages/
      styles/
```

# 3. database schema

- PostgreSQL schema is in `database/schema.sql`.
- Primary entities: `owners`, `store_profiles`, `categories`, `catalog_items`, `catalog_images`, `catalog_tags`, `reviews`, `leads`, `analytics_events`, `notifications`.
- Catalog supports `mobile`, `accessory`, and `service` through `item_type`.
- Every lead stores the exact triggering item snapshot, consent flag, and consent timestamp.
- Anonymous analytics store session ID, page path, device type, referrer, CTA clicked, and viewed item ID only.

# 4. API routes

Public routes:
- `GET /api/health`
- `GET /api/store/profile`
- `GET /api/catalog`
- `GET /api/catalog/:slug`
- `GET /api/reviews`
- `POST /api/leads`
- `POST /api/analytics/events`

Owner routes:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/store/profile`
- `POST /api/catalog`
- `PUT /api/catalog/:id`
- `DELETE /api/catalog/:id`
- `GET /api/leads`
- `GET /api/leads/export.csv`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id`
- `GET /api/analytics/summary`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/uploads/images`

# 5. complete frontend code

- Public website, owner dashboard, PWA assets, mobile bottom navigation, sticky CTA bar, callback/enquiry bottom sheet, wishlist, recently viewed, dark mode, and toast system are implemented under `frontend/src`.
- Main route entry: `frontend/src/App.jsx`
- Public pages: `frontend/src/pages`
- Owner pages: `frontend/src/pages/owner`
- Shared UI and catalog components: `frontend/src/components`

# 6. complete backend code

- Express API, auth, catalog CRUD, lead capture, analytics, notifications, reviews, uploads, and seed store are implemented under `backend/src`.
- Server entry: `backend/src/server.js`
- Seed data: `backend/src/data/seed.js`
- Development persistence: `backend/src/services/dataStore.js`

# 7. environment variables

Frontend:
- `VITE_API_URL=http://localhost:4000/api`

Backend:
- `PORT=4000`
- `CLIENT_URL=http://localhost:5173`
- `JWT_SECRET=change-me-in-production`
- `JWT_EXPIRES_IN=7d`
- `STORAGE_DRIVER=file`
- `DATABASE_URL=`
- `AUTO_INIT_DB=true`
- `SHOP_NOTIFICATION_EMAIL=`
- `SMTP_HOST=`
- `SMTP_PORT=587`
- `SMTP_USER=`
- `SMTP_PASS=`

# 8. sample seed data

- Seed owner login:
  - email: `owner@mcubemobile.local`
  - password: `Owner@123`
- Seed catalog includes:
  - mobiles
  - accessories
  - service offerings
- Seed file: `backend/src/data/seed.js`

# 9. run instructions

1. In the project root, run `npm install`.
2. `frontend/.env` and `backend/.env` are already created with local defaults.
3. Optional PostgreSQL mode:
   set `STORAGE_DRIVER=postgres` and `DATABASE_URL=postgres://mcube:mcube@localhost:5432/mcube_mobile`.
4. Optional local PostgreSQL container:
   run `docker compose up -d` from the project root.
5. Start backend with `npm run dev:backend`.
6. Start frontend with `npm run dev:frontend`.
7. Open `http://localhost:5173`.
8. Owner login is available at `/owner/login`.
9. Automated backend tests: `npm test --workspace backend`
10. Frontend production build: `npm run build --workspace frontend`

# 10. test checklist

- Visitor can browse home, mobiles, accessories, services, and item detail pages without login.
- Product/service detail page records anonymous view events.
- Sticky CTA bar is visible on mobile pages.
- WhatsApp CTA opens a prefilled message with the item name.
- Call CTA opens a `tel:` link.
- Callback and enquiry bottom sheets require consent before submission.
- Lead submission stores the exact triggering item and consent timestamp.
- Owner can log in and see dashboard stats.
- Owner can add, edit, and delete catalog items.
- Owner can view, update, export, and delete leads.
- Owner can view anonymous interest notifications separately from identified leads.
- PWA manifest and service worker are served from `frontend/public`.
