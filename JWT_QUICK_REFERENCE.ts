/**
 * QUICK REFERENCE - JWT Authentication API
 * 
 * Copy-paste these examples for quick integration
 */

// ============================================================================
// 1. LOGIN - Get access and refresh tokens
// ============================================================================

// Client-side with authFetch
import { authFetch, login } from '@/lib/clientAuth';

// Option A: Simple login function
const loginResult = await login('user@example.com', 'password');
if (loginResult.success) {
  console.log('Logged in as:', loginResult.user);
  // redirectTo('/dashboard');
}

// Option B: Using useAuth hook
import { useAuth } from '@/hooks/useAuthWithTokens';

function LoginComponent() {
  const { login, error, isLoading } = useAuth();
  
  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
    if (success) {
      // Navigate to dashboard
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}

// ============================================================================
// 2. PROTECTED API CALLS - Use access token automatically
// ============================================================================

// Option A: authFetch (recommended)
const response = await authFetch('/api/protected', {
  method: 'GET'
});

// Option B: Manual fetch with token
import { getAccessToken } from '@/lib/clientAuth';

const token = getAccessToken();
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// ============================================================================
// 3. CREATE PROTECTED ROUTES - Verify access token
// ============================================================================

// File: src/app/api/my-endpoint/route.ts
import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const payload = await verifyAccessToken(authHeader);
    
    // payload.userId now available
    const userId = payload.userId;

    return NextResponse.json({
      success: true,
      data: { userId }
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    
    if (msg === 'Access token expired') {
      return NextResponse.json(
        { success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// ============================================================================
// 4. LOGOUT - Clear tokens
// ============================================================================

import { logout } from '@/lib/clientAuth';

const result = await logout();
// User is now logged out, redirect to login page

// ============================================================================
// 5. MANUAL TOKEN REFRESH - For advanced cases
// ============================================================================

import { refreshToken } from '@/lib/clientAuth';

const result = await refreshToken();
if (result.success) {
  console.log('New token:', result.accessToken);
}

// ============================================================================
// 6. CHECK IF AUTHENTICATED - For conditionals
// ============================================================================

import { isAuthenticated, isTokenExpired, getAccessToken } from '@/lib/clientAuth';

// Check if user has access token
if (isAuthenticated()) {
  console.log('User is logged in');
}

// Check if token is about to expire (within 1 min)
if (isTokenExpired()) {
  // Refresh proactively
  await refreshToken();
}

// Get token for display/debugging (NOT for storage)
const token = getAccessToken();

// ============================================================================
// 7. PROTECTED COMPONENT - Redirect if not authenticated
// ============================================================================

import { ProtectedRoute, useAuth } from '@/hooks/useAuthWithTokens';

function AdminPanel() {
  const { user } = useAuth();
  return <div>Welcome {user?.name}</div>;
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  );
}

// ============================================================================
// 8. HANDLE TOKEN EXPIRY - Auto-refresh pattern
// ============================================================================

async function fetchWithAutoRefresh(url: string) {
  // authFetch handles this automatically!
  const response = await authFetch(url, { method: 'GET' });
  
  // If response is 401 and refresh succeeds, returns the retried response
  // If refresh fails, clears token and redirects to login
  return response;
}

// ============================================================================
// 9. DECODE TOKEN - For reading claims (no verification!)
// ============================================================================

import { decodeToken } from '@/lib/clientAuth';

const token = getAccessToken();
const payload = decodeToken(token!);
console.log('User ID from token:', payload?.userId); // For display only

// ============================================================================
// 10. ERROR HANDLING - Handle different auth errors
// ============================================================================

try {
  const response = await authFetch('/api/protected');

  if (response.status === 401) {
    const data = await response.json();
    
    if (data.code === 'TOKEN_EXPIRED') {
      console.log('Access token expired, was auto-refreshed');
    } else {
      console.log('User needs to login again');
      // Redirect to login
    }
  }
} catch (error) {
  console.error('Network error:', error);
}

// ============================================================================
// API ENDPOINTS REFERENCE
// ============================================================================

/*

POST /api/auth/login
├─ Body: { email, password }
└─ Response: { success, user, accessToken }
            Cookie: refreshToken (HTTP-only)

POST /api/auth/refresh
├─ Body: (empty)
├─ Cookie: refreshToken (automatic)
└─ Response: { success, accessToken, user }

POST /api/auth/logout
├─ Body: (empty)
├─ Cookie: refreshToken (automatic)
└─ Response: { success, message }

GET /api/protected
├─ Header: Authorization: Bearer <accessToken>
└─ Response: { success, data }

POST /api/protected
├─ Header: Authorization: Bearer <accessToken>
├─ Body: { name: "Project Name" }
└─ Response: { success, data }

*/

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/*
.env:
  JWT_SECRET="your-secure-secret-here"
  REFRESH_TOKEN_SECRET="your-secure-refresh-secret-here"

Generate secure values:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
*/

// ============================================================================
// COOKIE SETTINGS (Automatic)
// ============================================================================

/*
Refresh Token Cookie:
  - Name: refreshToken
  - HttpOnly: true (JavaScript cannot access)
  - Secure: true (HTTPS only in production)
  - SameSite: Strict (CSRF protection)
  - Max-Age: 7 days
  - Path: /

Access Token:
  - Sent in JSON response body
  - Stored in sessionStorage (not localStorage)
  - Sent in Authorization header
  - Expires: 15 minutes
*/

// ============================================================================
// COMMON PATTERNS
// ============================================================================

// Pattern 1: Login form with redirect
async function handleLoginFormSubmit(email: string, password: string) {
  const { login } = useAuth();
  const router = useRouter();
  
  const success = await login(email, password);
  if (success) router.push('/dashboard');
}

// Pattern 2: Fetch with error handling
async function getData() {
  const response = await authFetch('/api/data');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

// Pattern 3: Check auth on mount
useEffect(() => {
  if (!isAuthenticated()) {
    router.push('/login');
  }
}, []);

// Pattern 4: Preemptive token refresh
useEffect(() => {
  const interval = setInterval(() => {
    if (isTokenExpired()) {
      refreshToken();
    }
  }, 60000); // Check every minute
  
  return () => clearInterval(interval);
}, []);

// ============================================================================
// TESTING WITH CURL
// ============================================================================

/*

# 1. Login and save cookies
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  -c cookies.txt \
  | jq .

# 2. Use access token
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 3. Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt | jq .

# 4. Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt

*/

// ============================================================================
// SECURITY CHECKLIST
// ============================================================================

/*
✓ Never store access token in localStorage
✓ Never expose refresh token to frontend JavaScript
✓ Always use HTTPS in production
✓ Validate credentials on every request
✓ Refresh token is rotated on each use
✓ Access token expires in 15 minutes
✓ Refresh token expires in 7 days
✓ Logout clears refresh token
✓ SameSite=Strict prevents CSRF
✓ HTTP-only cookies prevent XSS
✓ No sensitive data in JWT payload
*/
