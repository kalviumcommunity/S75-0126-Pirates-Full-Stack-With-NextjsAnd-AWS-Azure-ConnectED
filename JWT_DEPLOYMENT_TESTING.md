/**
 * DEPLOYMENT & TESTING GUIDE
 * File: JWT_DEPLOYMENT_TESTING.md
 * 
 * Complete guide for testing and deploying the JWT authentication system
 */

# JWT Authentication - Deployment & Testing Guide

## 🧪 Local Testing Guide

### 1. Setup Environment
```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# Server running on http://localhost:3000
```

### 2. Test with cURL

#### Test Login
```bash
# Save response with cookies
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }' \
  -c cookies.txt \
  -w "\n%{http_code}\n"

# Expected: 200 OK with accessToken in body
```

#### Test Protected Route
```bash
# Get the accessToken from login response and use it
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -w "\n%{http_code}\n"

# Expected: 200 OK with user data
```

#### Test Token Refresh
```bash
# Use cookies saved from login
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -w "\n%{http_code}\n"

# Expected: 200 OK with new accessToken
```

#### Test Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt \
  -w "\n%{http_code}\n"

# Expected: 200 OK, refreshToken cookie cleared
```

#### Test Expired Token
```bash
# Wait for token to expire (15 minutes) or manually test
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer expired_token_here" \
  -w "\n%{http_code}\n"

# Expected: 401 Unauthorized with code: TOKEN_EXPIRED
```

### 3. Test with Postman

#### Create Collection
1. **New Collection**: "JWT Auth Testing"

#### Test Endpoints

**1. Login**
```
POST http://localhost:3000/api/auth/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "user@example.com",
  "password": "password"
}

Expected: 200 OK
Response:
{
  "success": true,
  "accessToken": "...",
  "user": {...}
}

✓ Automatically saves refreshToken cookie
```

**2. Protected Route**
```
GET http://localhost:3000/api/protected
Headers:
  Authorization: Bearer {{accessToken}}

Expected: 200 OK
Response:
{
  "success": true,
  "data": { "user": {...} }
}
```

**3. Refresh Token**
```
POST http://localhost:3000/api/auth/refresh
Headers: (none, cookies automatic)

Expected: 200 OK
Response:
{
  "success": true,
  "accessToken": "...",
  "user": {...}
}

✓ Cookie automatically updated
```

**4. Logout**
```
POST http://localhost:3000/api/auth/logout
Headers: (none needed)

Expected: 200 OK
Response:
{
  "success": true,
  "message": "Logged out successfully"
}

✓ Cookie cleared
```

### 4. Test Client Implementation

#### Test Login Component
```typescript
// Test with your login page
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  }),
  credentials: 'include' // Important!
});

const data = await response.json();
console.log('Login response:', data);
console.log('Access Token:', data.accessToken);
```

#### Test Protected Route Call
```typescript
// Using authFetch
const response = await authFetch('/api/protected', {
  method: 'GET'
});

if (response.ok) {
  const data = await response.json();
  console.log('Protected data:', data);
} else if (response.status === 401) {
  console.log('Token expired or invalid');
}
```

#### Test useAuth Hook
```typescript
function TestComponent() {
  const { user, isLoading, login, logout } = useAuth();

  const testLogin = async () => {
    const success = await login('user@example.com', 'password');
    console.log('Login success:', success);
    console.log('User:', user);
  };

  return (
    <div>
      <button onClick={testLogin}>Test Login</button>
      {user && <p>Logged in as: {user.name}</p>}
    </div>
  );
}
```

---

## 🚀 Deployment Guide

### Prerequisites
- [ ] Generate new JWT secrets (not the defaults)
- [ ] Set NODE_ENV=production
- [ ] Ensure HTTPS is enabled
- [ ] Update database connection string
- [ ] Configure CORS if needed

### 1. Generate Production Secrets

```bash
# Terminal 1
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Terminal 2
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Copy to .env.production
```

### 2. Environment Configuration

**.env.production**:
```env
# Database
DATABASE_URL="your_production_database_url"

# JWT Secrets (CRITICAL: Use generated values)
JWT_SECRET="your_generated_secret_here"
REFRESH_TOKEN_SECRET="your_generated_refresh_secret_here"

# Node Environment
NODE_ENV="production"

# Other services
SENDGRID_API_KEY="your_sendgrid_key"
AWS_ACCESS_KEY_ID="your_aws_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret"
```

### 3. Deployment Platforms

#### Vercel
```bash
# Push code
git push origin main

# Vercel auto-deploys
# Environment variables → Project Settings → Environment Variables
# Add: JWT_SECRET, REFRESH_TOKEN_SECRET
```

#### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t jwt-auth-app .

# Run container
docker run -e JWT_SECRET="..." -e REFRESH_TOKEN_SECRET="..." -p 3000:3000 jwt-auth-app
```

#### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Clone repository
git clone https://github.com/your/repo.git
cd repo

# Install dependencies
npm install

# Create .env
echo "JWT_SECRET=..." > .env
echo "REFRESH_TOKEN_SECRET=..." >> .env
# ... add other variables

# Build and start
npm run build
npm start
```

### 4. HTTPS/SSL Setup

#### Using Let's Encrypt
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx config to use certificate
sudo certbot renew --dry-run
```

#### Verify HTTPS Headers
```bash
curl -I https://yourdomain.com/api/auth/login

# Look for:
# Set-Cookie: refreshToken=...; Secure
# (Should have "Secure" flag)
```

### 5. Database Migration

```bash
# Run migrations in production
npx prisma migrate deploy

# Verify schema
npx prisma db push --skip-generate
```

### 6. Health Check

```bash
# Test login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Test protected route (use token from above)
curl https://yourdomain.com/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔒 Security Checklist Before Deployment

```
├─ [ ] JWT_SECRET and REFRESH_TOKEN_SECRET are unique and secure
├─ [ ] NODE_ENV=production in deployment environment
├─ [ ] HTTPS/SSL certificate installed and valid
├─ [ ] Database backups configured
├─ [ ] CORS properly configured (if cross-origin)
├─ [ ] Rate limiting configured on auth endpoints
├─ [ ] Logging/monitoring enabled for auth events
├─ [ ] Error messages don't leak sensitive info
├─ [ ] Cookies have Secure flag in production
├─ [ ] SameSite=Strict enforced
├─ [ ] HTTP-only flag on refresh token cookie
├─ [ ] Session timeout implemented
├─ [ ] Token blacklist (optional but recommended)
├─ [ ] HTTPS redirect configured
├─ [ ] Security headers configured (HSTS, CSP, etc.)
├─ [ ] Secrets manager integrated (AWS Secrets Manager, etc.)
├─ [ ] Audit logging enabled
├─ [ ] DDoS protection enabled
├─ [ ] WAF (Web Application Firewall) rules configured
└─ [ ] Regular security audits scheduled
```

---

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test login endpoint (1000 requests, 100 concurrent)
ab -n 1000 -c 100 -p login.json -T application/json \
  http://localhost:3000/api/auth/login

# Results should show:
# - Response time < 200ms average
# - Requests per second > 50
# - No failed requests
```

### Test Script
```bash
#!/bin/bash

# load-test.sh

echo "Testing token generation..."
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:3000/api/auth/login

echo "Testing refresh endpoint..."
ab -n 100 -c 10 \
  http://localhost:3000/api/auth/refresh

echo "Testing protected routes..."
ab -n 100 -c 10 \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/protected
```

### Metrics to Monitor

```
Authentication Metrics:
├─ Login success rate (target: >99%)
├─ Token refresh latency (target: <50ms)
├─ Protected route response time (target: <100ms)
├─ Concurrent users support (target: 1000+)
└─ 401 error rate (monitor for spikes)

System Metrics:
├─ CPU usage during auth peaks
├─ Memory usage for token storage
├─ Database query times for user lookup
└─ Token verification latency
```

---

## 🐛 Debugging

### Common Issues & Solutions

#### Issue: "Cookies not being set"
```bash
# Check 1: Verify credentials: 'include' in fetch
fetch('/api/login', {
  credentials: 'include' // Required!
})

# Check 2: Ensure same domain
// Client: http://localhost:3000
// API: http://localhost:3000 ✓

// Client: https://app.example.com
// API: https://api.example.com ✗ (needs CORS)

# Check 3: Check browser settings
// Developer Tools → Application → Cookies
// Should see refreshToken cookie
```

#### Issue: "401 Unauthorized always returned"
```bash
# Check 1: Verify token format
Authorization: Bearer <token> # Correct (note space)
Authorization: <token>        # Wrong (missing "Bearer ")

# Check 2: Check token expiry
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' | jq .accessToken

# Use immediately (before expiry)

# Check 3: Verify JWT secrets match
# Login uses JWT_SECRET
# Verify uses same JWT_SECRET
```

#### Issue: "CORS errors with cookies"
```javascript
// Correct setup:
fetch('https://api.example.com/api/protected', {
  method: 'GET',
  credentials: 'include', // Important!
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Server needs:
res.headers['Access-Control-Allow-Credentials'] = 'true';
res.headers['Access-Control-Allow-Origin'] = 'https://app.example.com';
```

### Enable Debug Logging

```typescript
// src/lib/auth.ts - Add debug logging
export async function verifyAccessToken(authHeader: string | null) {
  console.log('[DEBUG] Verifying token, header:', authHeader?.slice(0, 20));
  
  if (!authHeader) {
    console.log('[DEBUG] No authorization header');
    throw new Error('Missing or invalid Authorization header');
  }
  
  try {
    const verified = await jwtVerify(token, getAccessTokenSecret());
    console.log('[DEBUG] Token verified, userId:', verified.payload.userId);
    return verified.payload;
  } catch (error) {
    console.log('[DEBUG] Token verification failed:', error.message);
    throw error;
  }
}
```

---

## 📈 Monitoring & Alerts

### Log Authentication Events

```typescript
// src/lib/authLogger.ts
export async function logAuthEvent(
  type: 'LOGIN' | 'LOGOUT' | 'REFRESH' | 'FAILURE',
  userId?: number,
  details?: any
) {
  const event = {
    timestamp: new Date(),
    type,
    userId,
    details,
    ipAddress: getClientIP(),
    userAgent: getUserAgent()
  };

  // Save to database or logging service
  console.log('[AUTH EVENT]', JSON.stringify(event));
}
```

### Setup Alerts

```
Alert Conditions:
├─ 10+ login failures in 5 minutes (brute force)
├─ 100+ 401 errors in 1 minute (invalid tokens)
├─ Unusual IP accessing account
├─ Token refresh failure spike
└─ Database connection errors
```

---

## ✅ Pre-Launch Checklist

```
CODE QUALITY:
├─ [ ] All TypeScript types correct
├─ [ ] No console.log in production code
├─ [ ] Error handling complete
├─ [ ] No hardcoded secrets
└─ [ ] Code reviewed

SECURITY:
├─ [ ] Secrets generated and unique
├─ [ ] HTTPS enabled
├─ [ ] CORS configured correctly
├─ [ ] Rate limiting implemented
├─ [ ] Logging enabled
└─ [ ] Security headers set

TESTING:
├─ [ ] Login works end-to-end
├─ [ ] Token refresh works
├─ [ ] Protected routes accessible
├─ [ ] Logout clears tokens
├─ [ ] 401 handling works
└─ [ ] Load testing passed

DEPLOYMENT:
├─ [ ] Database migrations run
├─ [ ] Environment variables set
├─ [ ] Health checks passing
├─ [ ] Monitoring setup
├─ [ ] Backup strategy ready
└─ [ ] Rollback plan documented
```

---

## 📞 Support & Monitoring

### Setup Monitoring

```bash
# Option 1: Datadog
npm install @datadog/browser-rum

# Option 2: Sentry
npm install @sentry/nextjs

# Option 3: Custom logging
# Implement logAuthEvent() shown above
```

### Test Monitoring

```bash
# Generate auth traffic
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"wrong"}' &
done
wait

# Check logs for spike in failures
```

---

## 🎓 Additional Resources

- JWT_AUTH_SUMMARY.md - Complete guide
- AUTH_IMPLEMENTATION.md - Architecture details
- JWT_QUICK_REFERENCE.ts - Code examples
- JWT_VISUAL_GUIDE.md - Diagrams and flows
- src/types/auth.ts - TypeScript definitions

---

**Status**: Deployment Ready ✅
**Last Updated**: January 27, 2026
