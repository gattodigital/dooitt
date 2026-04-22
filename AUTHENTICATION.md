# Authentication & Security Documentation

## Overview

The Dooitt application now uses a modern, secure authentication system that follows OWASP best practices. This document describes the authentication workflow, security measures, and API endpoints.

## Security Features

### Password Security
- **Modern Hashing**: Uses bcrypt (v6.0.0) with 12 salt rounds for password hashing
- **Password Requirements**:
  - Minimum 8 characters
  - Maximum 128 characters
  - At least one lowercase letter (a-z)
  - At least one uppercase letter (A-Z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*(),.?":{}|<>)

### JWT Token Management
- **Token Expiration**: Tokens expire after 24 hours
- **Token Structure**: JWT tokens include:
  - `sub`: User ID
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp
- **Secure Storage**: Tokens are stored in localStorage (consider migrating to httpOnly cookies for production)

### Rate Limiting
- **Authentication Endpoints**: 20 requests per 15 minutes per IP
- **API Endpoints**: 100 requests per 15 minutes per IP
- **Profile Endpoint**: 100 requests per 15 minutes per IP

### Input Validation
- Email format validation (client and server-side)
- Password strength validation (client and server-side)
- Type checking to prevent NoSQL injection
- Email normalization (lowercase, trimmed)

### Protected Routes
All API endpoints except authentication routes require a valid JWT token:
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Fetch task details
- `GET /users` - Fetch all users
- `GET /profile/:id` - Fetch user profile

## API Endpoints

### Sign Up

Creates a new user account.

**Endpoint**: `POST /authorization/sign-up`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (invalid email, weak password)
- `409 Conflict`: Email already exists
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Sign In

Authenticates an existing user.

**Endpoint**: `POST /authorization/sign-in`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation failed (missing fields)
- `401 Unauthorized`: Invalid email or password
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Forgot Password

Generates a password reset token for a user.

**Endpoint**: `POST /authorization/forgot-password`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "If an account with that email exists, a password reset link has been sent.",
  "resetToken": "a1b2c3d4e5f6..."
}
```

**Note**: The `resetToken` field is included for development/testing only and should be removed in production. In production, this token should be sent via email only.

**Error Responses**:
- `400 Bad Request`: Email is required
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Reset Password

Resets a user's password using a valid reset token.

**Endpoint**: `POST /authorization/reset-password`

**Request Body**:
```json
{
  "resetToken": "a1b2c3d4e5f6...",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response** (200):
```json
{
  "message": "Password has been reset successfully."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid token, expired token, or weak password
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Frontend Integration

### Sign In Component

The sign-in component (`/sign-in`) provides:
- Email and password input fields
- Client-side validation
- User-friendly error messages
- Loading states during authentication

**Usage**:
1. User enters email and password
2. Form validates input client-side
3. Request sent to `/authorization/sign-in`
4. On success: Token stored in localStorage, redirect to `/main`
5. On error: Display appropriate error message

### Sign Up Component

The sign-up component (`/sign-up`) provides:
- Name, email, and password input fields
- Real-time password strength validation
- Password requirements helper text
- User-friendly error messages
- Loading states during registration

**Usage**:
1. User enters name, email, and password
2. Form validates input client-side (password strength, email format)
3. Request sent to `/authorization/sign-up`
4. On success: Token stored in localStorage, redirect to `/sign-up/confirm`
5. On error: Display appropriate error message

### Auth Interceptor

The `AuthInterceptorService` automatically:
- Attaches JWT token to all HTTP requests
- Sets `Authorization: Bearer {token}` header
- Applies to all outgoing requests

## Testing

### Running Tests

```bash
cd back-end
npm test
```

### Test Coverage

The authentication system includes comprehensive tests for:
- User sign-up with valid/invalid data
- Password strength validation
- Email format validation
- Duplicate email handling
- Password hashing verification
- User sign-in with correct/incorrect credentials
- Password reset token generation
- Password reset with valid/invalid tokens
- JWT token authentication middleware
- Protected route access control

## Environment Variables

### Required Variables

```bash
# Database connection string
MONGODB_URI=mongodb://localhost:27017/dooitt

# JWT secret key (use a strong, random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server port (default: 3000)
PORT=3000

# CORS origin (optional, recommended for production)
CORS_ORIGIN=http://localhost:4200
```

### Security Considerations

1. **JWT_SECRET**: Must be a strong, random string (minimum 32 characters recommended)
2. **MONGODB_URI**: Use authentication and SSL in production
3. **CORS_ORIGIN**: Set to your frontend URL in production

## Migration Guide

### From Old System to New System

If migrating from the old authentication system:

1. **Update Dependencies**:
   ```bash
   npm uninstall bcrypt-nodejs
   npm install bcrypt
   ```

2. **Existing User Passwords**:
   - Old bcrypt-nodejs hashes are compatible with new bcrypt library
   - Users can continue to sign in with existing passwords
   - Passwords will be re-hashed on next password change

3. **Client-Side Changes**:
   - Update error handling to use new error response format
   - Add client-side validation for password strength
   - Update UI to display validation errors

4. **Token Format**:
   - New tokens include expiration timestamp
   - Old tokens without expiration will still work
   - Implement token refresh mechanism (future enhancement)

## Best Practices

### For Developers

1. **Never Log Passwords**: Passwords should never appear in logs
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate on Both Sides**: Implement validation on both client and server
4. **Handle Errors Gracefully**: Don't leak sensitive information in error messages
5. **Keep Dependencies Updated**: Regularly update security-related packages

### For Production Deployment

1. **Use Environment Variables**: Never commit secrets to version control
2. **Enable CORS Restrictions**: Set CORS_ORIGIN to your frontend URL
3. **Use Database Authentication**: Enable MongoDB authentication
4. **Implement Email Verification**: Add email verification for new accounts
5. **Set Up Email Service**: Configure email service for password resets
6. **Monitor Rate Limits**: Track and alert on rate limit violations
7. **Regular Security Audits**: Run `npm audit` regularly

## Future Enhancements

Potential improvements to consider:

1. **Email Verification**: Send verification email on signup
2. **Two-Factor Authentication**: Add 2FA support
3. **Refresh Tokens**: Implement refresh token mechanism
4. **HttpOnly Cookies**: Migrate from localStorage to httpOnly cookies
5. **Account Lockout**: Lock accounts after multiple failed attempts
6. **Password History**: Prevent password reuse
7. **Session Management**: Track active sessions per user
8. **OAuth Integration**: Add social login options

## Support

For questions or issues related to authentication:
- Review this documentation
- Check the test suite for examples
- Refer to the OWASP authentication guidelines
