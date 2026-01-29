# JWT Authentication Implementation Guide

## Overview

This project implements a **dual-token JWT authentication system** with the following architecture:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookies, used to get new access tokens

## Architecture

### Token Flow

```
1. LOGIN
   ├─ User submits email + password
   ├─ Server validates credentials
   ├─ Issues Access Token (15m) → returned in JSON response
   ├─ Issues Refresh Token (7d) → stored in HTTP-only cookie
   └─ Client stores Access Token in memory

2. API REQUEST (with Access Token)
   ├─ Client sends: Authorization: Bearer <accessToken>
   ├─ Server verifies token
   ├─ Returns protected data

3. TOKEN EXPIRY
   ├─ Client receives 401 (Access Token expired)
   ├─ Client calls /api/auth/refresh
   ├─ Server reads Refresh Token from cookie (automatic)
   ├─ Server issues new Access Token
   └─ Client retries original request

4. LOGOUT
   ├─ Client calls /api/auth/logout
   ├─ Server clears Refresh Token cookie
   ├─ Client discards Access Token from memory
```

## Files Created/Modified

### 1. Environment Variables
**File**: `.env`

```env
JWT_SECRET="your-secure-jwt-secret-min-32-chars"
REFRESH_TOKEN_SECRET="your-secure-refresh-token-secret-min-32-chars"
```

**⚠️ IMPORTANT**: Replace with cryptographically secure secrets in production. Generate using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Auth Helper
**File**: `src/lib/auth.ts`

Functions for token verification:
- `verifyAccessToken(authHeader)` - Validates access token from Authorization header
- `verifyRefreshToken()` - Validates refresh token from cookies
- Handles token expiry with proper error messages

### 3. Login Route
**File**: `src/app/api/auth/login/route.ts`

**Request**:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookie Set Automatically**:
```
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/
```

### 4. Refresh Token Route
**File**: `src/app/api/auth/refresh/route.ts`

**Request**:
```
POST /api/auth/refresh
(Refresh token sent automatically in cookies)
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Tokens refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Features**:
- ✅ Validates refresh token
- ✅ Checks if user still exists
- ✅ Rotates refresh token (issues new one with fresh expiry)
- ✅ Returns new access token

### 5. Logout Route
**File**: `src/app/api/auth/logout/route.ts`

**Request**:
```
POST /api/auth/logout
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Side Effect**: Clears refresh token cookie

### 6. Protected Route Example
**File**: `src/app/api/protected/route.ts`

**GET - Fetch User Data**:
```
GET /api/protected
Authorization: Bearer <accessToken>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Protected data accessed successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2026-01-27T10:00:00Z"
    },
    "timestamp": "2026-01-27T10:05:00Z"
  }
}
```

**POST - Create Protected Resource**:
```
POST /api/protected
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "New Project"
}
```

**Error Responses**:
- `401 Unauthorized` - Missing or invalid token
- `401 TOKEN_EXPIRED` - Access token expired (client should call /api/auth/refresh)
- `404 Not Found` - User not found
- `500 Internal Error` - Server error

## Client Implementation Example

### React Hook - useAuthFetcher

```typescript
// src/hooks/useAuthFetcher.ts
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthFetcher() {
  const router = useRouter();

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    const accessToken = sessionStorage.getItem('accessToken');

    // Add Authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    } as HeadersInit;

    let response = await fetch(url, { ...options, headers });

    // If 401, try to refresh token
    if (response.status === 401) {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
      });

      if (refreshResponse.ok) {
        const { accessToken: newToken } = await refreshResponse.json();
        sessionStorage.setItem('accessToken', newToken);

        // Retry with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        // Refresh failed - redirect to login
        router.push('/login');
        throw new Error('Session expired');
      }
    }

    return response;
  }, [router]);

  return { fetchWithAuth };
}
```

### Login Component Example

```typescript
// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Important: includes cookies
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      
      // Store access token in memory (sessionStorage or context)
      sessionStorage.setItem('accessToken', accessToken);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Security Features

### ✅ Access Token
- **Short-lived**: 15 minutes
- **Stateless**: No server-side storage needed
- **Secure transmission**: Returned in JSON (client stores in memory)
- **Minimal payload**: Only contains `userId`
- **Signature verification**: Signed with `JWT_SECRET`

### ✅ Refresh Token
- **Long-lived**: 7 days
- **HttpOnly Cookie**: Cannot be accessed by JavaScript (prevents XSS attacks)
- **Secure flag**: HTTPS-only in production
- **SameSite=Strict**: Prevents CSRF attacks
- **Automatic rotation**: New refresh token issued on each refresh endpoint call
- **Server-side validation**: User existence verified before issuing new token

### ✅ Logout
- **Cookie clearing**: Refresh token cookie is deleted
- **Stateless design**: Access token remains valid until natural expiry
- **Grace period**: 15-minute window (access token lifetime) where token remains valid
  - Optional: Implement token blacklist for immediate revocation

### ✅ Error Handling
- **401 Unauthorized**: Invalid/missing token
- **401 TOKEN_EXPIRED**: Access token expired (client should refresh)
- **401 Refresh error**: Refresh token invalid/expired (user must re-login)
- **Clear error messages**: Client knows what action to take

## Best Practices Implemented

| Practice | Implementation |
|----------|-----------------|
| **No localStorage** | Access token stored in memory, refresh in HTTP-only cookie |
| **HTTP-only cookies** | Refresh token cannot be stolen via XSS |
| **CSRF protection** | SameSite=Strict prevents CSRF |
| **Short access token** | 15-minute expiry limits exposure window |
| **Long refresh token** | 7-day expiry provides better UX |
| **Token rotation** | Refresh token rotated on each refresh call |
| **User validation** | Refresh endpoint verifies user still exists |
| **Minimal payload** | Only userId in token, no sensitive data |
| **Clear separation** | Access token in body, refresh token in cookie |
| **Error differentiation** | Client knows whether to retry or re-login |

## Token Expiry Handling Flowchart

```
User makes API request with Access Token
         ↓
    Is token valid?
         ↙ ↘
       NO   YES → Success (200)
       ↓
  Is it expired?
     ↙ ↘
   NO   YES
   ↓     ↓
 401   Call /api/auth/refresh
       ↓
   Is Refresh Token valid?
     ↙ ↘
   YES   NO
   ↓     ↓
  Issue  Redirect
  new    to
  AT*   login
   ↓
  Retry original request
   ↓
  Success (200)

*AT = Access Token
```

## Production Checklist

- [ ] Replace `JWT_SECRET` and `REFRESH_TOKEN_SECRET` with cryptographically secure values
- [ ] Set `NODE_ENV=production` to enable `secure` flag on cookies
- [ ] Use HTTPS in production
- [ ] Consider adding token blacklist for immediate logout
- [ ] Add rate limiting to `/api/auth/login` and `/api/auth/refresh`
- [ ] Monitor token refresh frequency (sign of malicious activity)
- [ ] Add database indexes on user lookup queries
- [ ] Implement request signing/encryption for sensitive data
- [ ] Add audit logging for auth events
- [ ] Rotate secrets periodically

## Testing

### Manual Testing with curl

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt

# 2. Use access token for protected route
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Refresh token (uses cookies)
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt

# 4. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Refresh token not found"** | Ensure `credentials: 'include'` in fetch options and cookies are enabled |
| **Access token not working** | Check `Authorization: Bearer <token>` format (space is important) |
| **Cookies not setting** | Verify `NODE_ENV` and HTTPS in production, check domain/path settings |
| **CORS errors with cookies** | Include `credentials: 'include'` in client fetch and set proper CORS headers |
| **Token always expired** | Check server clock sync, verify `expiresIn` values match expectations |

## Related Files

- Signup route: `src/app/api/auth/signup/route.ts`
- Prisma schema: `prisma/schema.prisma`
- Middleware (optional): `src/app/middleware.ts`

