# Architecture & Flow Diagrams

## 1. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER AUTHENTICATION FLOW                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  SIGNUP      │
└──────────────┘
       │
       ├─→ User submits (name, email, password)
       │
       ├─→ Validate inputs
       │
       ├─→ Check if email exists
       │
       ├─→ Hash password with bcrypt
       │
       ├─→ Create user in database
       │
       └─→ Send welcome email via SendGrid


┌──────────────┐
│  LOGIN       │
└──────────────┘
       │
       ├─→ User submits (email, password)
       │
       ├─→ Find user by email
       │
       ├─→ Verify password with bcrypt
       │
       ├─→ Generate JWT token
       │   ├─ Payload: { id, email }
       │   ├─ Secret: JWT_SECRET
       │   └─ Expires: 1 hour
       │
       ├─→ Return token to client
       │
       └─→ Client stores in HTTP-only cookie
           ├─ Secure: true (HTTPS only)
           ├─ HttpOnly: true (XSS protection)
           ├─ SameSite: strict (CSRF protection)
           └─ MaxAge: 3600 (1 hour)


┌──────────────────┐
│ MIDDLEWARE CHECK │
└──────────────────┘
       │
       ├─→ Check route (protected or public)
       │
       ├─→ If protected:
       │   ├─ Get token from cookie or Authorization header
       │   ├─ Verify JWT signature
       │   ├─ Check token expiration
       │   ├─ Decode token payload
       │   └─ Allow or deny request
       │
       └─→ If public:
           └─ Allow request


┌──────────────┐
│  LOGOUT      │
└──────────────┘
       │
       ├─→ User clicks logout
       │
       ├─→ Clear token cookie
       │
       └─→ Redirect to login page
```

---

## 2. Request Flow with Middleware

```
┌─────────────────────────────────────────────────────────────────┐
│              REQUEST FLOW WITH MIDDLEWARE                        │
└─────────────────────────────────────────────────────────────────┘

User Request
     │
     ├─→ Browser sends HTTP request
     │
     ├─→ Middleware intercepts (matcher routes)
     │
     ├─→ Middleware logic:
     │   │
     │   ├─ Route: / (home)
     │   │  └─ Public → Next()
     │   │
     │   ├─ Route: /login (login)
     │   │  └─ Public → Next()
     │   │
     │   ├─ Route: /signup (signup)
     │   │  └─ Public → Next()
     │   │
     │   ├─ Route: /dashboard (protected)
     │   │  ├─ Check token in cookie
     │   │  ├─ Verify JWT
     │   │  ├─ Valid? → Next()
     │   │  └─ Invalid? → Redirect to /login
     │   │
     │   ├─ Route: /users (protected)
     │   │  ├─ Check token in cookie
     │   │  ├─ Verify JWT
     │   │  ├─ Valid? → Next()
     │   │  └─ Invalid? → Redirect to /login
     │   │
     │   ├─ Route: /api/users (protected)
     │   │  ├─ Check Authorization header or cookie
     │   │  ├─ Verify JWT
     │   │  ├─ Valid? → Next()
     │   │  └─ Invalid? → Return 401/403
     │   │
     │   └─ Route: /api/admin (protected)
     │      ├─ Check Authorization header or cookie
     │      ├─ Verify JWT
     │      ├─ Valid? → Next()
     │      └─ Invalid? → Return 401/403
     │
     └─→ Route handler processes request
         │
         ├─ Database queries
         ├─ Business logic
         ├─ Response generation
         │
         └─→ Response sent to client
```

---

## 3. Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER TABLE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Column        │ Type      │ Constraints                        │
│  ─────────────┼───────────┼────────────────────────────────────│
│  id           │ UUID      │ PRIMARY KEY                        │
│  name         │ String    │ NOT NULL                           │
│  email        │ String    │ NOT NULL, UNIQUE                  │
│  password     │ String    │ NOT NULL (bcrypt hashed)          │
│  createdAt    │ DateTime  │ NOT NULL, DEFAULT NOW()           │
│  updatedAt    │ DateTime  │ NOT NULL, DEFAULT NOW()           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. File Structure

```
src/app/
│
├── middleware.ts                    ← JWT verification
│
├── layout.tsx                       ← Navigation & wrapper
├── page.tsx                         ← Home page (public)
├── not-found.tsx                    ← 404 page
│
├── login/
│   └── page.tsx                     ← Login form (public)
│
├── signup/
│   └── page.tsx                     ← Signup form (public)
│
├── dashboard/
│   └── page.tsx                     ← Dashboard (protected)
│
├── users/
│   ├── page.tsx                     ← Users list (protected)
│   │
│   └── [id]/
│       └── page.tsx                 ← User detail (protected)
│
├── api/
│   │
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts             ← Login endpoint
│   │   │
│   │   ├── signup/
│   │   │   └── route.ts             ← Signup endpoint
│   │   │
│   │   └── logout/
│   │       └── route.ts             ← Logout endpoint
│   │
│   ├── users/
│   │   ├── route.ts                 ← Get all users (protected)
│   │   │
│   │   └── [id]/
│   │       └── route.ts             ← Get user by ID (protected)
│   │
│   └── admin/
│       └── route.ts                 ← Admin endpoints (protected)
│
├── lib/
│   ├── prisma.ts                    ← Database client
│   ├── logger.ts                    ← Logging utility
│   ├── useAuth.ts                   ← Auth hook
│   ├── emailTemplates.ts            ← Email templates
│   ├── env.ts                       ← Environment variables
│   ├── redis.ts                     ← Redis client
│   └── transactionDemo.ts           ← Transaction examples
│
├── schemas/
│   └── userSchema.ts                ← Zod schemas
│
├── utils/
│   ├── errorCodes.ts                ← Error definitions
│   ├── errorHandler.ts              ← Error handling
│   └── responseHandler.ts           ← Response formatting
│
└── globals.css                      ← Global styles

prisma/
├── schema.prisma                    ← Database schema
├── migrations/                      ← Database migrations
│   ├── 20260112094611_init_schema/
│   ├── 20260112122734_add_indexes_for_optimisation/
│   └── 20260121064749/
│
├── seed.ts                          ← Database seeding
├── test.ts                          ← Database testing
└── check-data.ts                    ← Data validation
```

---

## 5. Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Input Validation
├─ Email format validation
├─ Password minimum length (6 chars)
├─ Name validation
└─ Zod schema validation

Layer 2: Password Security
├─ bcrypt hashing (10 salt rounds)
├─ Password comparison for verification
└─ Never store plain-text passwords

Layer 3: JWT Security
├─ Cryptographic signing with JWT_SECRET
├─ Token expiration (1 hour)
├─ Payload includes user ID and email
└─ Signature verification on every request

Layer 4: Cookie Security
├─ HTTP-only flag (prevents XSS attacks)
├─ Secure flag (HTTPS only in production)
├─ SameSite: strict (prevents CSRF attacks)
└─ MaxAge: 3600 (auto-expires after 1 hour)

Layer 5: Middleware Protection
├─ Route-level access control
├─ Token validation before handler execution
├─ Automatic redirect for unauthorized access
└─ 401/403 responses for API endpoints

Layer 6: API Security
├─ Authorization header parsing (Bearer token)
├─ Cookie fallback support
├─ Token signature verification
└─ Expiration checking

Layer 7: Database Security
├─ Parameterized queries (Prisma ORM)
├─ Unique email constraint
└─ User isolation in data queries
```

---

## 6. Token Lifecycle

```
┌────────────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                              │
└────────────────────────────────────────────────────────────────┘

T+0 min (Token Created)
├─ User logs in
├─ JWT generated with payload
├─ Signature added using JWT_SECRET
├─ Token sent to client
└─ Stored in HTTP-only cookie

T+0-59 min (Token Valid)
├─ Token included in requests
├─ Middleware verifies signature
├─ Expiration checked (exp < now)
├─ ✓ Access granted
└─ Request processed

T+60 min (Token Expires)
├─ Current time >= exp claim
├─ Signature verification still works
├─ But expiration check fails
├─ ✗ Access denied
└─ User redirected to login

After Logout
├─ Cookie cleared from browser
├─ Token revoked on client-side
├─ Next request has no token
├─ Middleware denies access
└─ User redirected to login

Optional: Refresh Token (Future)
├─ Refresh token has longer expiration
├─ Can be used to get new JWT
├─ Without re-entering password
├─ Implements token rotation
└─ Better security model
```

---

## 7. Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                 COMPONENT INTERACTION DIAGRAM                    │
└─────────────────────────────────────────────────────────────────┘

User (Browser)
    │
    ├─ Visits http://localhost:3000
    │
    ├─→ Browser requests /
    │
    ├─→ Middleware checks middleware.ts
    │   └─ Route / is public → Allow
    │
    ├─→ page.tsx (Home) renders
    │
    ├─ User clicks "Login"
    │
    ├─→ Browser requests /login
    │
    ├─→ Middleware checks
    │   └─ Route /login is public → Allow
    │
    ├─→ login/page.tsx renders form
    │
    ├─ User submits credentials
    │
    ├─→ POST /api/auth/login
    │
    ├─→ API Route Handler
    │   ├─ Verify email/password
    │   ├─ Generate JWT token
    │   └─ Send token to client
    │
    ├─ Browser stores token in cookie
    │
    ├─ User navigates to /dashboard
    │
    ├─→ Browser requests /dashboard
    │
    ├─→ Middleware checks middleware.ts
    │   ├─ Route /dashboard is protected
    │   ├─ Get token from cookie
    │   ├─ Verify token signature
    │   ├─ Check expiration
    │   └─ Token valid → Allow
    │
    ├─→ dashboard/page.tsx renders
    │   ├─ Shows user info
    │   ├─ Shows quick actions
    │   └─ Shows logout button
    │
    ├─ User clicks "Logout"
    │
    ├─→ POST /api/auth/logout
    │
    ├─→ API clears cookie
    │   └─ Returns success response
    │
    ├─ Browser removed token
    │
    ├─→ Browser redirects to /login
    │
    └─ Login page rendered again
```

---

## 8. Error Handling Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                  ERROR HANDLING FLOW                              │
└──────────────────────────────────────────────────────────────────┘

API Request
    │
    ├─ Try to process request
    │
    ├─ Error occurs
    │
    ├─ Catch block triggered
    │
    ├─ Determine error type:
    │
    ├─ Validation Error
    │  └─ Return 400 Bad Request
    │     └─ Include specific error message
    │
    ├─ Missing Token
    │  └─ Return 401 Unauthorized
    │     └─ "Authorization token missing"
    │
    ├─ Invalid Token
    │  └─ Return 403 Forbidden
    │     └─ "Invalid or expired token"
    │
    ├─ User Not Found
    │  └─ Return 404 Not Found
    │     └─ "User not found"
    │
    ├─ Email Already Exists
    │  └─ Return 409 Conflict
    │     └─ "Email already registered"
    │
    ├─ Database Error
    │  └─ Return 500 Internal Server Error
    │     └─ "An error occurred"
    │
    └─ Send response to client
       └─ Client handles error appropriately
```

---

## Key Security Features Summary

```
✓ JWT Signature Verification   - Ensures token wasn't modified
✓ Token Expiration             - Limits token lifetime
✓ HTTP-only Cookies            - Prevents XSS attacks
✓ Secure Flag                  - HTTPS only in production
✓ SameSite Cookies             - Prevents CSRF attacks
✓ Password Hashing             - bcrypt with salt rounds
✓ Middleware Protection        - Server-level route security
✓ Input Validation             - Zod schemas on inputs
✓ Bearer Token Support         - API flexibility
✓ Automatic Redirect           - Logout functionality
✓ Error Handling               - Safe error messages
✓ Database Isolation           - User data separation
```
