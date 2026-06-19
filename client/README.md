# 🎨 DocSign Client - Modern React Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-16.2.7-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=for-the-badge&logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Live%20on%20Vercel-brightgreen?style=for-the-badge)

**A modern, responsive, and interactive document signing interface built with cutting-edge React technologies.**

[🌐 Live Demo](https://doc-sign-app.vercel.app) • [📖 Features](#-key-features) • [⚙️ Setup](#-installation) • [🏗️ Architecture](#-architecture)

---

</div>

## 📌 Overview

DocSign Client is a **production-ready, enterprise-grade frontend** for digital document signing. It combines modern React 19, Next.js 16, and TypeScript to deliver a seamless, type-safe user experience with interactive PDF viewing, signature capture, and document management.

### 🎯 Live Deployment
- **🚀 Hosted on**: Vercel (Optimal for Next.js)
- **⚡ CDN**: Global edge network for sub-100ms response times
- **🔒 HTTPS**: Automatic SSL/TLS encryption
- **🌍 Regions**: Multi-region deployment for low latency

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Register & Login**: Secure account creation with validation
- **Password Reset**: Token-based password recovery
- **Session Management**: Persistent sessions with HttpOnly cookies
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: User-specific document visibility

### 📄 Document Management
- **Upload**: Drag-and-drop PDF upload interface
- **Preview**: Multi-page PDF viewer with zoom & pan
- **Status Tracking**: PENDING → SIGNED → ARCHIVED lifecycle
- **Dashboard**: Centralized document hub
- **Search & Filter**: Quick document discovery

### ✍️ Advanced Signature Features
- **Canvas Signature**: Real-time drawing with smooth rendering
- **Drag & Drop**: Pixel-perfect signature positioning
- **Multi-Page**: Sign documents with 100+ pages
- **Undo/Redo**: Full signature editing capabilities
- **Real-Time Preview**: Instant visual feedback

### 👥 Collaboration
- **Multi-Signer**: Assign documents to multiple signers
- **Workspace**: Shared document workspaces
- **Notifications**: Real-time status updates
- **Audit View**: Complete action history with timestamps

### 📊 Dashboard Analytics
- **Stats Overview**: Document count, signed percentage
- **Recent Activity**: Latest document actions
- **User Management**: Profile and settings

### 🎨 User Experience
- **Responsive Design**: Mobile, tablet, desktop optimization
- **Dark Mode Ready**: Tailwind CSS supports light/dark themes
- **Smooth Animations**: Transitions and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliance focus
- **Loading States**: Skeleton screens and spinners

---

## 🏗️ Architecture

### Component Hierarchy
```
App (Next.js)
├── Layout
│   ├── Navbar
│   └── Footer
├── Pages (App Router)
│   ├── /login - Authentication
│   ├── /register - User registration
│   ├── /dashboard - Document hub
│   ├── /upload-document - Upload interface
│   ├── /sign/[token] - Signing interface
│   ├── /workspace/[id] - Collaboration
│   ├── /audit/[id] - Audit trail
│   └── /forgot-password - Password recovery
├── Components (Reusable)
│   ├── AuthContext Provider
│   ├── PDF Viewer
│   ├── Signature Canvas
│   ├── Document List
│   └── Status Badge
└── Services
    ├── API Client
    └── Authentication
```

### Data Flow
```
User Action
    ↓
Component State (React Hooks)
    ↓
API Call (Next.js API Routes/Backend)
    ↓
Database Update
    ↓
Response → Context/State Update
    ↓
UI Re-render (React 19 Automatic Batching)
```

---

## 🛠️ Tech Stack Deep Dive

### Core Framework
| Tech | Version | Why |
|------|---------|-----|
| **Next.js** | 16.2.7 | Server-side rendering, API routes, automatic optimization |
| **React** | 19.2.4 | Component-based UI, hooks, automatic batching |
| **TypeScript** | 5.x | Type safety, IDE autocomplete, refactoring confidence |

### Styling & UI
| Tech | Version | Why |
|------|---------|-----|
| **Tailwind CSS** | 4 | Utility-first, fast development, consistent design system |
| **Lucide React** | 1.17.0 | 500+ beautiful SVG icons, tree-shakeable |
| **PostCSS** | Latest | CSS-in-JS, autoprefixing, vendor support |

### Document Handling
| Tech | Version | Why |
|------|---------|-----|
| **React PDF** | 10.4.1 | Native PDF.js rendering, multi-page support |
| **React Signature Canvas** | 1.1.0-alpha | Smooth HTML5 canvas drawing, pressure sensitivity |
| **React RnD** | 10.5.3 | Drag-and-drop, resizable components, touch support |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9 | Code quality, style consistency, bug prevention |
| **@types/react** | 19 | TypeScript definitions for React |
| **@types/node** | 20 | Node.js type definitions |
| **@tailwindcss/postcss** | 4 | Tailwind CSS integration |

---

## 📁 Directory Structure

```
client/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── globals.css               # Global styles
│   │   ├── page.tsx                  # Home page
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── cookie/route.ts   # Cookie-based auth
│   │   │       └── logout/route.ts   # Logout endpoint
│   │   ├── login/                    # 📝 Login page
│   │   ├── register/                 # 📝 Registration page
│   │   ├── dashboard/                # 📊 Main dashboard
│   │   ├── upload-document/          # 📤 Upload interface
│   │   ├── sign/[token]/             # ✍️ Signing interface
│   │   ├── workspace/[id]/           # 👥 Collaboration space
│   │   ├── audit/[id]/               # 📋 Audit trail viewer
│   │   ├── forgot-password/          # 🔐 Password recovery
│   │   └── reset-password/[token]/   # 🔄 Reset interface
│   ├── components/
│   │   ├── Navbar.tsx                # Navigation bar
│   │   └── Footer.tsx                # Site footer
│   ├── context/
│   │   └── AuthContext.tsx           # Global auth state (React Context)
│   ├── config/
│   │   └── api.ts                    # API client configuration
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   └── public/                       # Static assets
│       ├── favicon.ico
│       ├── images/
│       └── fonts/
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS plugins
├── tailwind.config.js                # Tailwind CSS config
├── eslint.config.mjs                 # ESLint rules
└── next-env.d.ts                     # Next.js TypeScript definitions
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.17+ (LTS recommended)
- npm 10+ or yarn/pnpm
- Git

### Step 1: Clone & Navigate
```bash
git clone <repository-url>
cd doc-sign-app/client
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Configuration
```bash
cp .env.example .env.local
```

**`.env.local`** configuration:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# For Production (Vercel)
# NEXT_PUBLIC_API_URL=https://api.docsign.app
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production
```bash
npm run build
npm start
```

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build optimization |
| `npm start` | Run production server |
| `npm run lint` | Check code quality with ESLint |

---

## 🎨 Page Routes & Features

### `/` - Home
- Landing page with feature showcase
- Call-to-action for login/register

### `/login` - Login
- Email & password authentication
- "Forgot Password" link
- Registration redirect

### `/register` - Register
- Account creation form
- Email validation
- Password strength indicator

### `/dashboard` - Main Hub
- **Document List**: All user documents
- **Recent Activity**: Latest signatures
- **Statistics**: Signed/pending counts
- **Quick Actions**: Upload, create, share

### `/upload-document` - Upload
- **Drag & Drop**: Files or click to browse
- **Preview**: PDF preview before upload
- **Metadata**: Title, description, tags
- **Validation**: File type and size checks

### `/sign/[token]` - Signing Interface
- **PDF Viewer**: Multi-page document view
- **Signature Canvas**: Real-time drawing
- **Positioning**: Drag signature to location
- **Page Navigation**: Jump to any page
- **Sign Button**: Submit signature

### `/workspace/[id]` - Collaboration
- **Shared Access**: Multiple users
- **Real-Time Updates**: Live status changes
- **Comments**: Annotation support
- **Version History**: Track changes

### `/audit/[id]` - Audit Trail
- **Immutable Log**: Complete action history
- **Filters**: By user, date, action
- **Details**: IP, timestamp, user info
- **Export**: Download audit report

### `/forgot-password` - Password Recovery
- **Email Input**: Verify account
- **Reset Link**: Sent to inbox
- **Token Validation**: Expiration checking

### `/reset-password/[token]` - Reset
- **New Password**: Secure input with requirements
- **Confirmation**: Password match validation
- **Success**: Redirect to login

---

## 🔐 Authentication Flow

```
User Input (Login/Register)
         ↓
Client Validation (TypeScript types)
         ↓
API Request to Backend
         ↓
Backend Verification
         ↓
JWT Token + Refresh Token
         ↓
AuthContext Updated
         ↓
HttpOnly Cookie Set
         ↓
Protected Routes Accessible
         ↓
Automatic Session Recovery on Page Reload
```

---

## 🎯 Key Components

### AuthContext Provider
```typescript
// Global state management
- currentUser: User object
- isAuthenticated: boolean
- loading: boolean
- login(email, password)
- register(data)
- logout()
- resetPassword(email)
```

### PDF Viewer Component
```typescript
// Multi-page PDF rendering
- render(file)
- zoom(level)
- nextPage() / prevPage()
- goToPage(number)
- getCurrentPageNumber()
```

### Signature Canvas Component
```typescript
// Interactive drawing
- startDrawing(x, y)
- draw(x, y)
- endDrawing()
- clear()
- getSignatureData() → base64
- undo() / redo()
```

---

## 🌐 Deployment to Vercel

### Prerequisites
- GitHub account with repository push access
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
- Visit [vercel.com](https://vercel.com)
- Click "Import Project"
- Select GitHub repository
- Vercel auto-detects Next.js configuration

3. **Configure Environment**
```
NEXT_PUBLIC_API_URL = https://your-backend-api.onrender.com
```

4. **Deploy**
- Vercel automatically builds and deploys
- Automatic deployments on git push to main
- Preview deployments for pull requests

### Post-Deployment
- ✅ Auto HTTPS/SSL
- ✅ Global CDN
- ✅ Automatic optimization
- ✅ Real-time logs
- ✅ Performance analytics

---

## ⚡ Performance Optimizations

### Next.js Optimizations
- **Image Optimization**: Automatic WebP conversion
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages where applicable
- **Server-Side Rendering**: Dynamic content per request
- **Streaming**: Incremental static regeneration

### React 19 Features
- **Automatic Batching**: Multiple state updates batched
- **Concurrent Rendering**: UI responsiveness prioritization
- **Suspense**: Built-in loading states
- **Transitions**: Non-blocking updates

### Build Output
```bash
npm run build
# Generates:
# - .next/standalone (minimal production build)
# - .next/static (optimized assets)
# - public (static files)
```

---

## 🧪 Development Workflow

### Code Quality
```bash
npm run lint
# Checks for:
# - Unused variables
# - Improper types
# - Code style issues
```

### Hot Reload
- Edit files in `src/` → Instant browser refresh
- Preserves component state across reloads
- Error overlay for quick debugging

### TypeScript Support
```typescript
// Full IDE autocomplete
import { Document } from '@/types'

const doc: Document = {
  id: string,
  title: string,
  status: 'PENDING' | 'SIGNED' | 'REJECTED'
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Base styles for mobile
- `sm:`, `md:`, `lg:`, `xl:` prefixes for larger screens
- Touch-friendly buttons (48px min)
- Readable font sizes

---

## 🔗 API Integration

### Base URL
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL
// Development: http://localhost:3001
// Production: https://api.docsign.app
```

### Authenticated Requests
```typescript
// Automatically includes JWT token
const response = await fetch(`${API_URL}/documents`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Error Handling
```typescript
// Global error boundaries
try {
  const data = await fetchAPI(endpoint)
} catch (error) {
  // Redirect to login on 401
  // Show error toast on 4xx/5xx
  // Retry on network error
}
```

---

## 📊 Monitoring & Analytics

### Built-in Vercel Analytics
- **Web Vitals**: LCP, FID, CLS tracking
- **Performance**: Page load times
- **Errors**: Runtime errors captured
- **Usage**: Bandwidth, serverless function calls

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React PDF Library](https://react-pdf.org/)

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Kill process on port 3000
npx freeport 3000
# or manually specify different port
npm run dev -- -p 3001
```

### Issue: API connection refused
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS headers from backend

### Issue: PDF not rendering
- Verify file is valid PDF
- Check React PDF version compatibility
- Check browser console for errors

---

## 📞 Support

For issues or questions:
- Check [troubleshooting](#-troubleshooting) section
- Review browser console for errors
- Check Vercel dashboard for deployment issues
- Contact: [support email]

---

<div align="center">

### 🌟 Built with Modern Web Technologies

**Frontend Live**: https://doc-sign-app.vercel.app

Made with ❤️ for seamless document signing

</div>

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
