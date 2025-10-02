
# ThreadGems

A modern React application that curates and displays design-focused threads from Meta's Threads platform. Features OAuth authentication, real-time data fetching, and a cost-optimized architecture perfect for scaling.

## 🚀 Architecture Overview

**ThreadGems** uses a **secure, user-centric approach**:

1. **OAuth Authentication** - Users log in with their Threads accounts
2. **Python FastAPI Server** - Handles OAuth flow and API requests securely
3. **Firebase Storage** - User data and token management
4. **React Frontend** - Modern UI with real-time authentication
5. **Meta Threads API** - Official API integration with user authorization

### 💡 **Key Benefits:**
- **🔐 Secure OAuth** - Users control their own data access
- **⚡ Real-time Data** - Fresh content directly from user's Threads
- **💰 Cost Optimized** - Efficient API usage and caching
- **🎯 Personalized** - Each user sees content based on their authorization

## ✨ Features

- **🔐 OAuth Authentication** - Secure login with Threads accounts
- **🎨 Design-Focused Content** - Curated threads from design accounts
- **👤 User Profiles** - Access your own Threads data
- **⚡ High Performance** - Optimized loading with TanStack Query
- **📱 Responsive Design** - Modern UI built with shadcn/ui and Tailwind CSS
- **🔍 Advanced Filtering** - Filter by content type and user preferences
- **🛡️ Security First** - HttpOnly cookies, CSRF protection, secure token storage
- **⚖️ Legal Compliance** - Privacy Policy and Terms of Use for Meta API approval

## 🛠️ Tech Stack

### Frontend
- **Vite** + **React 18** + **TypeScript**
- **shadcn/ui** - Modern UI components built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and state management
- **React Router** - Client-side routing

### Backend & Data
- **Python FastAPI** - OAuth server and API proxy
- **Firebase Firestore** - User data and token storage (free tier)
- **Meta Threads API** - Official API with OAuth integration
- **Secure Authentication** - HttpOnly cookies and CSRF protection

### Deployment
- **Netlify** - Frontend hosting with global CDN (free tier)
- **Railway/Heroku** - Python FastAPI server hosting
- **Firebase** - Authentication and user data management

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - For React app development
- **Python 3.8+** - For OAuth server
- **Firebase Project** with Firestore enabled (free tier)
- **Meta Threads Developer App** with OAuth configured
- **Netlify Account** (free tier for frontend deployment)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/threadgems.git
cd threadgems

# Install React dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Meta Threads App Setup

1. Create a [Meta Developer App](https://developers.facebook.com/apps/)
2. Add **Threads API** product
3. Configure **OAuth Redirect URIs**:
   ```
   http://localhost:8080/auth/callback
   https://threadgems.com/auth/callback
   ```
4. Get your **App ID** and **App Secret**

### 3. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Meta Threads OAuth (Python backend - secure)
THREADS_CLIENT_ID=your_app_id
THREADS_CLIENT_SECRET=your_app_secret

# Frontend OAuth Configuration (safe for client)
VITE_THREADS_REDIRECT_URI=http://localhost:8080/auth/callback
VITE_THREADS_AUTH_BASE_URL=https://threads.net

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_PATH=./firebase-admin-key.json
```

### 4. Firebase Setup

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable **Firestore Database** (free tier)
3. Generate **Admin SDK private key**:
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Save as `firebase-admin-key.json` in project root
4. Add `firebase-admin-key.json` to `.gitignore`

### 5. Development

Start both the frontend and backend servers:

```bash
# Terminal 1: Start React frontend
npm run dev

# Terminal 2: Start Python OAuth server
python3 oauth_server.py
```

Visit `http://localhost:8080`

### 6. OAuth Flow Testing

1. Click **"Login with Threads"** button
2. Authorize the app on Threads
3. Get redirected back with authentication
4. Access your Threads data securely

### 7. Build & Deploy

**Frontend (Netlify):**
```bash
# Build the React app
npm run build

# Deploy to Netlify (drag & drop the dist/ folder)
# Or connect your Git repo for automatic deployments
```

**Backend (Railway/Heroku):**
```bash
# Deploy Python FastAPI server
# Set environment variables for production
# Update CORS origins for production domain
```

## 🔄 **OAuth Workflow**

**User Authentication Flow:**

1. **User clicks "Login"** → Redirected to Threads OAuth
2. **User authorizes app** → Threads redirects back with code
3. **Backend exchanges code** → Receives access token
4. **Token stored securely** → HttpOnly cookies + Firebase
5. **User authenticated** → Can access their Threads data

**Security Features:**
- **CSRF Protection** - State parameter validation
- **HttpOnly Cookies** - Tokens not accessible via JavaScript
- **Secure Storage** - Firebase for user data management
- **Token Validation** - Regular token health checks

**Cost Breakdown:**
- **Meta Threads API**: Free tier (generous limits)
- **Firebase**: Free tier (user data storage)
- **Netlify**: Free tier (frontend hosting)
- **Railway/Heroku**: Free or $5/month (backend hosting)

## 📁 Project Structure

```
├── src/                   # React app source
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── ThreadCard.tsx # Thread display component
│   │   ├── Header.tsx    # App header
│   │   └── Footer.tsx    # App footer with legal links
│   ├── pages/            # Route components
│   │   ├── Index.tsx     # Main threads feed
│   │   ├── Privacy.tsx   # Privacy Policy (Meta compliance)
│   │   └── Terms.tsx     # Terms of Use (Meta compliance)
│   ├── services/         # Data services
│   │   └── staticThreads.ts # Static JSON consumption
│   ├── hooks/            # Custom React hooks
│   │   └── useThreads.ts # Thread data fetching hooks
│   ├── types/            # TypeScript definitions
│   │   └── threads.ts    # Thread and API types
│   └── lib/              # Utilities
│       └── utils.ts      # Helper functions
├── public/               # Static assets
│   ├── images/          # App images, favicon, assets
│   └── _redirects       # Netlify SPA routing
├── oauth_server.py      # 🐍 Python OAuth server (FastAPI)
├── update_data.py       # 🐍 Legacy data updater script
├── requirements.txt     # Python dependencies
├── netlify.toml        # Netlify configuration
├── firebase-admin-key.json # 🔑 Firebase service account key (gitignored)
└── CLAUDE.md           # AI development guide
```

## 🔄 Data Flow

**OAuth Authentication:**
1. **User Login** → Redirect to Threads OAuth
2. **Authorization** → User grants permissions
3. **Token Exchange** → Backend exchanges code for token
4. **Secure Storage** → Token stored in HttpOnly cookies + Firebase

**Data Access:**
1. **Authenticated Requests** → Frontend calls backend APIs
2. **Token Validation** → Backend verifies user tokens
3. **API Proxy** → Backend fetches data from Threads API
4. **Response** → Data returned to frontend securely

## 📊 Performance Benefits

- **🔐 Secure by Design** - No tokens exposed to client
- **⚡ Real-time Data** - Fresh content from user's authorization
- **💰 Efficient API Usage** - Smart caching and request optimization
- **🌍 Global CDN** - Frontend served via Netlify CDN
- **📱 Responsive UX** - Loading states and error handling

## 🛡️ Security & Privacy

- **OAuth 2.0** - Industry standard authentication
- **CSRF Protection** - State parameter validation
- **HttpOnly Cookies** - Prevents XSS token theft
- **Token Rotation** - Regular token health checks
- **User Control** - Users can revoke access anytime

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect Repository**:
   - Link your GitHub repo to Netlify
   - Or drag & drop the `dist/` folder

2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18`

3. **Environment Variables**:
   - Add all `VITE_*` variables from your `.env`

4. **Deploy**! 🎉

## 🔧 Available Scripts

**Frontend:**
- **`npm run dev`** - Start React development server
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint code linting

**Backend:**
- **`python3 oauth_server.py`** - Start OAuth server (port 8000)
- **`python3 update_data.py`** - Legacy data updater script

**Development:**
- **`npm run dev`** + **`python3 oauth_server.py`** - Full stack development

## 📄 Legal Pages

The app includes privacy policy and terms of use pages required for Meta API approval:
- `/privacy` - Privacy Policy with data handling details
- `/terms` - Terms of Use with service guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

Created by [Frantz Studio](http://frantzstudio.com)

For questions or support:
- Create an issue on GitHub
- Visit [Frantz Studio](http://frantzstudio.com) for contact info

## 📜 License

This project is private and proprietary. All rights reserved.

---

**Built with ❤️ for the design community**