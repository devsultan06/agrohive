# Authentication Flow Documentation for AgroHive Backend

This document outlines the authentication endpoints and data structures required by the AgroHive mobile application.

## 1. User Registration (Sign Up)

The mobile app collects the User's Name, Email, Password, and optionally a Profile Picture.

### Endpoint

`POST /api/auth/register`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "avatar": "https://example.com/avatar.jpg" // Optional (URL or Base64 depending on backend preference)
}
```

### Response

**Success (201 Created)**

```json
{
  "status": "success",
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "user_12345",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "valid_jwt_token" // Optional: If specific flow requires immediate login
  }
}
```

**Error (400 Bad Request)**

```json
{
  "status": "error",
  "message": "Email already exists"
}
```

---

## 2. User Login

### Endpoint

`POST /api/auth/login`

### Request Body

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### Response

**Success (200 OK)**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...", // JWT Token
    "user": {
      "id": "user_12345",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "role": "farmer" // or "user", "expert"
    }
  }
}
```

**Error (401 Unauthorized)**

```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

## 3. Forgot Password

Initiates the password reset process by sending an OTP to the user's email.

### Endpoint

`POST /api/auth/forgot-password`

### Request Body

```json
{
  "email": "john@example.com"
}
```

### Response

**Success (200 OK)**

```json
{
  "status": "success",
  "message": "OTP sent to your email"
}
```

---

## 4. Verify OTP

Verifies the OTP entered by the user.

### Endpoint

`POST /api/auth/verify-otp`

### Request Body

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Response

**Success (200 OK)**

```json
{
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "temp_reset_token_xyz" // Token to authorize the password reset
  }
}
```

---

## 5. Reset Password

Sets a new password using the authorized token.

### Endpoint

`POST /api/auth/reset-password`

### Request Body

```json
{
  "resetToken": "temp_reset_token_xyz",
  "newPassword": "NewSecurePassword456!"
}
```

### Response

**Success (200 OK)**

```json
{
  "status": "success",
  "message": "Password reset successfully. Please login with your new password."
}
```

---

## 6. Social Login (Future Implementation)

Planned endpoints for Google and Apple sign-in.

### Endpoint

`POST /api/auth/google` (Example)

### Request Body

```json
{
  "accessToken": "google_access_token"
}
```

### Response

Same structure as **User Login**.
