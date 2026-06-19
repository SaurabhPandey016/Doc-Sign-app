# 📄 DocSign - Enterprise Document Signing Platform

<div align="center">

![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blueviolet?style=for-the-badge)

**A modern, full-stack digital document signing and management platform with real-time signature verification, comprehensive audit trails, and seamless collaboration features.**

[🌐 Live Demo](https://doc-sign-app-gamma.vercel.app) • [📚 Documentation](#documentation) • [🛠️ Tech Stack](#tech-stack) • [🚀 Getting Started](#quick-start)

---

</div>

## 🎯 Overview

DocSign is a professional-grade **document signing and management system** designed for enterprises that need secure, auditable digital signatures on critical documents. Built with modern, scalable technologies, it provides an intuitive user experience combined with robust backend infrastructure.

### ✨ Key Features

- **✍️ Digital Signatures**: Intuitive canvas-based signature capture with real-time rendering
- **📑 Multi-Page PDF Support**: View, navigate, and sign documents seamlessly
- **🔐 Secure Authentication**: Password hashing with bcryptjs, JWT token management
- **📍 Signature Positioning**: Drag-and-drop signature placement with pixel-perfect accuracy
- **🔍 Comprehensive Audit Trail**: Track every action with user, IP, timestamp, and action details
- **📧 Email Notifications**: Automated notifications for signature requests and document status updates
- **👥 Multi-User Collaboration**: Assign documents to multiple signers with individual tracking
- **🔄 Document Status Management**: PENDING → SIGNED → ARCHIVED workflow
- **⚡ Real-Time Updates**: Instant UI updates on document state changes
- **🛡️ Role-Based Access Control**: Secure endpoints with middleware authentication
- **📊 Dashboard Analytics**: View document statistics and signature history
- **🌙 Professional UI**: Modern, responsive design with smooth animations

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           DOCSIGN FULL STACK ARCHITECTURE               │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐              ┌──────────────────┐ │
│  │   VERCEL (CDN)   │              │  RENDER (Node)   │ │
│  │    Frontend      │◄────────────►│     Backend      │ │
│  │  (Next.js + TS)  │   HTTPS API  │  (Express + ORM) │ │
│  └──────────────────┘              └────────┬─────────┘ │
│                                              │           │
│                                    ┌─────────▼─────────┐ │
│                                    │   SUPABASE        │ │
│                                    │   PostgreSQL      │ │
│                                    │   (Encrypted)     │ │
│                                    └───────────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend Stack** 🎨
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.7 | React framework with server-side rendering & API routes |
| **React** | 19.2.4 | UI component library with hooks |
| **TypeScript** | 5.x | Type-safe JavaScript development |
| **Tailwind CSS** | 4 | Utility-first CSS framework for modern styling |
| **React PDF** | 10.4.1 | PDF rendering and viewer components |
| **React Signature Canvas** | 1.1.0-alpha | Smooth, responsive signature capture |
| **React RnD** | 10.5.3 | Drag-and-drop signature positioning |
| **Lucide React** | 1.17.0 | Beautiful, consistent icon library |
| **ESLint** | 9 | Code quality & style enforcement |

### **Backend Stack** ⚙️
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express.js** | 5.2.1 | Lightweight, fast HTTP server framework |
| **Node.js** | ESM Modules | Modern JavaScript runtime with ES modules |
| **Prisma ORM** | 7.8.0 | Type-safe database ORM with migrations |
| **PostgreSQL** | Latest | Robust relational database via Supabase |
| **Supabase** | 2.107.0 | Backend-as-a-service with auth & storage |
| **JWT** | 9.0.3 | Secure token-based authentication |
| **bcryptjs** | 3.0.3 | Password hashing with salt rounds |
| **Multer** | 2.1.1 | File upload handling middleware |
| **pdf-lib** | 1.17.1 | PDF manipulation and annotation |
| **Nodemailer** | 8.0.10 | Email delivery service |
| **Express Validator** | 7.3.2 | Input validation middleware |
| **CORS** | 2.8.6 | Cross-origin resource sharing |
| **Nodemon** | 3.1.14 | Development hot-reload |

### **Database** 🗄️
- **PostgreSQL** via Supabase
- **Prisma** for migrations and type safety
- **Connection Pooling** for performance optimization

### **Deployment** 🚀
- **Frontend**: Vercel (Optimized for Next.js)
- **Backend**: Render (Node.js Environment)
- **Database**: Supabase (Managed PostgreSQL)
- **File Storage**: Secure cloud storage integration

---

## 📊 Database Schema

### Entity Relationships
```
User ──┬──► Document (Owner)
       └──► Signature (Signer)
       └──► AuditLog

Document ──┬──► Signature (Multiple)
           └──► AuditLog (Multiple)

Signature ──► Document
          └──► User (Optional)

AuditLog ──┬──► Document
           └──► User (Optional)
```

### Core Models
- **User**: Authentication, profile, password reset
- **Document**: File management, status tracking, ownership
- **Signature**: Multi-page positioning, verification, timestamp
- **AuditLog**: Immutable action tracking with IP & user context

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL (via Supabase)
- Git

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd doc-sign-app
```

#### 2. Setup Frontend
```bash
cd client
npm install
cp .env.example .env.local
```

#### 3. Setup Backend
```bash
cd ../server
npm install
cp .env.example .env
```

#### 4. Configure Environment Variables

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`.env`):
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
NODE_ENV=development
```

#### 5. Database Setup
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

#### 6. Run Development Servers

**Terminal 1 - Frontend**:
```bash
cd client
npm run dev
```

**Terminal 2 - Backend**:
```bash
cd server
npm run dev
```

Visit `http://localhost:3000` for frontend and `http://localhost:3001` for backend API.

---

## 📁 Project Structure

```
doc-sign-app/
├── client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                    # App router pages
│   │   │   ├── login/              # Authentication UI
│   │   │   ├── register/           # User registration
│   │   │   ├── dashboard/          # Main hub
│   │   │   ├── upload-document/    # Document upload
│   │   │   ├── sign/[token]/       # Signing interface
│   │   │   ├── workspace/[id]/     # Collaboration space
│   │   │   ├── audit/[id]/         # Audit log viewer
│   │   │   └── api/auth/           # Auth endpoints
│   │   ├── components/             # Reusable React components
│   │   ├── context/                # React Context (AuthContext)
│   │   ├── config/                 # API configuration
│   │   ├── types/                  # TypeScript types
│   │   └── globals.css             # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── tailwind.config.ts
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── config/
│   │   │   ├── db.js               # Database connection
│   │   │   └── supabase.js         # Supabase initialization
│   │   ├── controllers/
│   │   │   ├── authController.js   # Auth logic
│   │   │   └── documentController.js
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   └── upload.js           # File upload handling
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Auth endpoints
│   │   │   └── documentRoutes.js   # Document endpoints
│   │   ├── services/
│   │   │   ├── authService.js      # Business logic
│   │   │   └── emailService.js     # Notifications
│   │   └── prisma/
│   │       └── schema.prisma       # Database schema
│   ├── package.json
│   └── .env
│
└── README.md                        # Project documentation
```

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing with 10+ salt rounds
- Secure password reset with token expiration

✅ **Authentication & Authorization**
- JWT-based stateless authentication
- Secure HTTP-only cookies
- Role-based access control

✅ **Data Protection**
- HTTPS/TLS encryption in transit
- Database encryption at rest (Supabase)
- SQL injection prevention via Prisma ORM

✅ **Audit & Compliance**
- Immutable audit logs with IP tracking
- User action history
- Document state versioning

✅ **Input Validation**
- Express-validator sanitization
- Type checking with TypeScript
- File type validation

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/logout` | Clear session |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload new document |
| GET | `/api/documents` | List user documents |
| GET | `/api/documents/:id` | Get document details |
| PUT | `/api/documents/:id/status` | Update status |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/:id/sign` | Add signature |
| GET | `/api/documents/:id/audit` | View audit trail |

---

## 🎨 Key Components & Features

### Frontend Components
- **AuthContext**: Global authentication state management
- **Navbar**: Navigation with user profile
- **Footer**: Consistent site footer
- **PDF Viewer**: Multi-page document rendering
- **Signature Canvas**: Real-time signature capture
- **Draggable Signature**: Positioning with react-rnd

### Backend Services
- **AuthService**: Login, registration, password reset
- **DocumentService**: Upload, retrieval, status updates
- **SignatureService**: Multi-page signature positioning
- **EmailService**: Async notification delivery
- **AuditService**: Immutable event logging

---

## 🧪 Testing & Quality

- **ESLint**: Code style enforcement
- **TypeScript**: Type safety across frontend
- **Prisma Studio**: Database inspection
- **Postman Ready**: API documentation

---

## 📈 Performance Optimizations

✨ **Frontend**
- Next.js server-side rendering (SSR)
- Automatic code splitting
- Image optimization
- Static generation where applicable

⚡ **Backend**
- Connection pooling (Prisma)
- Database query optimization
- Response caching headers
- Efficient pagination

🚀 **Deployment**
- Vercel Edge Network (Frontend)
- Render Node.js optimization (Backend)
- Database indexing on frequently queried fields

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Vercel auto-detects Next.js projects
vercel deploy
```

### Backend (Render)
```bash
# Push to GitHub, connect Render
# Auto-deploys on git push
```

### Environment Configuration
Set all required environment variables in respective platform dashboards before deploying.

---

## 🔄 CI/CD Pipeline Ready

- Automated testing support
- Pre-deployment validation
- Zero-downtime deployments
- Environment isolation (dev/staging/prod)

---

## 📚 Documentation

- See [Client README](./client/README.md) for frontend details
- See [Server README](./server/README.md) for backend details
- API documentation available via Postman collection

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: [Your Email]
- Documentation: [Your Docs URL]

---

<div align="center">

### ⭐ If you find this project helpful, please star it!

Made with ❤️ by Saurabh Pandey

**Production URL**: https://doc-sign-app-gamma.vercel.app  
**API URL**: https://doc-sign-app-api.onrender.com

</div>
