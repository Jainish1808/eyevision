# Security Implementation Documentation

## Overview
This document explains every security decision and implementation in the eyewear e-commerce application. The system implements defense-in-depth with multiple security layers working together.

---

## 1. JWT Token Management

### Implementation
- **Access Tokens**: 15-minute lifetime, stored in React memory (useRef)
- **Refresh Tokens**: 7-day lifetime, stored in HttpOnly Secure cookies
- **Token Rotation**: New refresh token issued on every use
- **Blacklist**: Redis-backed JWT blacklist using JTI claims

### Security Rationale
- **Short-lived access tokens** minimize damage if compromised
- **Memory storage** prevents XSS attacks (tokens never in localStorage)
- **HttpOnly cookies** prevent JavaScript access to refresh tokens
- **Token rotation** limits refresh token reuse window
- **JTI blacklist** enables immediate revocation on logout/password change

### Files
- Backend: `app/core/security.py` (token creation/validation)
- Frontend: `context/AuthContext.jsx` (token management)
- Interceptor: `services/apiClient.js` (automatic refresh)

---

## 2. Server-Side Sessions

### Implementation
- **Redis-backed sessions** with cryptographically random IDs
- **Session fingerprinting**: User-agent + IP binding
- **Idle timeout**: 1 hour of inactivity
- **Absolute timeout**: 24 hours maximum
- **Anomaly detection**: Fingerprint mismatch triggers logout

### Security Rationale
- **Fingerprinting** detects session hijacking attempts
- **Dual timeouts** balance security and usability
- **Redis storage** enables distributed session management
- **Cryptographic randomness** prevents session ID prediction

### Files
- Backend: `app/core/session.py`
- Config: `config.py` (timeout settings)

---

## 3. OAuth2 / Social Login

### Implementation
- **Authorization Code Flow** with PKCE
- **State parameter** prevents CSRF during OAuth dance
- **Server-side token exchange** (client_secret never exposed)
- **Encrypted token storage** in database using Fernet
- **Provider mapping** to internal user accounts

### Security Rationale
- **PKCE** prevents authorization code interception
- **State parameter** prevents CSRF attacks
- **Server-side exchange** protects client secrets
- **Encryption** protects OAuth tokens at rest
- **Mapping** maintains consistent user identity

### Files
- Backend: `app/core/oauth.py`
- Routes: `app/routes/auth_secure.py` (OAuth endpoints)

---

## 4. Role-Based Access Control (RBAC)

### Implementation
- **Roles**: admin, moderator, user, guest
- **Permissions**: Granular permission system
- **JWT claims**: Role stored in token
- **Database**: Role persisted in user document
- **Dependencies**: FastAPI dependencies enforce RBAC
- **Frontend guards**: React components check roles

### Security Rationale
- **Principle of least privilege** enforced at all layers
- **Defense in depth**: Both backend and frontend checks
- **Granular permissions** enable fine-grained access control
- **Audit trail**: All access denials logged

### Files
- Backend: `app/core/rbac.py`, `app/core/dependencies.py`
- Frontend: `components/auth/ProtectedRoute.jsx`

---

## 5. Rate Limiting

### Implementation
- **slowapi** (Starlette rate limiter) with Redis backend
- **Per-route limits**: login (5/min), register (3/min), API (100/min)
- **429 responses** with Retry-After header
- **IP + User ID tracking** for authenticated routes

### Security Rationale
- **Brute force prevention** on authentication endpoints
- **DoS mitigation** on all endpoints
- **Retry-After header** enables client backoff
- **User-specific limits** prevent authenticated abuse

### Files
- Backend: `app/core/middleware.py`
- Main: `main.py` (rate limiter configuration)

---

## 6. CORS Configuration

### Implementation
- **Explicit origin whitelist** (no wildcards in production)
- **Specific methods**: GET, POST, PUT, PATCH, DELETE
- **Required headers only**: Authorization, Content-Type, X-CSRF-Token
- **Credentials enabled**: For cookie-based auth
- **Preflight caching**: 1 hour max-age

### Security Rationale
- **Whitelist approach** prevents unauthorized origins
- **Method restriction** limits attack surface
- **Header control** prevents header injection
- **Credential flag** required for HttpOnly cookies

### Files
- Backend: `main.py` (CORS middleware)
- Config: `config.py` (allowed origins)

---

## 7. CSRF Protection

### Implementation
- **Double-submit cookie pattern** for state-changing requests
- **X-Requested-With header** check for SPA endpoints
- **SameSite=Lax** on session/refresh cookies
- **Exempt paths**: Auth endpoints with other protection

### Security Rationale
- **Double-submit** prevents cross-origin requests
- **X-Requested-With** simple CSRF protection for AJAX
- **SameSite** browser-level CSRF protection
- **Defense in depth** multiple CSRF mechanisms

### Files
- Backend: `app/core/middleware.py` (CSRFMiddleware)
- Frontend: `services/apiClient.js` (X-Requested-With header)

---

## 8. Password Security

### Implementation
- **bcrypt** with cost factor 12
- **Strength validation**: 8+ chars, mixed case, number, symbol
- **Breach checking**: HaveIBeenPwned API (k-anonymity)
- **Reset flow**: One-time token, 15-minute expiry
- **Token revocation**: All tokens revoked on password change

### Security Rationale
- **bcrypt** resistant to GPU cracking
- **Cost factor 12** balances security and performance
- **Breach checking** prevents known compromised passwords
- **k-anonymity** protects password privacy during check
- **One-time tokens** prevent reset link reuse
- **Token revocation** invalidates all sessions

### Files
- Backend: `app/core/security.py` (hashing, validation, breach check)
- Routes: `app/routes/auth_secure.py` (password endpoints)

---

## 9. Input Validation

### Implementation
- **Pydantic v2** models with strict field constraints
- **extra='forbid'** rejects unexpected fields
- **Field validators**: Email, phone, username, password
- **Type coercion disabled**: Strict type checking
- **422 responses**: Structured validation errors

### Security Rationale
- **Strict validation** prevents injection attacks
- **Field rejection** prevents mass assignment
- **Type safety** prevents type confusion attacks
- **Structured errors** enable proper error handling

### Files
- Backend: `app/schemas/auth.py` (all Pydantic models)

---

## 10. SQL Injection Prevention

### Implementation
- **SQLAlchemy ORM** with parameterized queries
- **No raw SQL** with user input
- **MongoDB**: Parameterized queries via PyMongo
- **Query logging**: Enabled in development

### Security Rationale
- **Parameterization** prevents SQL injection
- **ORM abstraction** reduces injection risk
- **No string concatenation** eliminates injection vector
- **Query logging** enables security audits

### Files
- Backend: `app/core/database.py`, `app/core/mongodb.py`

---

## 11. Audit Logging

### Implementation
- **Comprehensive logging**: All auth events, admin actions
- **Structured logs**: JSON format with timestamp, user, IP, action
- **Append-only**: Log file never truncated
- **Separate storage**: Dedicated log file
- **Log rotation**: (Implement with logrotate in production)

### Security Rationale
- **Audit trail** for security investigations
- **Append-only** prevents log tampering
- **Structured format** enables automated analysis
- **Comprehensive coverage** captures all security events

### Files
- Backend: `app/core/audit.py`
- Config: `config.py` (log settings)

---

## 12. Secure Cookie Configuration

### Implementation
- **HttpOnly=True**: JavaScript cannot access
- **Secure=True**: HTTPS only (production)
- **SameSite=Lax**: CSRF protection
- **Path=/api/auth**: Narrow scope
- **Domain**: Explicit domain in production
- **Max-Age**: Explicit expiry

### Security Rationale
- **HttpOnly** prevents XSS token theft
- **Secure** prevents MITM attacks
- **SameSite** prevents CSRF
- **Path/Domain** limits cookie scope
- **Max-Age** ensures expiry

### Files
- Backend: `app/routes/auth_secure.py` (_set_refresh_token_cookie)
- Config: `config.py` (cookie settings)

---

## 13. Token Revocation

### Implementation
- **Redis blacklist** with JTI claims
- **TTL matching**: Blacklist TTL = token remaining lifetime
- **Logout revocation**: Immediate blacklist on logout
- **Password change**: All user tokens revoked
- **Validation check**: Every request checks blacklist

### Security Rationale
- **Immediate revocation** prevents token reuse
- **TTL optimization** automatic cleanup
- **Comprehensive coverage** all revocation scenarios
- **Performance**: Redis O(1) lookup

### Files
- Backend: `app/core/security.py` (blacklist functions)
- Dependencies: `app/core/dependencies.py` (validation)

---

## 14. Multi-Factor Authentication (TOTP)

### Implementation
- **pyotp** (RFC 6238 compatible)
- **QR code generation** for easy setup
- **Backup codes**: 10 one-time codes, hashed
- **Verification required**: After password login
- **Time window**: 30-second window with ±1 step tolerance

### Security Rationale
- **TOTP standard** compatible with all authenticator apps
- **Backup codes** prevent lockout
- **Hashed codes** protect backup codes at rest
- **Time tolerance** handles clock skew
- **Two-step verification** prevents password-only compromise

### Files
- Backend: `app/core/mfa.py`
- Routes: `app/routes/auth_secure.py` (MFA endpoints)

---

## 15. Protected Route Guards (React)

### Implementation
- **ProtectedRoute** wrapper component
- **Auth state check**: isAuthenticated, isLoading
- **Role validation**: Optional role requirement
- **Redirect with returnUrl**: Preserves intended destination
- **Loading state**: Prevents flash of protected content

### Security Rationale
- **Client-side enforcement** improves UX
- **Server-side validation** actual security boundary
- **Return URL** better user experience
- **Loading state** prevents content flash

### Files
- Frontend: `components/auth/ProtectedRoute.jsx`

---

## 16. Auth Context & Global State

### Implementation
- **AuthContext** with useAuth hook
- **Memory storage**: Access token in useRef
- **State management**: user, roles, isAuthenticated, isLoading
- **Methods**: login, logout, refreshToken
- **Auto-refresh**: 13-minute interval for 15-minute tokens

### Security Rationale
- **Memory storage** prevents XSS
- **Centralized state** consistent auth state
- **Auto-refresh** seamless user experience
- **Hook pattern** easy consumption

### Files
- Frontend: `context/AuthContext.jsx`

---

## 17. Silent Token Refresh Interceptor

### Implementation
- **Axios interceptor** catches 401 responses
- **Request queue**: Prevents duplicate refresh calls
- **Automatic retry**: Original request retried with new token
- **Failure handling**: Redirect to login on refresh failure
- **Promise-based**: Queued requests wait for refresh

### Security Rationale
- **Seamless UX** no user interruption
- **Single refresh** prevents race conditions
- **Automatic recovery** from token expiry
- **Graceful failure** clear user action on failure

### Files
- Frontend: `services/apiClient.js`

---

## 18. XSS Prevention

### Implementation
- **No dangerouslySetInnerHTML** unless sanitized with DOMPurify
- **Content-Security-Policy** header restricts script sources
- **No localStorage tokens**: Tokens in memory only
- **Input sanitization**: All user content sanitized
- **React escaping**: Automatic XSS protection

### Security Rationale
- **CSP** prevents inline script execution
- **Memory storage** limits XSS impact
- **Sanitization** prevents stored XSS
- **React escaping** prevents reflected XSS

### Files
- Backend: `app/core/middleware.py` (CSP header)
- Frontend: All components (React escaping)

---

## 19. No Tokens in localStorage

### Implementation
- **Access token**: React memory (useRef)
- **Refresh token**: HttpOnly Secure cookie
- **Page reload**: Silent refresh restores session
- **Documentation**: Code comments explain architecture

### Security Rationale
- **XSS protection**: Tokens not accessible to JavaScript
- **Cookie security**: HttpOnly prevents JS access
- **Session restoration**: Seamless page reload
- **Best practice**: Industry-standard approach

### Files
- Frontend: `context/AuthContext.jsx`
- Documentation: This file

---

## 20. Auto-Logout on Idle

### Implementation
- **Activity tracking**: Mouse, keyboard, scroll, touch events
- **15-minute timeout**: Configurable idle period
- **2-minute warning**: Modal with countdown
- **User choice**: Stay logged in or logout
- **Timer reset**: Activity resets timer

### Security Rationale
- **Unattended session protection** prevents unauthorized access
- **Warning modal** prevents unexpected logout
- **User control** balance security and UX
- **Activity tracking** accurate idle detection

### Files
- Frontend: `hooks/useIdleTimeout.js`

---

## 21. HTTP Security Headers

### Implementation
- **Strict-Transport-Security**: Force HTTPS (1 year)
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Content-Security-Policy**: Strict policy
- **Permissions-Policy**: Disable unnecessary features
- **Server header removal**: Hide server info

### Security Rationale
- **HSTS** prevents SSL stripping
- **nosniff** prevents MIME confusion
- **DENY** prevents clickjacking
- **XSS-Protection** legacy browser protection
- **Referrer-Policy** limits information leakage
- **CSP** prevents XSS and injection
- **Permissions-Policy** reduces attack surface
- **Header removal** reduces fingerprinting

### Files
- Backend: `app/core/middleware.py` (SecurityHeadersMiddleware)

---

## 22. Environment Secrets Management

### Implementation
- **pydantic-settings** for validated config
- **.env files** for local development
- **.env.example** template with placeholders
- **.gitignore** prevents .env commits
- **Production**: Use secrets manager (AWS Secrets Manager, Vault)

### Security Rationale
- **Separation** secrets not in code
- **Validation** type-safe configuration
- **Template** guides proper setup
- **Git protection** prevents accidental commits
- **Production security** proper secrets management

### Files
- Backend: `config.py`, `.env.example`
- Git: `.gitignore`

---

## 23. HTTPS Enforcement

### Implementation
- **Nginx/Caddy**: HTTP to HTTPS redirect
- **HSTS header**: includeSubDomains, 1-year max-age
- **Cookie Secure flag**: HTTPS-only cookies
- **SSL validation**: All outbound requests verify certs

### Security Rationale
- **Encryption** protects data in transit
- **HSTS** prevents downgrade attacks
- **Cookie protection** prevents MITM
- **Cert validation** prevents MITM

### Files
- Backend: `config.py` (COOKIE_SECURE)
- Deployment: Nginx/Caddy configuration (not included)

---

## 24. Content Security Policy

### Implementation
- **default-src 'self'**: Only same-origin by default
- **script-src 'self'**: No inline scripts
- **style-src 'self' 'unsafe-inline'**: Inline styles allowed
- **img-src 'self' data: https:**: Images from safe sources
- **font-src 'self' data:**: Fonts from safe sources

### Security Rationale
- **Whitelist approach** prevents unauthorized resources
- **No inline scripts** prevents XSS
- **Inline styles** necessary for React
- **Image sources** balance security and functionality

### Files
- Backend: `config.py` (CSP_POLICY)
- Middleware: `app/core/middleware.py`

---

## 25. Error Boundary

### Implementation
- **React Error Boundary** catches component errors
- **Fallback UI**: Friendly error page
- **Error logging**: Console + monitoring service
- **Recovery options**: Try again, go home
- **Development mode**: Show error details

### Security Rationale
- **Graceful degradation** prevents blank screen
- **Error logging** enables debugging
- **No sensitive data** in production errors
- **User recovery** clear next steps

### Files
- Frontend: `components/ErrorBoundary.jsx`

---

## 26. Toast Notification System

### Implementation
- **ToastProvider** with useToast hook
- **Types**: success, error, warning, info
- **Auto-dismiss**: Configurable duration
- **Manual dismiss**: User can close
- **Stacking**: Multiple toasts supported

### Security Rationale
- **User feedback** security events visible
- **Non-blocking** doesn't interrupt workflow
- **Clear communication** security messages clear

### Files
- Frontend: `context/ToastContext.jsx`

---

## 27. Alert/Confirm Dialog

### Implementation
- **Custom modals** replace window.alert/confirm
- **Promise-based API**: Async/await support
- **Variants**: info, success, warning, danger
- **Customizable**: Title, message, button labels
- **Accessible**: Focus trap, keyboard support

### Security Rationale
- **Controlled UI** consistent security prompts
- **No browser dialogs** better UX
- **Destructive actions** require confirmation

### Files
- Frontend: `context/AlertContext.jsx`

---

## 28. Docker Security Hardening

### Implementation
- **Non-root user**: Containers run as non-root
- **Minimal base images**: python:3.12-slim, node:20-alpine
- **Read-only filesystem**: Where possible
- **Image scanning**: Trivy/Docker Scout in CI
- **No secrets in Dockerfile**: Use build args/secrets

### Security Rationale
- **Privilege reduction** limits container escape impact
- **Minimal images** reduce attack surface
- **Read-only** prevents runtime modifications
- **Scanning** detects vulnerabilities
- **Secret protection** prevents leaks

### Files
- Deployment: Dockerfile (not included in this implementation)

---

## Production Deployment Checklist

### Before Production
1. ✅ Set `APP_ENV=production`
2. ✅ Set `DEBUG=false`
3. ✅ Generate all secrets with `openssl rand -hex 32`
4. ✅ Generate `ENCRYPTION_KEY` with Fernet
5. ✅ Set `COOKIE_SECURE=true`
6. ✅ Set `COOKIE_SAMESITE=strict`
7. ✅ Configure `CORS_ORIGINS` with production domain
8. ✅ Set up production Redis (not localhost)
9. ✅ Set up production MongoDB (not localhost)
10. ✅ Configure OAuth2 credentials
11. ✅ Set up SSL certificates
12. ✅ Configure reverse proxy (nginx/caddy)
13. ✅ Set up log rotation
14. ✅ Configure monitoring (Sentry, etc.)
15. ✅ Run security scan (pip-audit, npm audit)
16. ✅ Review all environment variables
17. ✅ Test all security features
18. ✅ Document incident response plan

---

## Security Testing

### Manual Tests
- [ ] Login with invalid credentials (should fail)
- [ ] Login with valid credentials (should succeed)
- [ ] Access protected route without auth (should redirect)
- [ ] Token refresh on 401 (should auto-refresh)
- [ ] Logout (should clear tokens and redirect)
- [ ] Password change (should revoke all tokens)
- [ ] MFA setup and verification
- [ ] Rate limiting (should return 429)
- [ ] CSRF protection (should block without header)
- [ ] Idle timeout (should show warning and logout)

### Automated Tests
- Implement unit tests for all security functions
- Integration tests for auth flows
- E2E tests for complete user journeys
- Security scanning in CI/CD pipeline

---

## Incident Response

### If Security Breach Detected
1. **Isolate**: Disable affected systems
2. **Assess**: Determine scope and impact
3. **Contain**: Revoke all tokens, reset passwords
4. **Investigate**: Review audit logs
5. **Remediate**: Fix vulnerability
6. **Notify**: Inform affected users
7. **Document**: Post-mortem analysis
8. **Improve**: Update security measures

---

## Maintenance

### Regular Tasks
- **Weekly**: Review audit logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Penetration testing

### Monitoring
- Failed login attempts
- Rate limit violations
- Token revocations
- MFA failures
- Error rates
- Response times

---

## Contact

For security issues, contact: security@yourdomain.com

**Never** disclose security vulnerabilities publicly.
