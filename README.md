# 📊 Premium Job Application Tracker & Dev Dashboard

Welcome to the **Job Application Tracker**—a premium, fully custom-themed developer application designed to streamline job hunting, pipeline tracking, and career preparation. It features a complete React frontend integrated with a Node.js + Express + MongoDB backend and is powered by a custom Llama AI Career Assistant.

---

## 🚀 Key Features (What Makes This Project Premium)
- **Advanced State Management**: Built using unified Contexts and structured Axios interceptors to automatically append JWT security headers and handle session expirations (`401/403` redirects) seamlessly.
- **Developer Aesthetics**: Designed with a sleek, dark mode theme throughout (no light mode fallback) utilizing HSL-curated color codes (`#0a0a0f` background, `#0d0d18` sidebars), customized smooth scrollbars, glow filters, and slide-up micro-animations.
- **Dynamic Dashboard**: Responsive 6-grid analytics cards tracking pipeline metrics (`Total Applied`, `Interviews`, `Shortlisted`, `Offers`, `Rejected`, `Pending`) mapped with a progress-bar funnel chart.
- **AI Career Coach**: Interactive assistant page integrated with the **Groq SDK (Llama-3.3-70b-versatile)** that dynamically context-injects the developer's experience, active applications, and skill sets to draft cover letters, simulate mock interviews, and structure salary negotiations.
- **Modular Architecture**: Separate Frontend (Vite, Tailwind v4) and Backend modules ensuring high portability and scalability.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Tailwind CSS v4, React Router DOM, Axios, Lucide/Inline SVGs.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose ODM, JWT (JsonWebToken), Bcrypt (Password Hashing), Groq SDK.

---

## 📋 API Routes & Endpoints Reference

### 🔐 Authentication & User Profile Routes (`/api/user`)
| Method | Endpoint | Auth Required | Request Payload | Description / Output |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/create` | No | `{ username, email, password }` | Registers a new user, hashes password via bcrypt, creates DB entry, and returns JWT. |
| **POST** | `/login` | No | `{ email, password }` | Authenticates email/password, sets cookie `userToken` and returns JWT token + user details. |
| **GET** | `/getprofile` | **Yes** | *Bearer Token Header* | Retrieves profile parameters (`username`, `skills`, `expectedSalary`, `experience`, `location`). |
| **PUT** | `/update` | **Yes** | `{ phone, location, expectedSalary, skills[], experience }` | Validates phone length and updates user's preference variables in database. |
| **GET** | `/logout` | No | *None* | Clears `userToken` authentication cookies and logs out. |

### 📋 Job Applications Tracker Routes (`/api/application`)
| Method | Endpoint | Auth Required | Request Payload / Params | Description / Output |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/create` | **Yes** | `{ companyName, jobRole, location, expectedSalary, appliedStatus, notes }` | Adds a new application to the database mapped to the authenticated user ID. |
| **PUT** | `/update/:id` | **Yes** | `{ companyName, jobRole, location, appliedStatus, notes }` (Pass `:id` as parameter) | Updates details of an existing application by database object ID. |
| **GET** | `/getall` | **Yes** | Query params: `?status=...&search=...` (optional) | Retrieves user's applications sorted by most recent first. Supports query search. |
| **GET** | `/recent` | **Yes** | *None* | Returns the top 5 most recently created applications. |
| **DELETE**| `/delete/:id` | **Yes** | Pass database `:id` as URL parameter | Permanently deletes a job application track from the user's database. |
| **GET** | `/count` | **Yes** | *None* | Aggregates applications counts by status utilizing Mongoose `$group` pipeline queries. |

### 🤖 AI Coach Assistant Routes (`/api/ai`)
| Method | Endpoint | Auth Required | Request Payload | Description / Output |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/response` | **Yes** | `{ message }` | Connects to **Llama-3.3-70b-versatile** on Groq, injects the user's resume properties as context, and returns Hinglish career suggestions. |

---

## ⚙️ Project Setup & Installation

### 1. Database & Backend Setup
1. Clone the repository and navigate to `/Backend`.
2. Create your `.env` file:
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
   MONGO_URI=mongodb_xxxxxxxxxxxxxxxxxxxx
   APP_NAME=APPLCATION_NAME
   JWT_SECRET=jwt_xxxxxxxxxxxxxxxxxxxx
   JWT_EXPIRES=EXPIRES_TIME
   LOCAL_PORT=3000
   LIVE_PORT=3000
   FRONTEND_LIVE_URL=http://localhost:5173
   FRONTEND_LOCAL_URL=http://localhost:5173
   ```
3. Boot the server:
   ```bash
   npm install
   npx nodemon
   ```

### 2. Frontend Setup
1. Navigate to `/Frontend`.
2. Create your `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_LOCAL_API_URL=http://localhost:3000/api
   ```
3. Boot development server:
   ```bash
   npm install
   npm run dev
   ```

---

## 🌐 Live Deployment Configurations (URLs Setup)

> [!IMPORTANT]
> Jab aap is application ko live production environment par host karenge, toh security CORS aur API endpoints ko connect karne ke liye niche diye gaye environment variables ko hosted cloud dashboards (e.g. Render, Vercel) par customize karein. Humne in live configurations ko comments mein add kiya hai:

### Frontend Live Env Variable (`Frontend/.env` ya hosted variables settings)
```bash
# =========================================================================

# # Live Backend URL
# VITE_API_URL=https://my-backend-url.onrender.com/api
# =========================================================================
```

### Backend Live Env Variables (`Backend/.env` ya hosted server settings)
```bash
# =========================================================================

# # Live Frontend URL
  FRONTEND_LIVE_URL=https://ai-job-tracker-mu.vercel.app
#
# # Production Port
# LIVE_PORT=3000
# =========================================================================
```
