# API Usage Examples

## Authentication Endpoints

### 1. Signup - Create New User

**Endpoint:** `POST /api/auth/signup`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Signup successful. Welcome email sent!",
  "userId": "user-uuid-here"
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Login - Get JWT Token

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2MDc0Mjk2MDIsImV4cCI6MTYwNzQzMzIwMn0.signature"
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid credentials"
}
```

**Response (Error - 404):**
```json
{
  "message": "User not found"
}
```

---

### 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Protected User Endpoints

### 4. Get All Users

**Endpoint:** `GET /api/users`

**Requires:** Valid JWT token in Authorization header or cookie

**Request (Bearer Token):**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Request (Cookie):**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid-1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-22T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2025-01-21T14:15:00Z"
    }
  ]
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Authorization token missing"
}
```

**Response (Error - 403):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 5. Get User by ID

**Endpoint:** `GET /api/users/:id`

**Requires:** Valid JWT token

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/uuid-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-22T10:30:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Protected Admin Endpoints

### 6. Admin Dashboard

**Endpoint:** `GET /api/admin`

**Requires:** Valid JWT token with admin role

**Request:**
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Frontend Integration Examples

### React/Next.js - Login

```typescript
import Cookies from "js-cookie";

async function handleLogin(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Token is automatically stored in HTTP-only cookie
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
}
```

### React/Next.js - Access Protected API

```typescript
async function fetchUsers() {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${Cookies.get("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.users;
    } else if (response.status === 401) {
      // Token expired or missing, redirect to login
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}
```

### React/Next.js - Logout

```typescript
import Cookies from "js-cookie";

async function handleLogout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      // Token is cleared from cookie on server
      Cookies.remove("token");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
```

---

## Error Handling Guide

| Status Code | Meaning | Action |
|------------|---------|--------|
| 200 | Success | Process response normally |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request format and required fields |
| 401 | Unauthorized | Token missing or invalid - redirect to login |
| 403 | Forbidden | Token expired or insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already exists (signup) |
| 500 | Server Error | Retry or contact support |

---

## Security Best Practices

1. **Never expose JWT tokens in logs or errors**
2. **Always use HTTPS in production**
3. **Keep JWT_SECRET secure and unique**
4. **Validate all inputs on both client and server**
5. **Use HTTP-only cookies for tokens**
6. **Implement rate limiting on auth endpoints**
7. **Log failed authentication attempts**
8. **Implement refresh token rotation**
9. **Clear tokens on logout**
10. **Use CORS properly to prevent unauthorized access**

---

## Token Structure

**JWT Token Format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InV1aWQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MDc0Mjk2MDIsImV4cCI6MTYwNzQzMzIwMn0.signature
```

**Decoded Payload:**
```json
{
  "id": "user-uuid-123",
  "email": "user@example.com",
  "iat": 1607429602,
  "exp": 1607433202
}
```

- `iat`: Issued at (timestamp)
- `exp`: Expiration time (1 hour from issue)

---

## Testing with Postman

1. Create a new collection called "Pirates Connect"
2. Add requests for each endpoint
3. Set up environment variables:
   - `base_url` = http://localhost:3000
   - `token` = (set after login)

4. In login request, add a test script to capture token:
```javascript
if (pm.response.code === 200) {
  pm.environment.set("token", pm.response.json().token);
}
```

5. Use `{{token}}` in Authorization headers for protected routes

---

## Common Issues & Solutions

### "Invalid or expired token"
- Check if token is still within 1-hour window
- Verify JWT_SECRET matches between login and middleware
- Ensure token hasn't been modified

### "Authorization token missing"
- Include Authorization header with Bearer scheme
- Or ensure token cookie is being sent with request
- Check if cookies are enabled in browser

### "Email already registered"
- Use a different email for signup
- Or login with existing credentials

### CORS errors
- Add proper CORS headers to API routes
- Ensure credentials are sent with requests
- Check allowed origins

