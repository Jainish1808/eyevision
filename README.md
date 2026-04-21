# Eyewear E-commerce - Production-Grade Security System

A complete, production-ready security implementation for a modern web application built with FastAPI (Python) and React (TypeScript/JavaScript).

## 🔒 Security Features

### Authentication & Authorization
- ✅ **JWT Token Management** - Short-lived access tokens (15 min), long-lived refresh tokens (7 days)
- ✅ **Token Rotation** - New refresh token issued on every use
- ✅ **Token Blacklist** - Redis-backed revocation system
- ✅ **Secure Logout** - Token blacklisting, session termination, state cleanup
- ✅ **HttpOnly Cookies** - Refresh tokens stored securely
- ✅ **Memory Storage** - Access tokens never in localStorage
- ✅ **OAuth2 Social Login** - Google, GitHub with PKCE
- ✅ **Multi-Factor Authentication** - TOTP (Google Authenticator compatible)
- ✅ **Role-Based Access Control** - Admin, Moderator, User, Guest roles
- ✅ **Session Management** - Redis-backed with fingerprinting

### Password Security
- ✅ **bcrypt Hashing** - Cost factor 12
- ✅ **Password Strength Validation** - 8+ chars, mixed case, numbers, symbols
- ✅ **Breach Detection** - HaveIBeenPwned API integration (k-anonymity)
- ✅ **Secure Reset Flow** - One-time tokens, 15-minute expiry
- ✅ **Token Revocation** - All tokens revoked on password change

### API Security
- ✅ **Rate Limiting** - Per-route limits (login: 5/min, register: 3/min)
- ✅ **CORS Configuration** - Explicit origin whitelist
- ✅ **CSRF Protection** - Double-submit cookie + X-Requested-With header
- ✅ **Input Validation** - Pydantic v2 with strict validation
- ✅ **SQL Injection Prevention** - Parameterized queries only
- ✅ **XSS Prevention** - Content-Security-Policy, React escaping

### Security Headers
- ✅ **Strict-Transport-Security** - Force HTTPS
- ✅ **X-Content-Type-Options** - Prevent MIME sniffing
- ✅ **X-Frame-Options** - Prevent clickjacking
- ✅ **Content-Security-Policy** - Restrict resource loading
- ✅ **Referrer-Policy** - Control referrer information

### Monitoring & Logging
- ✅ **Audit Logging** - All auth events, admin actions
- ✅ **Structured Logs** - JSON format with timestamp, user, IP, action
- ✅ **Append-Only** - Tamper-proof log storage

### Frontend Security
- ✅ **Protected Routes** - Authentication guards
- ✅ **Silent Token Refresh** - Automatic 401 handling
- ✅ **Auto-Logout on Idle** - 15-minute timeout with warning
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Custom Alerts** - Replace window.alert/confirm
- ✅ **Toast Notifications** - User feedback system

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Context │  │ Protected    │  │ Error        │     │
│  │ (Memory)     │  │ Routes       │  │ Boundary     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Axios Interceptor (Silent Token Refresh)         │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│  • SSL Termination  • Security Headers  • Rate Limiting     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ JWT          │  │ RBAC         │  │ Rate         │     │
│  │ Validation   │  │ Dependencies │  │ Limiting     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ CSRF         │  │ Security     │  │ Audit        │     │
│  │ Middleware   │  │ Headers      │  │ Logging      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
           ↓                    ↓                    ↓
    ┌──────────┐         ┌──────────┐         ┌──────────┐
    │ MongoDB  │         │  Redis   │         │   Logs   │
    │ (Data)   │         │(Sessions)│         │ (Audit)  │
    └──────────┘         └──────────┘         └──────────┘
```

## 📁 Project Structure

```
eyewears/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── security.py          # JWT, password hashing, breach check
│   │   │   ├── rbac.py              # Role-based access control
│   │   │   ├── audit.py             # Audit logging
│   │   │   ├── mfa.py               # Multi-factor authentication
│   │   │   ├── oauth.py             # OAuth2 implementation
│   │   │   ├── session.py           # Session management
│   │   │   ├── middleware.py        # Security middleware
│   │   │   ├── dependencies.py      # FastAPI dependencies
│   │   │   └── redis_manager.py     # Redis connection manager
│   │   ├── routes/
│   │   │   └── auth_secure.py       # Complete auth routes
│   │   └── schemas/
│   │       └── auth.py              # Pydantic validation schemas
│   ├── config.py                    # Configuration management
│   ├── main.py                      # FastAPI application
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment template
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   ├── ToastContext.jsx     # Toast notifications
│   │   │   └── AlertContext.jsx     # Alert/confirm dialogs
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx  # Route guards
│   │   │   └── ErrorBoundary.jsx    # Error handling
│   │   ├── hooks/
│   │   │   └── useIdleTimeout.js    # Auto-logout on idle
│   │   ├── services/
│   │   │   └── apiClient.js         # Axios with interceptors
│   │   └── pages/
│   │       └── ErrorPages.jsx       # 404, 401, 403 pages
│   ├── package.json
│   └── .env.example
├── security-docs/
│   └── README.md                    # Complete security documentation
├── SETUP.md                         # Setup and deployment guide
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Redis 7+
- MongoDB 6+

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Generate secrets
openssl rand -hex 32  # For JWT_SECRET
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"  # For ENCRYPTION_KEY

# Configure environment
cp .env.example .env
# Edit .env with your secrets

# Start Redis and MongoDB
docker run -d -p 6379:6379 redis:7-alpine
docker run -d -p 27017:27017 mongo:6

# Run backend
python main.py
```

Backend available at: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run frontend
npm run dev
```

Frontend available at: http://localhost:5173

## 📚 Documentation

- **[Security Documentation](security-docs/README.md)** - Complete security implementation details
- **[Setup Guide](SETUP.md)** - Detailed setup and deployment instructions
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when running)

## 🧪 Testing

### Manual Security Tests

```bash
# Test rate limiting
for i in {1..6}; do curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'; done

# Test password breach detection
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","phone":"+1234567890","password":"Password123!","confirm_password":"Password123!"}'

# Test token blacklist
# 1. Login and get token
# 2. Logout
# 3. Try using same token (should fail)
```

### Automated Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test

# Security audit
npm audit
pip-audit
```

## 🔐 Security Best Practices

### Never Do This
- ❌ Store tokens in localStorage
- ❌ Use wildcard CORS origins in production
- ❌ Commit `.env` files to git
- ❌ Use weak passwords
- ❌ Disable security features
- ❌ Expose internal errors in production
- ❌ Use deprecated crypto (MD5, SHA1)

### Always Do This
- ✅ Use HTTPS in production
- ✅ Generate strong secrets
- ✅ Enable all security headers
- ✅ Monitor audit logs
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use parameterized queries
- ✅ Enable MFA for sensitive accounts

## 📊 Performance

- **Token Validation**: < 1ms (Redis lookup)
- **Password Hashing**: ~100ms (bcrypt cost 12)
- **Rate Limiting**: < 1ms (Redis)
- **Session Lookup**: < 1ms (Redis)

## 🛡️ Security Compliance

This implementation follows:
- OWASP Top 10 recommendations
- NIST password guidelines
- OAuth 2.0 RFC 6749
- TOTP RFC 6238
- JWT RFC 7519

## 🐛 Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Email: security@yourdomain.com

We will respond within 24 hours.

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team Here]

## 🙏 Acknowledgments

- FastAPI for the excellent framework
- React team for the robust frontend library
- OWASP for security guidelines
- HaveIBeenPwned for breach detection API

---

**Built with security in mind. Every line of code reviewed for vulnerabilities.**
