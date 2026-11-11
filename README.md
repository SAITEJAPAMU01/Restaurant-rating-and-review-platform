# 🍽️ TejaScore — Restaurant Rating & Review Platform

A full-stack, enterprise-grade restaurant discovery, rating, and review platform built with the **MERN Stack** (React, Node.js, Express, MongoDB). Enforces strict role-based access control (RBAC), database-level unique review constraints, server-side search and filtering, and MongoDB aggregation pipelines for rating distributions and platform statistics.

---

## 🌟 Key Features & Requirements Met

| Requirement | Implementation Details |
| :--- | :--- |
| **Roles & Permissions** | **Administrator**, **Restaurant Owner**, **Customer** with strict backend route & ownership authorization. |
| **Mandatory Unique Review Rule** | Compound unique index `({ customer: 1, restaurant: 1 }, { unique: true })` enforced at MongoDB level. Returns clean `409 Conflict` if duplicated. |
| **Strict Rating Validation** | Rejects invalid ratings (0, 6, -1, 3.5, empty, non-numeric). Only whole integers 1 to 5 are accepted (`400 Bad Request`). |
| **Advanced Rating Distribution** | MongoDB `$facet` aggregation pipeline calculating 5★, 4★, 3★, 2★, 1★ breakdown with exact counts and percentages. |
| **Server-Side Search & Filters** | Search by restaurant name, filter by location and cuisine processed on the Express API via MongoDB regex/queries. |
| **Admin Control Panel** | KPI dashboard metrics (Total Users, Total Restaurants, Total Reviews, Platform Avg Rating via aggregation), owner creation, restaurant assignments, and review moderation. |
| **Owner Portal** | View assigned restaurant, update permitted details, monitor live review feedback, customer names, and average ratings. |
| **Customer Experience** | Browse, search, filter, view ratings, write a review, update own review, delete own review. |
| **Security & Authentication** | JWT authentication, passwords hashed with `bcryptjs` (never plaintext), password complexity validation. |

---

## 🔑 Pre-Seeded Sample Credentials

Use these credentials to test the platform immediately. The database automatically seeds them upon starting!

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@platform.com` | `Admin@1234` | Full access to users, restaurants, assignments & moderation. |
| **Restaurant Owner** | `owner.mario@platform.com` | `Owner@1234` | Manages *Trattoria Bella* (Italian, New York). |
| **Restaurant Owner** | `owner.sakura@platform.com` | `Owner@1234` | Manages *Sakura Bistro* (Japanese, San Francisco). |
| **Restaurant Owner** | `owner.priya@platform.com` | `Owner@1234` | Manages *Spice Symphony* (Indian, Chicago). |
| **Customer** | `customer.alex@example.com` | `Customer@1234` | Verified customer account with existing reviews. |
| **Customer** | `customer.sarah@example.com` | `Customer@1234` | Verified customer account. |

> 💡 *Tip: The web UI features 1-click Quick Demo buttons on the login page to immediately log in as Admin, Owner, or Customer without typing.*

---

## 🏗️ Project Architecture

```
restaurant-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Persistent MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Register, login, getProfile
│   │   ├── restaurantController.js # CRUD, search/filter, aggregation metrics
│   │   ├── reviewController.js     # One-review rule, 1-5 validation, customer CRUD
│   │   └── adminController.js      # Dashboard stats, owner creation, moderation
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification & role authorization (RBAC)
│   │   ├── validation.js           # Password strength, 1-5 rating integer validation
│   │   └── errorHandler.js         # Centralized error handler with proper HTTP codes
│   ├── models/
│   │   ├── User.js                 # Customer, Owner, Admin schema + bcrypt hooks
│   │   ├── Restaurant.js           # Restaurant schema, owner ref, search indexes
│   │   └── Review.js               # Compound unique index ({ customer: 1, restaurant: 1 })
│   ├── routes/                     # Express REST routes
│   ├── seed.js                     # Sample database seeder
│   └── server.js                   # Server entrypoint with auto-seeding
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, StarRating, RatingDistribution, ReviewModal
│   │   ├── context/                # AuthContext (JWT, session, role checking)
│   │   ├── pages/                  # HomePage, RestaurantDetailPage, OwnerDashboard, AdminDashboard, Auth pages
│   │   ├── services/api.js         # Centralized API fetch wrapper with Bearer token
│   │   ├── App.jsx
│   │   └── index.css               # Modern responsive design
│   └── vite.config.js              # Vite config with backend proxy
├── postman_collection.json         # Postman API Collection
├── README.md                       # Complete documentation
└── .env.example
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (local instance or MongoDB Atlas)

### 2. Setup Backend
```bash
cd backend
npm install
npm run seed     # Seeds sample users, restaurants, and reviews
npm run dev      # Starts API server on http://localhost:5000
```

Before starting, copy `backend/.env.example` to `backend/.env`, set `MONGODB_URI` to a persistent local or Atlas database, and replace `JWT_SECRET` with a unique random value. For example, generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The backend exits with an error if MongoDB cannot be reached or `JWT_SECRET` is missing; it does not fall back to a volatile in-memory database.

### 3. Setup Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev      # Starts React Vite dev server on http://localhost:3000
```
Open **`http://localhost:3000`** in your browser.

---

## 📊 Advanced Requirement: MongoDB Aggregation Pipeline

The rating distribution and summary are computed efficiently on the database server using MongoDB's `$facet` and `$group` aggregation pipeline:

```javascript
const stats = await Review.aggregate([
  { $match: { restaurant: objectId } },
  {
    $facet: {
      summary: [
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ],
      distribution: [
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
      ],
    },
  },
]);
```
This produces the formatted output:
- ★★★★★ 5 Stars: 42 (46%)
- ★★★★☆ 4 Stars: 28 (31%)
- ★★★☆☆ 3 Stars: 12 (13%)
- ★★☆☆☆ 2 Stars: 5 (5%)
- ★☆☆☆☆ 1 Star : 3 (3%)

---

## 🔒 Security & Password Rules

All passwords are validated on both frontend and backend using strict rules:
- Length: 8 to 16 characters
- At least 1 uppercase letter (`A-Z`)
- At least 1 lowercase letter (`a-z`)
- At least 1 numerical digit (`0-9`)
- At least 1 special character (`!@#$%^&*(),.?":{}|<>`)

---

## 📡 REST API Reference & HTTP Status Codes

The API uses standard HTTP response status codes:
- **`200 OK`**: Successful read or update.
- **`201 Created`**: Resource successfully created.
- **`400 Bad Request`**: Validation error (invalid rating, malformed ID, weak password).
- **`401 Unauthorized`**: Authentication missing or expired token.
- **`403 Forbidden`**: Role not authorized or updating someone else's review/restaurant.
- **`404 Not Found`**: Resource does not exist.
- **`409 Conflict`**: Duplicate user email or customer already reviewed this restaurant.
- **`500 Internal Server Error`**: Unexpected server error.

### Key Endpoints

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register customer |
| `/api/auth/login` | `POST` | Public | Authenticate user & retrieve JWT |
| `/api/auth/me` | `GET` | Private | Retrieve current user profile |
| `/api/restaurants` | `GET` | Public | Browse, search by name, filter by location/cuisine |
| `/api/restaurants/:id` | `GET` | Public | Restaurant details, average rating & rating distribution |
| `/api/restaurants` | `POST` | Admin | Create new restaurant |
| `/api/restaurants/:id` | `PUT` | Owner/Admin | Update permitted restaurant details |
| `/api/restaurants/:id` | `DELETE` | Admin | Delete restaurant |
| `/api/restaurants/owner/my-restaurant` | `GET` | Owner | View assigned restaurant, reviews & customers |
| `/api/restaurants/:id/reviews` | `POST` | Customer | Submit 1–5 star rating & review (1 per restaurant) |
| `/api/reviews/:id` | `PUT` | Customer | Update customer's own review |
| `/api/reviews/:id` | `DELETE` | Customer/Admin | Delete customer's own review, or Admin moderation |
| `/api/admin/dashboard` | `GET` | Admin | Overall metrics (total users, restaurants, reviews, avg rating) |
| `/api/admin/users` | `GET` | Admin | User directory with search and role filter |
| `/api/admin/users/:id` | `PUT` | Admin | Update a user's name, email, or role |
| `/api/admin/users/:id` | `DELETE` | Admin | Delete a user, their reviews, and restaurant assignments |
| `/api/admin/owners` | `POST` | Admin | Create restaurant owner account |
| `/api/admin/restaurants/:id/assign-owner` | `PUT` | Admin | Assign or reassign owner to restaurant |
| `/api/admin/reviews` | `GET` | Admin | View all reviews across platform for moderation |

---

## 📬 Postman / Bruno Collection

Import the included **`postman_collection.json`** into Postman or Bruno. It has pre-configured requests, auto-saving environment variables for `adminToken`, `ownerToken`, and `customerToken` on login, and sample payloads.
