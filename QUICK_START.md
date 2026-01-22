# Quick Start Guide - Pirates Connect

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies
```bash
cd S75-0126-Pirates-Full-Stack-With-NextjsAnd-AWS-Azure-ConnectED
npm install
```

### Step 2: Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pirates_connect

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_SENDER=noreply@piratesconnect.com

# Development
NODE_ENV=development
```

### Step 3: Setup Database
```bash
# Run migrations
npx prisma migrate dev

# Seed data (optional)
npx prisma db seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🧪 Testing the Authentication System

### Test 1: Signup New User
1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm: `password123`
3. Click "Sign Up"
4. ✓ You should be redirected to login after 2 seconds

### Test 2: Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Login"
4. ✓ You should see the dashboard with your user info

### Test 3: Protected Routes
1. While logged in, visit:
   - `http://localhost:3000/dashboard` ✓ Works
   - `http://localhost:3000/users` ✓ Works
   - `http://localhost:3000/users/1` ✓ Works (if user exists)

2. Open browser DevTools → Application → Cookies
3. ✓ You should see a `token` cookie with your JWT

### Test 4: Logout & Re-Login Required
1. On the dashboard, click "Logout"
2. ✓ You're redirected to `/login`
3. Try accessing `/dashboard` directly
4. ✓ You're automatically redirected to `/login`

### Test 5: Token Validation
1. Open DevTools → Console
2. Run:
   ```javascript
   // View your token
   document.cookie

   // Remove the token (simulate expiration)
   document.cookie = "token=; max-age=0";
   ```
3. Refresh the page
4. ✓ You're redirected to login

---

## 📁 Key Files Overview

| File | Purpose |
|------|---------|
| `src/app/middleware.ts` | JWT validation & route protection |
| `src/app/login/page.tsx` | Login form with JWT integration |
| `src/app/signup/page.tsx` | User registration form |
| `src/app/dashboard/page.tsx` | Protected user dashboard |
| `src/app/users/page.tsx` | Protected users list |
| `src/app/api/auth/login/route.ts` | Login API endpoint |
| `src/app/api/auth/signup/route.ts` | Signup API endpoint |
| `src/app/api/auth/logout/route.ts` | Logout API endpoint |
| `src/app/lib/useAuth.ts` | Client-side auth hook |
| `src/app/layout.tsx` | Main layout with navigation |

---

## 🔐 Security Checklist

- [x] JWT tokens generated on login
- [x] Passwords hashed with bcrypt
- [x] Tokens stored in HTTP-only cookies
- [x] Middleware validates tokens on protected routes
- [x] Tokens expire after 1 hour
- [x] Cookies cleared on logout
- [x] CSRF protection (SameSite cookies)
- [x] XSS protection (HTTP-only cookies)
- [x] Input validation on signup/login
- [x] Error messages don't expose sensitive info

---

## 🎨 UI Features Implemented

- ✅ Modern gradient backgrounds
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation and error messages
- ✅ Loading states with spinners
- ✅ Success/error notifications
- ✅ Professional card-based layouts
- ✅ Smooth transitions and hover effects
- ✅ Accessible forms and buttons
- ✅ Empty state handling
- ✅ 404 error page with suggestions

---

## 📊 Project Structure

```
Root/
├── src/
│   └── app/
│       ├── (public pages)        login/, signup/, page.tsx
│       ├── (protected pages)     dashboard/, users/
│       ├── (api endpoints)       api/auth/*, api/users/*
│       ├── middleware.ts         JWT validation
│       └── layout.tsx            Navigation & wrapper
├── prisma/
│   ├── schema.prisma             Database schema
│   └── migrations/               Database changes
├── AUTHENTICATION.md             Auth system docs
├── API_USAGE.md                  API examples
├── ARCHITECTURE.md               System diagrams
├── IMPLEMENTATION_SUMMARY.md     What was built
└── package.json                  Dependencies
```

---

## 🔍 What's Protected?

### Protected Pages (require login)
- `/dashboard` - User dashboard
- `/users` - Users directory
- `/users/[id]` - User profiles

### Public Pages (no login required)
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page

### Protected API Routes (require JWT)
- `GET /api/users` - List all users
- `GET /api/users/[id]` - Get user by ID
- `GET /api/admin/*` - Admin endpoints

### Public API Routes (no JWT required)
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup
- `POST /api/auth/logout` - Logout

---

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### JWT_SECRET not recognized
```bash
# Make sure .env.local exists in root directory
# Restart dev server after updating .env.local
```

### Database connection failed
```bash
# Check DATABASE_URL is correct
# Ensure PostgreSQL is running
# Check credentials are valid
```

### Token not persisting
```bash
# Check if cookies are enabled in browser
# Check DevTools → Application → Cookies
# Verify token is being set
```

### Can't access /dashboard
```bash
# Check if you're logged in (has token cookie)
# Try logging out and back in
# Check middleware.ts matches your routes
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Update `SENDGRID_API_KEY` with production key
- [ ] Run database migrations on production DB
- [ ] Set up environment variables on hosting platform
- [ ] Test login/logout on production
- [ ] Set up monitoring and error logging
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up automated backups for database
- [ ] Review security headers
- [ ] Enable CORS if needed

---

## 📚 Documentation Files

1. **AUTHENTICATION.md** - Complete auth system explanation
2. **API_USAGE.md** - API endpoints with examples
3. **ARCHITECTURE.md** - System diagrams and flows
4. **IMPLEMENTATION_SUMMARY.md** - What was built and why
5. **QUICK_START.md** - This file!

---

## 💡 Next Steps

### To add more features:

1. **Password Reset**
   - Create `/api/auth/forgot-password`
   - Send reset link via email
   - Create `/reset-password/[token]` page

2. **Role-Based Access Control (RBAC)**
   - Add `role` field to User model
   - Check role in middleware
   - Restrict routes by role

3. **Two-Factor Authentication (2FA)**
   - Generate OTP on login
   - Send via SMS or email
   - Verify OTP before granting access

4. **OAuth Integration**
   - Add Google/GitHub login
   - Use NextAuth.js or similar
   - Simplify authentication

5. **Refresh Tokens**
   - Issue refresh token alongside JWT
   - Extend session without re-login
   - Implement token rotation

6. **User Profile Management**
   - Edit profile page
   - Update password
   - Profile picture upload

---

## 🆘 Support

### Common Questions

**Q: How long is the JWT token valid?**
A: 1 hour from creation. After that, you need to login again.

**Q: Is my password stored securely?**
A: Yes! Passwords are hashed with bcrypt (10 salt rounds) and never stored in plain text.

**Q: Can someone steal my JWT token?**
A: The token is stored in an HTTP-only cookie, so JavaScript can't access it (prevents XSS). The Secure flag ensures it's only sent over HTTPS (prevents man-in-the-middle).

**Q: What happens if I lose my password?**
A: Currently, there's no password reset. This feature can be added by creating `/api/auth/forgot-password`.

**Q: Can I login from multiple devices?**
A: Yes! Each login generates a new token. Currently, tokens aren't shared between devices, so each device needs to login separately.

**Q: How do I know if my token is valid?**
A: The middleware automatically validates it on each request. If invalid, you're redirected to login.

---

## ✨ What You Have Now

✅ Complete JWT authentication system
✅ Secure password hashing
✅ Protected routes with middleware
✅ Beautiful UI with responsive design
✅ Database integration with Prisma
✅ Email notifications with SendGrid
✅ Error handling and validation
✅ Logout functionality
✅ User management pages
✅ Full documentation

---

## 🎯 Remember

- Always use HTTPS in production
- Keep JWT_SECRET secure
- Never commit `.env.local` to git
- Test thoroughly before deploying
- Monitor authentication failures
- Keep dependencies updated
- Back up your database regularly

Happy coding! 🚀
