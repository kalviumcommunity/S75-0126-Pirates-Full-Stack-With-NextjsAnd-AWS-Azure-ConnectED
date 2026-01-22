# Authentication Implementation Guide

## Overview
This project implements JWT-based authentication with Next.js middleware protection. The system uses secure HTTP-only cookies to store JWT tokens and protects both page routes and API endpoints.

## Authentication Flow

### 1. **Signup** → POST `/api/auth/signup`
- User provides: name, email, password
- Password is hashed using bcrypt (10 salt rounds)
- User is created in the database
- Welcome email is sent via SendGrid

### 2. **Login** → POST `/api/auth/login`
- User provides: email, password
- System finds user by email
- Password is verified against hashed password
- JWT token is generated with:
  - `user.id` and `user.email` in payload
  - 1 hour expiration time
  - Secret from `JWT_SECRET` environment variable
- Token is returned to client

### 3. **Client Storage**
- Token is stored in HTTP-only cookie with:
  - `secure: true` (HTTPS only in production)
  - `sameSite: "strict"` (CSRF protection)
  - `maxAge: 3600` (1 hour expiration)

### 4. **Middleware Protection**
Located in `src/app/middleware.ts`

#### Protected Pages (Page Routes):
- `/dashboard` - User dashboard
- `/users` - Users directory
- `/users/[id]` - User profile

#### Protected API Routes:
- `/api/admin/*` - Admin endpoints
- `/api/users/*` - User endpoints

#### Protection Logic:
1. Checks if token exists in cookies
2. Verifies token signature using `JWT_SECRET`
3. Checks token expiration
4. Allows or denies request based on validation

### 5. **Logout** → POST `/api/auth/logout`
- Clears the token cookie
- User is redirected to login page

## Configuration

### Environment Variables Required:
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=your-database-connection-string
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_SENDER=noreply@example.com
```

## File Structure

```
src/app/
├── middleware.ts                 # JWT validation middleware
├── layout.tsx                    # Main layout with navigation
├── page.tsx                      # Home page
├── login/
│   └── page.tsx                 # Login page (public)
├── signup/
│   └── page.tsx                 # Signup page (public)
├── dashboard/
│   └── page.tsx                 # Dashboard (protected)
├── users/
│   ├── page.tsx                 # Users list (protected)
│   └── [id]/
│       └── page.tsx             # User detail (protected)
├── api/
│   ├── auth/
│   │   ├── login/route.ts       # Login endpoint
│   │   ├── signup/route.ts      # Signup endpoint
│   │   └── logout/route.ts      # Logout endpoint
│   ├── users/
│   │   ├── route.ts             # Get all users (protected)
│   │   └── [id]/route.ts        # Get user by ID (protected)
│   └── admin/
│       └── route.ts             # Admin endpoints (protected)
└── lib/
    └── useAuth.ts               # Auth hook for client-side
```

## Usage Examples

### On Frontend - Login
```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
// Token is automatically stored in HTTP-only cookie
// Redirect to dashboard
```

### On Frontend - Access Protected Route
```typescript
const token = Cookies.get("token");
// Token is automatically sent in subsequent requests
// Middleware validates it
```

### On Backend - Verify Protected API
```typescript
// Middleware checks Authorization header or cookie
// If valid, request proceeds
// If invalid, returns 401/403 error
```

## Security Features

✅ **JWT Signature Verification** - Tokens are cryptographically signed
✅ **Token Expiration** - Tokens expire after 1 hour
✅ **HTTP-only Cookies** - XSS protection
✅ **Secure Flag** - HTTPS only in production
✅ **SameSite** - CSRF protection
✅ **Password Hashing** - bcrypt with 10 salt rounds
✅ **Middleware Protection** - Routes protected at server level
✅ **Bearer Token Support** - API endpoints accept Bearer tokens

## Testing the Implementation

### 1. Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/users
```

## Token Structure

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## Troubleshooting

### "Invalid or expired token" Error
- Check if `JWT_SECRET` environment variable is set
- Verify token hasn't expired (1 hour from creation)
- Ensure token wasn't modified

### User redirected to login unexpectedly
- Check if cookie is being set correctly
- Verify middleware matcher includes the route
- Check if token is valid

### CORS issues
- Add necessary CORS headers to API routes
- Ensure credentials are sent with requests

## Next Steps

1. Add refresh token functionality
2. Implement role-based access control (RBAC)
3. Add 2FA (Two-Factor Authentication)
4. Implement password reset functionality
5. Add OAuth provider integration
6. Set up audit logging
7. Implement rate limiting on auth endpoints
