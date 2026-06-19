# ⚙️ DocSign Server - Enterprise Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-ESM-68a063?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2d3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql)
![Status](https://img.shields.io/badge/Status-Live%20on%20Render-brightgreen?style=for-the-badge)

**A production-grade, type-safe REST API for digital document signing with comprehensive security, audit trails, and enterprise features.**

[🌐 Live API](https://doc-sign-api.onrender.com) • [📖 Features](#-core-features) • [⚙️ Setup](#-installation--setup) • [🔌 API Reference](#-api-reference)

---

</div>

## 📌 Overview

DocSign Server is a **robust, scalable backend** built with Express.js and Prisma ORM. It handles authentication, document management, signature verification, and comprehensive audit logging. Designed for enterprise reliability with security as a first-class concern.

### 🚀 Live Deployment
- **🔴 Hosted on**: Render (Optimized for Node.js)
- **⚡ Performance**: Auto-scaling with load balancing
- **🔒 Security**: HTTPS/TLS, environment isolation
- **📊 Monitoring**: Real-time logs and performance metrics
- **🌍 Database**: Supabase PostgreSQL with connection pooling

---

## ✨ Core Features

### 🔐 Authentication & Security
- **JWT-Based Auth**: Stateless, scalable token authentication
- **Password Security**: Bcryptjs hashing (10+ salt rounds)
- **Session Management**: Secure HTTP-only cookies
- **Token Expiration**: Automatic refresh token rotation
- **Password Reset**: Time-bound reset tokens (1-hour expiry)
- **Input Validation**: Express-validator sanitization
- **CORS Protection**: Cross-origin request filtering

### 📄 Document Management
- **Upload & Store**: Secure file storage with validation
- **Status Lifecycle**: PENDING → SIGNED → ARCHIVED workflow
- **Multi-User Support**: Shared document access
- **Document Metadata**: Title, description, timestamps
- **File Retrieval**: Secure download with ownership verification
- **Batch Operations**: Handle multiple documents efficiently

### ✍️ Signature Processing
- **Multi-Page Support**: Sign documents with 100+ pages
- **Precise Positioning**: Pixel-accurate coordinate storage
- **Signature Verification**: Timestamp-based validation
- **Batch Signing**: Multiple signers per document
- **State Tracking**: Individual signature status
- **Signature Data**: Base64 encoded canvas data

### 📋 Audit & Compliance
- **Immutable Logs**: Append-only audit trail
- **Complete Tracking**: User, IP, timestamp, action details
- **Event Types**: Create, Sign, Reject, Download, Share
- **Compliance Ready**: GDPR/HIPAA audit requirements
- **Log Retention**: Configurable data retention policies
- **Export Capabilities**: Download audit reports

### 📧 Notifications
- **Email Delivery**: Async notification system
- **Event Triggers**: Sign requests, status updates, reminders
- **Template Support**: Dynamic HTML email templates
- **Retry Logic**: Failed email retry mechanism
- **Delivery Tracking**: Send status monitoring

### 👥 Collaboration
- **Workspace Sharing**: Invite users to document access
- **Role Management**: Owner, signer, viewer roles
- **Permissions**: Granular access control
- **Activity Feed**: Real-time user action notifications

---

## 🏗️ Architecture

### Layered Architecture
```
┌─────────────────────────────────────┐
│  Express Routes & Controllers       │  ← Request Handling
├─────────────────────────────────────┤
│  Business Logic Services            │  ← Core Logic
├─────────────────────────────────────┤
│  Prisma ORM Layer                   │  ← Data Abstraction
├─────────────────────────────────────┤
│  PostgreSQL Database (Supabase)     │  ← Data Persistence
└─────────────────────────────────────┘
                 ↑
      Middleware Stack (Auth, Validation, Logging)
```

### Request Flow
```
HTTP Request
    ↓
CORS Middleware
    ↓
JWT Verification (if protected route)
    ↓
Input Validation (express-validator)
    ↓
Route Handler / Controller
    ↓
Service Layer (Business Logic)
    ↓
Prisma ORM Query
    ↓
PostgreSQL Execution
    ↓
Response JSON
    ↓
HTTP Response
```

---

## 🛠️ Tech Stack Deep Dive

### Core Framework
| Tech | Version | Why |
|------|---------|-----|
| **Express.js** | 5.2.1 | Lightweight, battle-tested, excellent middleware ecosystem |
| **Node.js** | ESM | Modern JavaScript modules, top-level await, better performance |

### Database & ORM
| Tech | Version | Why |
|------|---------|-----|
| **Prisma** | 7.8.0 | Type-safe ORM, automatic migrations, query builder |
| **PostgreSQL Adapter** | 7.8.0 | Optimal for Postgres, connection pooling |
| **Supabase** | 2.107.0 | Managed Postgres, auth, storage in one platform |
| **pg** | 8.21.0 | Native PostgreSQL driver for Prisma |

### Authentication & Security
| Tech | Version | Why |
|------|---------|-----|
| **bcryptjs** | 3.0.3 | Password hashing, industry standard |
| **jsonwebtoken (JWT)** | 9.0.3 | Stateless auth tokens, industry standard |
| **express-validator** | 7.3.2 | Input validation & sanitization |
| **CORS** | 2.8.6 | Cross-origin resource sharing control |

### File & PDF Handling
| Tech | Version | Why |
|------|---------|-----|
| **Multer** | 2.1.1 | File upload middleware, streaming support |
| **pdf-lib** | 1.17.1 | PDF manipulation, annotations, metadata |

### Email & Notifications
| Tech | Version | Why |
|------|---------|-----|
| **Nodemailer** | 8.0.10 | Email delivery, SMTP/OAuth2 support |

### Development & Tooling
| Tech | Version | Why |
|------|---------|-----|
| **Nodemon** | 3.1.14 | Auto-restart on file changes |
| **dotenv** | 17.4.2 | Environment variable management |
| **tsx** | 4.22.4 | ESM TypeScript executor |

---

## 📁 Directory Structure

```
server/
├── src/
│   ├── app.js                         # 🚀 Express app setup & middleware
│   │                                  #    - Routes registration
│   │                                  #    - Middleware setup
│   │                                  #    - Error handling
│   │
│   ├── config/
│   │   ├── db.js                     # 🗄️ Database connection
│   │   │                              #    - Prisma client
│   │   │                              #    - Connection pooling
│   │   │                              #    - Retry logic
│   │   │
│   │   └── supabase.js               # ☁️ Supabase initialization
│   │                                  #    - Auth config
│   │                                  #    - Storage setup
│   │                                  #    - API keys
│   │
│   ├── controllers/
│   │   ├── authController.js         # 🔐 Authentication handlers
│   │   │                              #    - register()
│   │   │                              #    - login()
│   │   │                              #    - logout()
│   │   │                              #    - forgotPassword()
│   │   │                              #    - resetPassword()
│   │   │                              #    - refreshToken()
│   │   │
│   │   ├── documentController.js     # 📄 Document handlers
│   │   │                              #    - upload()
│   │   │                              #    - getDocuments()
│   │   │                              #    - getDocumentById()
│   │   │                              #    - updateStatus()
│   │   │                              #    - delete()
│   │   │
│   │   ├── signatureController.js    # ✍️ Signature handlers
│   │   │                              #    - addSignature()
│   │   │                              #    - getSignatures()
│   │   │                              #    - verifySignature()
│   │   │
│   │   └── auditController.js        # 📋 Audit handlers
│   │                                  #    - getAuditLog()
│   │                                  #    - exportAudit()
│   │
│   ├── middleware/
│   │   ├── auth.js                   # 🔒 JWT verification middleware
│   │   │                              #    - verifyToken()
│   │   │                              #    - protectedRoute()
│   │   │                              #    - roleCheck()
│   │   │
│   │   └── upload.js                 # 📤 File upload middleware
│   │                                  #    - multer config
│   │                                  #    - file validation
│   │                                  #    - size limits
│   │
│   ├── routes/
│   │   ├── authRoutes.js             # 🛣️ Authentication endpoints
│   │   │                              #    - POST /api/auth/register
│   │   │                              #    - POST /api/auth/login
│   │   │                              #    - POST /api/auth/logout
│   │   │                              #    - POST /api/auth/forgot-password
│   │   │                              #    - POST /api/auth/reset-password
│   │   │
│   │   └── documentRoutes.js         # 🛣️ Document endpoints
│   │                                  #    - POST /api/documents/upload
│   │                                  #    - GET /api/documents
│   │                                  #    - GET /api/documents/:id
│   │                                  #    - PUT /api/documents/:id/status
│   │                                  #    - DELETE /api/documents/:id
│   │                                  #    - POST /api/documents/:id/sign
│   │                                  #    - GET /api/documents/:id/audit
│   │
│   ├── services/
│   │   ├── authService.js            # 🔐 Authentication business logic
│   │   │                              #    - User registration
│   │   │                              #    - Password hashing/comparison
│   │   │                              #    - Token generation/validation
│   │   │                              #    - Password reset flow
│   │   │
│   │   ├── documentService.js        # 📄 Document logic
│   │   │                              #    - File storage
│   │   │                              #    - Status updates
│   │   │                              #    - Permissions check
│   │   │
│   │   ├── signatureService.js       # ✍️ Signature logic
│   │   │                              #    - Position validation
│   │   │                              #    - Signature verification
│   │   │                              #    - Multi-page support
│   │   │
│   │   ├── emailService.js           # 📧 Email delivery
│   │   │                              #    - Send notifications
│   │   │                              #    - Template rendering
│   │   │                              #    - Retry mechanism
│   │   │
│   │   └── auditService.js           # 📋 Audit logging
│   │                                  #    - Log creation
│   │                                  #    - Log retrieval
│   │                                  #    - Export functionality
│   │
│   └── prisma/
│       └── schema.prisma             # 🗄️ Database schema
│           ├── User model
│           ├── Document model
│           ├── Signature model
│           └── AuditLog model
│
├── package.json                      # Dependencies & scripts
├── .env                              # Environment variables (don't commit!)
├── .env.example                      # Example configuration
├── prisma.config.ts                  # Prisma config (if custom)
├── test-share.mjs                    # Test utilities
└── nodemon.json                      # Nodemon configuration (optional)
```

---

## 🗄️ Database Schema

### Entity-Relationship Diagram
```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │──┐
│ password    │  │
│ name        │  │
│ resetToken  │  │  One-to-Many
│ createdAt   │  │
└─────────────┘  │
                 │  ┌─────────────────┐
                 ├─►│   Document      │
                 │  ├─────────────────┤
                 │  │ id (PK)         │
                 │  │ title           │
                 │  │ fileUrl         │
                 │  │ status          │ ──┐
                 │  │ ownerId (FK)    │   │
                 │  │ createdAt       │   │ One-to-Many
                 │  └─────────────────┘   │
                 │                         │
                 │  ┌─────────────────┐   │
                 ├─►│   Signature     │◄──┤
                 │  ├─────────────────┤   │
                 │  │ id (PK)         │   │
                 │  │ documentId (FK) │───┘
                 │  │ signerEmail     │
                 │  │ signerId (FK)   │──┐
                 │  │ x, y, pageNum   │  │
                 │  │ signatureData   │  │
                 │  │ isSigned        │  │
                 │  │ signedAt        │  │
                 │  └─────────────────┘  │
                 │                        │
                 │  ┌─────────────────┐  │
                 └─►│   AuditLog      │◄─┘
                    ├─────────────────┤
                    │ id (PK)         │
                    │ documentId (FK) │
                    │ userId (FK)     │
                    │ action          │
                    │ ipAddress       │
                    │ createdAt       │
                    └─────────────────┘
```

### Models Description

#### User
```prisma
model User {
  id                  String      @id @default(uuid())
  email              String      @unique          // Unique login identifier
  password           String                       // Bcrypt hash
  name               String                       // Display name
  resetPasswordToken String?                      // Password reset token
  resetPasswordExpires DateTime?                  // Token expiration
  
  documents  Document[]  @relation("OwnerDocs")   // Owned documents
  signatures Signature[] @relation("UserSignatures")  // Signed docs
  audits     AuditLog[]                           // Action history
  createdAt  DateTime    @default(now())
}
```

#### Document
```prisma
model Document {
  id         String      @id @default(uuid())
  title      String                              // Document name
  fileUrl    String                              // S3/Storage URL
  status     DocStatus   @default(PENDING)       // PENDING|SIGNED|REJECTED
  ownerId    String
  owner      User        @relation("OwnerDocs", fields: [ownerId])
  rejectReason String?                           // If rejected
  
  signatures Signature[]                         // All signatures
  auditLogs  AuditLog[]                          // Action log
  createdAt  DateTime    @default(now())
}
```

#### Signature
```prisma
model Signature {
  id           String   @id @default(uuid())
  documentId   String
  document     Document @relation(fields: [documentId], onDelete: Cascade)
  signerEmail  String                           // Signer email
  signerId     String?
  signer       User?    @relation("UserSignatures", fields: [signerId])
  
  x            Float                            // Signature X position
  y            Float                            // Signature Y position
  pageNumber   Int      @default(1)             // Page number
  signatureData String?                         // Base64 encoded drawing
  isSigned     Boolean  @default(false)         // Completion status
  signedAt     DateTime?                        // Signature timestamp
}
```

#### AuditLog
```prisma
model AuditLog {
  id         String   @id @default(uuid())
  documentId String
  document   Document @relation(fields: [documentId], onDelete: Cascade)
  userId     String?
  user       User?    @relation(fields: [userId])
  
  action     String                             // "CREATE", "SIGN", "REJECT", etc.
  ipAddress  String                             // Request origin
  createdAt  DateTime @default(now())
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.17+ (LTS recommended)
- npm 10+ or yarn
- PostgreSQL database (or Supabase account)
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd doc-sign-app/server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
```bash
cp .env.example .env
```

**`.env` Configuration:**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/docsign

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Email Configuration (Gmail example)
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password  # Not your Gmail password!
MAIL_FROM=noreply@docsign.app

# File Upload
UPLOAD_MAX_SIZE=50000000  # 50MB
UPLOAD_DIR=./uploads

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Render Deployment
RENDER_EXTERNAL_URL=https://your-app.onrender.com  # For production
```

### Step 4: Database Setup

#### Option A: Supabase (Recommended)
```bash
# Create project on supabase.com
# Copy connection string to DATABASE_URL
# Run migrations
npx prisma migrate dev --name init
```

#### Option B: Local PostgreSQL
```bash
# Create database
createdb docsign

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### Step 5: Generate Prisma Client
```bash
npx prisma generate
```

### Step 6: Start Development Server
```bash
npm run dev
```

API will be available at `http://localhost:3001`

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Run production server |
| `npx prisma migrate dev` | Create & run migrations |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Sync schema to DB (dev only) |

---

## 🔌 API Reference

### Base URL
```
Development: http://localhost:3001
Production: https://doc-sign-api.onrender.com
```

### Request/Response Format
```json
// Request
POST /api/endpoint
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

// Response
{
  "success": true,
  "data": { /* data */ },
  "message": "Success message"
}
```

### Authentication Endpoints

#### Register
```
POST /api/auth/register

Body:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "data": { "user": { "id", "email", "name" }, "token": "jwt..." }
}
```

#### Login
```
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": { "user": {...}, "token": "jwt..." }
}
```

#### Logout
```
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Forgot Password
```
POST /api/auth/forgot-password

Body:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Reset link sent to email"
}
```

#### Reset Password
```
POST /api/auth/reset-password

Body:
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successful"
}
```

### Document Endpoints

#### Upload Document
```
POST /api/documents/upload
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Body:
{
  "file": <PDF_FILE>,
  "title": "Contract.pdf"
}

Response:
{
  "success": true,
  "data": { "id": "uuid", "title", "fileUrl", "status", "createdAt" }
}
```

#### Get All Documents
```
GET /api/documents?status=PENDING&limit=10&offset=0
Authorization: Bearer <TOKEN>

Response:
{
  "success": true,
  "data": [ { "id", "title", "status", "createdAt", ... } ]
}
```

#### Get Document by ID
```
GET /api/documents/:id
Authorization: Bearer <TOKEN>

Response:
{
  "success": true,
  "data": { "id", "title", "fileUrl", "status", "signatures", "owner" }
}
```

#### Update Document Status
```
PUT /api/documents/:id/status
Authorization: Bearer <TOKEN>

Body:
{
  "status": "SIGNED",
  "rejectReason": null  // null for SIGNED, string for REJECTED
}

Response:
{
  "success": true,
  "data": { "id", "status", "updatedAt" }
}
```

#### Delete Document
```
DELETE /api/documents/:id
Authorization: Bearer <TOKEN>

Response:
{
  "success": true,
  "message": "Document deleted"
}
```

#### Sign Document
```
POST /api/documents/:id/sign
Authorization: Bearer <TOKEN>

Body:
{
  "signatureData": "data:image/png;base64,...",
  "x": 150.5,
  "y": 200.3,
  "pageNumber": 1
}

Response:
{
  "success": true,
  "data": { "id": "signature-id", "documentId", "isSigned", "signedAt" }
}
```

#### Get Audit Log
```
GET /api/documents/:id/audit
Authorization: Bearer <TOKEN>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "action": "CREATE|SIGN|REJECT|...",
      "user": { "email", "name" },
      "ipAddress": "192.168.1.1",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🔐 Security Best Practices Implemented

✅ **Password Security**
- Bcryptjs with 10+ salt rounds
- No password logging
- Secure reset token generation

✅ **Token Security**
- JWT with HS256 algorithm
- Short-lived access tokens (configurable)
- Refresh token rotation

✅ **Database Security**
- Parameterized queries (Prisma)
- SQL injection prevention
- Encrypted connection (SSL/TLS)

✅ **API Security**
- CORS whitelist
- Rate limiting ready (middleware available)
- Input validation & sanitization
- HTTPS enforcement on production

✅ **Audit Trail**
- Immutable logs
- IP address tracking
- Action timestamps
- User identification

---

## 🌐 Deployment to Render

### Prerequisites
- GitHub account with repository
- Render account (free tier available)

### Steps

1. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository

3. **Configure Render Service**
   ```
   Name: doc-sign-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - All `.env` variables in Render dashboard
   - PostgreSQL: Use Supabase connection string

5. **Deploy**
   - Render auto-builds and deploys
   - View logs in dashboard
   - Get public URL (e.g., https://doc-sign-api.onrender.com)

### Post-Deployment
- ✅ Auto HTTPS
- ✅ Auto-scaling
- ✅ Real-time logs
- ✅ Performance monitoring

---

## ⚡ Performance Optimizations

### Database
- **Connection Pooling**: Prisma auto-manages
- **Query Optimization**: Prisma selects only needed fields
- **Indexes**: On frequently queried columns
- **Pagination**: Limit/offset for large datasets

### API
- **Response Compression**: Gzip enabled
- **JSON Serialization**: Efficient encoding
- **Caching Headers**: Appropriate cache-control
- **Batch Operations**: Multi-item endpoints

### Middleware
- **Early Validation**: Fail fast on invalid input
- **Authentication Check**: Before processing
- **Error Handling**: Graceful error responses

---

## 🧪 Testing Ready

### Manual Testing
```bash
# Using curl
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Postman Collection
- Available in repository: `/postman-collection.json`
- Import into Postman for API testing
- Pre-configured authorization headers

---

## 🐛 Troubleshooting

### Issue: Database Connection Refused
```bash
# Check Supabase status
# Verify DATABASE_URL format
# Test connection:
npx prisma db execute --stdin < test.sql
```

### Issue: JWT Token Expired
- Token expiry configured in `.env`
- Implement refresh token endpoint
- Client auto-retry with new token

### Issue: File Upload Failed
- Check `UPLOAD_MAX_SIZE`
- Verify file permissions
- Check disk space on server

### Issue: Email Not Sending
- Verify MAIL_* variables
- Check Gmail "Less secure apps"
- Use OAuth2 instead of password

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma ORM Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Supabase Docs](https://supabase.com/docs)

---

## 🛠️ Maintenance

### Regular Tasks
- **Monitor Logs**: Check Render dashboard daily
- **Database Backups**: Supabase auto-backs up
- **Dependency Updates**: Check npm outdated
- **Security Patches**: Update regularly

### Database Maintenance
```bash
# Check schema validity
npx prisma validate

# Create migration
npx prisma migrate dev --name description

# Reset database (dev only)
npx prisma migrate reset
```

---

## 📞 Support

For issues or questions:
- Check [troubleshooting](#-troubleshooting)
- Review server logs on Render
- Check database with `npx prisma studio`
- Contact: [support email]

---

<div align="center">

### 🌟 Enterprise-Grade Backend

**Backend Live**: https://doc-sign-api.onrender.com

Built with security, scalability, and reliability in mind

Made with ❤️ for robust document signing infrastructure

</div>
