# Grama Niladari Management System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Authentication System](#authentication-system)
4. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Frontend Routes](#frontend-routes)
9. [Security Features](#security-features)

---

## System Overview

The **Grama Niladari Management System** is a full-stack web application designed to digitize and streamline administrative processes for Grama Niladhari divisions in Sri Lanka. The system manages citizens, households, certificates, complaints, notices, and allowances.

### Technology Stack

**Backend:**
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Environment**: dotenv for configuration

**Frontend:**
- **Framework**: React with Vite
- **Routing**: React Router v6
- **State Management**: localStorage for auth state
- **Styling**: Vanilla CSS with component-specific stylesheets

---

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend - React"
        A[Browser] --> B[React App]
        B --> C[Protected Routes]
        C --> D[Citizen Dashboard]
        C --> E[GN Dashboard]
        C --> F[Admin Dashboard]
    end
    
    subgraph "Backend - Express"
        G[Express Server] --> H[Auth Middleware]
        H --> I[Controllers]
        I --> J[Database Pool]
    end
    
    subgraph "Database - PostgreSQL"
        J --> K[(user_table)]
        J --> L[(citizen)]
        J --> M[(gn_officer)]
        J --> N[(admin_staff)]
        J --> O[(household)]
        J --> P[(certificates)]
    end
    
    B -->|HTTP/JSON| G
    F -->|Admin Actions| G
    E -->|GN Actions| G
    D -->|Citizen Actions| G
```

### Project Structure

```
Grama-Niladari-Management-System/
├── backend/
│   ├── config/
│   │   └── db.js                    # PostgreSQL connection pool
│   ├── controllers/
│   │   └── auth.controller.js       # Authentication logic
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verification & role checking
│   │   └── audit.middleware.js      # Audit logging
│   ├── routes/
│   │   ├── auth.routes.js           # Auth endpoints
│   │   ├── citizen.routes.js        # Citizen endpoints
│   │   ├── household.routes.js      # Household endpoints
│   │   └── family.routes.js         # Family member endpoints
│   ├── utils/
│   │   └── otp.js                   # OTP generation utilities
│   ├── server.js                    # Express app entry point
│   └── .env                         # Environment variables
│
└── frontend/
    ├── src/
    │   ├── auth/
    │   │   └── auth.js              # Auth helper functions
    │   ├── components/
    │   │   └── ProtectedRoute.jsx   # Route protection component
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── CitizenDashboard.jsx
    │   │   ├── GNDashboard.jsx
    │   │   ├── AdminStaffDashboard.jsx
    │   │   └── AdminVerifyCertificates.jsx
    │   ├── styles/
    │   └── App.jsx                  # Main routing configuration
    └── package.json
```

---

## Authentication System

### Overview

The system uses **JWT (JSON Web Tokens)** for stateless authentication. Users authenticate once and receive a token valid for 2 hours.

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter email & password
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Query user_table
    Database-->>Backend: User record
    Backend->>Backend: Verify password with bcrypt
    Backend->>Backend: Generate JWT token
    Backend-->>Frontend: {token, user: {id, email, role}}
    Frontend->>Frontend: Store in localStorage
    Frontend-->>User: Redirect to role-based dashboard
```

### Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Fill registration form
    Frontend->>Backend: POST /api/auth/register
    Backend->>Database: BEGIN TRANSACTION
    Backend->>Database: Check email exists
    Backend->>Database: Check NIC exists
    Backend->>Backend: Hash password with bcrypt
    Backend->>Database: INSERT into user_table
    Backend->>Database: INSERT into citizen table
    Backend->>Database: COMMIT TRANSACTION
    Backend-->>Frontend: {ok: true, user_id}
    Frontend-->>User: Registration successful
```

### Password Reset Flow (OTP-Based)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Terminal
    
    User->>Frontend: Enter email (Forgot Password)
    Frontend->>Backend: POST /api/auth/forgot-password
    Backend->>Backend: Generate 6-digit OTP
    Backend->>Backend: Store OTP in database (expires in 10 min)
    Backend->>Terminal: Print OTP to console
    Backend-->>Frontend: {ok: true, message}
    
    User->>Frontend: Enter OTP
    Frontend->>Backend: POST /api/auth/verify-otp
    Backend->>Backend: Validate OTP & expiry
    Backend->>Backend: Generate verification token (15 min)
    Backend-->>Frontend: {verificationToken}
    
    User->>Frontend: Enter new password
    Frontend->>Backend: POST /api/auth/reset-password
    Backend->>Backend: Verify token & hash password
    Backend->>Backend: Update password & mark OTP as used
    Backend-->>Frontend: {ok: true}
    Frontend-->>User: Password updated successfully
```

### Key Files

#### Backend: `auth.controller.js`

**Key Functions:**
- `register()` - Creates user account with transaction safety
- `login()` - Validates credentials and issues JWT
- `requestPasswordReset()` - Generates and prints OTP
- `verifyOTP()` - Validates OTP and issues verification token
- `resetPassword()` - Updates password with verified token

#### Backend: `auth.middleware.js`

**Middleware Functions:**

1. **`requireAuth`** - Validates JWT token
   ```javascript
   // Extracts token from Authorization header
   // Verifies token signature
   // Attaches user payload to req.user
   ```

2. **`requireRole(...roles)`** - Checks user role
   ```javascript
   // Ensures user has one of the allowed roles
   // Returns 403 Forbidden if role doesn't match
   ```

#### Frontend: `auth.js`

**Helper Functions:**
- `saveAuth(token, user)` - Stores auth data in localStorage
- `getAuth()` - Retrieves auth data from localStorage
- `clearAuth()` - Removes auth data (logout)

---

## Role-Based Access Control (RBAC)

### User Roles

The system supports three primary roles:

| Role | Description | Database Table | Default Dashboard |
|------|-------------|----------------|-------------------|
| **CITIZEN** | Regular citizens who can register households, request certificates, file complaints | `citizen` | `/citizen` |
| **GN** | Grama Niladhari officers who verify households, manage certificates, handle complaints | `gn_officer` | `/gn` |
| **ADMIN** | Administrative staff who verify certificates and manage system data | `admin_staff` | `/admin-dashboard` |

### Role Assignment

Roles are stored in the `user_table.role` column as an ENUM:
```sql
role user_role NOT NULL DEFAULT 'CITIZEN'
-- Possible values: 'CITIZEN', 'GN', 'ADMIN'
```

### Backend Role Protection

Routes are protected using middleware:

```javascript
// Example: Only citizens can access
router.get("/me/profile", 
  requireAuth,                    // Step 1: Verify JWT
  requireRole("CITIZEN"),         // Step 2: Check role
  async (req, res) => { ... }
);

// Example: Multiple roles allowed
router.get("/households", 
  requireAuth, 
  requireRole("GN", "ADMIN"),     // GN or ADMIN
  async (req, res) => { ... }
);
```

### Frontend Route Protection

The `ProtectedRoute` component guards routes:

```javascript
// From ProtectedRoute.jsx
export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // No token? Redirect to login
  if (!token || !user) return <Navigate to="/login" replace />;

  // Wrong role? Redirect to appropriate dashboard
  if (roles && !roles.includes(user.role)) {
    if (user.role === "GN") return <Navigate to="/gn" replace />;
    if (user.role === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return children;
}
```

### Route Configuration Example

```javascript
// From App.jsx
<Route
  path="/admin-verify-certificates"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminVerifyCertificates />
    </ProtectedRoute>
  }
/>
```

### Access Control Matrix

| Feature | CITIZEN | GN | ADMIN |
|---------|---------|-----|-------|
| Register Account | ✅ | ❌ | ❌ |
| View Notices | ✅ | ✅ | ✅ |
| Register Household | ✅ | ❌ | ❌ |
| Verify Household | ❌ | ✅ | ❌ |
| Request Certificate | ✅ | ❌ | ❌ |
| Issue Certificate | ❌ | ✅ | ❌ |
| Verify Certificate | ❌ | ❌ | ✅ |
| File Complaint | ✅ | ❌ | ❌ |
| Manage Complaints | ❌ | ✅ | ❌ |
| Post Notices | ❌ | ✅ | ❌ |
| Manage Allowances | ❌ | ✅ | ❌ |

---

## Data Flow

### 1. User Registration & Login Flow

```mermaid
graph LR
    A[User Visits Site] --> B{Has Account?}
    B -->|No| C[Register Page]
    B -->|Yes| D[Login Page]
    
    C --> E[Submit Registration]
    E --> F[Backend: Create user_table + citizen]
    F --> G[Success Message]
    G --> D
    
    D --> H[Submit Credentials]
    H --> I[Backend: Verify & Generate JWT]
    I --> J{Role?}
    
    J -->|CITIZEN| K[Citizen Dashboard]
    J -->|GN| L[GN Dashboard]
    J -->|ADMIN| M[Admin Dashboard]
```

### 2. Certificate Request Flow

```mermaid
sequenceDiagram
    participant Citizen
    participant Frontend
    participant Backend
    participant GN
    participant Admin
    
    Citizen->>Frontend: Request Certificate
    Frontend->>Backend: POST /api/certificates
    Backend->>Backend: Create certificate record (status: PENDING)
    Backend-->>Frontend: Certificate created
    
    Note over GN: GN reviews request
    GN->>Backend: Verify certificate
    Backend->>Backend: Update status to GN_VERIFIED
    
    Note over Admin: Admin final verification
    Admin->>Backend: Approve certificate
    Backend->>Backend: Update status to VERIFIED
    Backend-->>Citizen: Certificate ready for download
```

### 3. Household Registration Flow

```mermaid
sequenceDiagram
    participant Citizen
    participant Frontend
    participant Backend
    participant GN
    
    Citizen->>Frontend: Fill household form
    Frontend->>Backend: POST /api/household
    Backend->>Backend: Create household record
    Backend->>Backend: Link citizen as head
    Backend-->>Frontend: Household created (PENDING)
    
    Citizen->>Frontend: Add family members
    Frontend->>Backend: POST /api/family/members
    Backend->>Backend: Create family_member records
    
    Note over GN: GN verifies household
    GN->>Backend: Verify household data
    Backend->>Backend: Update household status to VERIFIED
    Backend-->>Citizen: Household verified notification
```

### 4. API Request Flow (Protected Endpoint)

```mermaid
graph TB
    A[Client Request] --> B[Express Server]
    B --> C{Has Authorization Header?}
    C -->|No| D[401 Unauthorized]
    C -->|Yes| E[Extract JWT Token]
    E --> F{Valid Token?}
    F -->|No| D
    F -->|Yes| G[Decode Payload]
    G --> H{Correct Role?}
    H -->|No| I[403 Forbidden]
    H -->|Yes| J[Execute Controller]
    J --> K[Query Database]
    K --> L[Return Response]
```

---

## Database Schema

### Core Tables

#### `user_table`
```sql
user_id SERIAL PRIMARY KEY
email VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
role user_role NOT NULL DEFAULT 'CITIZEN'  -- ENUM: CITIZEN, GN, ADMIN
status user_status NOT NULL DEFAULT 'ACTIVE'  -- ENUM: ACTIVE, INACTIVE
"created _at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### `citizen`
```sql
citizen_id SERIAL PRIMARY KEY
user_id INTEGER UNIQUE REFERENCES user_table(user_id)
nic_number VARCHAR(20) UNIQUE NOT NULL
full_name VARCHAR(255) NOT NULL
phone_number VARCHAR(15)
```

#### `gn_officer`
```sql
gn_id SERIAL PRIMARY KEY
user_id INTEGER UNIQUE REFERENCES user_table(user_id)
officer_name VARCHAR(255) NOT NULL
division_name VARCHAR(255) NOT NULL
contact_number VARCHAR(15)
```

#### `admin_staff`
```sql
admin_id SERIAL PRIMARY KEY
user_id INTEGER UNIQUE REFERENCES user_table(user_id)
staff_name VARCHAR(255) NOT NULL
department VARCHAR(255)
```

#### `household`
```sql
household_id SERIAL PRIMARY KEY
citizen_id INTEGER REFERENCES citizen(citizen_id)
address TEXT NOT NULL
gn_division VARCHAR(255)
verification_status VARCHAR(50) DEFAULT 'PENDING'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### `password_reset_otp`
```sql
otp_id SERIAL PRIMARY KEY
email VARCHAR(255) NOT NULL
otp_code VARCHAR(6) NOT NULL
expires_at TIMESTAMP NOT NULL
is_used BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Relationships

```mermaid
erDiagram
    user_table ||--o| citizen : "has"
    user_table ||--o| gn_officer : "has"
    user_table ||--o| admin_staff : "has"
    citizen ||--o{ household : "owns"
    household ||--o{ family_member : "contains"
    citizen ||--o{ certificate_request : "requests"
    gn_officer ||--o{ certificate_request : "verifies"
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/api/auth/register` | ❌ | - | Register new citizen |
| POST | `/api/auth/login` | ❌ | - | Login and get JWT |
| POST | `/api/auth/forgot-password` | ❌ | - | Request password reset OTP |
| POST | `/api/auth/verify-otp` | ❌ | - | Verify OTP code |
| POST | `/api/auth/reset-password` | ❌ | - | Reset password with token |

### Citizen Endpoints

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| GET | `/api/citizen/me/profile` | ✅ | CITIZEN | Get citizen profile |
| POST | `/api/citizen/me/profile` | ✅ | CITIZEN | Update citizen profile |

### Household Endpoints

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| POST | `/api/household` | ✅ | CITIZEN | Create household |
| GET | `/api/household` | ✅ | CITIZEN, GN | Get households |
| PUT | `/api/household/:id/verify` | ✅ | GN | Verify household |

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "citizen@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "citizen@example.com",
    "role": "CITIZEN"
  }
}
```

#### Protected Request
```http
GET /api/citizen/me/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Frontend Routes

### Public Routes
- `/` - Redirects to `/login`
- `/login` - Login page
- `/register` - Citizen registration
- `/forgot-password` - Request password reset
- `/verify-otp` - Enter OTP
- `/reset-password` - Set new password
- `/password-updated` - Success confirmation

### Citizen Routes (Role: CITIZEN)
- `/citizen` - Citizen dashboard
- `/notices` - View notices
- `/household` - Register household
- `/certificates` - Request certificates
- `/certificate-success` - Certificate request confirmation
- `/complaints` - File complaints
- `/complaint-status` - View complaint status

### GN Routes (Role: GN)
- `/gn` - GN dashboard
- `/gn-households` - Verify households
- `/gn-households/detail` - Household details
- `/gn-certificates` - Manage certificates
- `/gn-complaints` - Manage complaints
- `/gn-notices` - Post notices
- `/gn-allowances` - Manage allowances & aids

### Admin Routes (Role: ADMIN)
- `/admin-dashboard` - Admin dashboard
- `/admin-verify-certificates` - Verify certificates

---

## Security Features

### 1. Password Security
- **Hashing**: bcrypt with salt rounds (10)
- **Minimum Length**: 8 characters
- **Storage**: Only hashed passwords stored in database

### 2. JWT Security
- **Secret Key**: Stored in environment variable (`JWT_SECRET`)
- **Expiration**: 2 hours for auth tokens, 15 minutes for reset tokens
- **Payload**: Minimal data (user ID and role only)

### 3. OTP Security
- **Generation**: 6-digit random code
- **Expiration**: 10 minutes
- **Rate Limiting**: Max 3 OTPs per hour per email
- **One-Time Use**: Marked as used after successful reset

### 4. Database Security
- **Connection Pooling**: Prevents connection exhaustion
- **Parameterized Queries**: Prevents SQL injection
- **Transactions**: Ensures data consistency
- **Unique Constraints**: Prevents duplicate emails/NICs

### 5. Frontend Security
- **Token Storage**: localStorage (consider httpOnly cookies for production)
- **Route Protection**: ProtectedRoute component
- **Role Validation**: Client and server-side checks
- **Auto-Redirect**: Unauthorized users redirected to appropriate pages

### 6. CORS Configuration
```javascript
app.use(require('cors')());  // Currently allows all origins
// Production: Configure specific origins
```

---

## Environment Variables

### Backend `.env`
```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=grama_niladari_db
DB_PASSWORD=your_password
DB_PORT=5432

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=5000
NODE_ENV=development
```

---

## Development Workflow

### Starting the Application

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev  # Uses node --watch for auto-reload
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev  # Vite dev server on port 5173
   ```

### Testing Authentication

1. Register a new citizen at `/register`
2. Login at `/login`
3. JWT token stored in localStorage
4. Navigate to role-specific dashboard
5. Access protected routes with token in Authorization header

---

## Future Enhancements

### Security
- [ ] Implement refresh tokens
- [ ] Add rate limiting middleware
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Add CSRF protection
- [ ] Implement 2FA

### Features
- [ ] Email/SMS OTP delivery
- [ ] Real-time notifications
- [ ] File upload for documents
- [ ] Audit logging for all actions
- [ ] Advanced search and filtering

### Infrastructure
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Database migrations
- [ ] API documentation (Swagger)
- [ ] Monitoring and logging

---

## Troubleshooting

### Common Issues

**Issue**: "Invalid token" error
- **Solution**: Check if token is expired (2 hour limit), re-login

**Issue**: "Forbidden" error on route
- **Solution**: Verify user role matches route requirements

**Issue**: Database connection failed
- **Solution**: Check `.env` configuration and PostgreSQL service

**Issue**: CORS errors
- **Solution**: Ensure backend CORS is configured for frontend origin

---

## Contact & Support

For questions or issues, refer to:
- Database schema documentation
- API endpoint documentation
- Frontend component documentation

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
