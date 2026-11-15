# To-Do List Mobile App (MERN Stack Assignment)

A responsive, mobile-first To-Do List application built for the **SDE-1 (MERN Stack) Assignment**.

Organizes tasks by weekly calendar cycles (**Monday to Sunday**) and visually displays progress with open and completed task counters, swipe-to-delete gestures, full-text keyword search, and responsive mobile UI designed according to the assignment specification and Figma wireframes.

---

## 🌟 Key Features & Requirements Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Weekly Organization** | Tasks are automatically grouped by week starting on **Monday** and ending on **Sunday**. | ✅ Complete |
| **Task Summary Cards** | Each week card displays **Number of Open Tasks**, **Number of Completed Tasks**, and a progress bar. | ✅ Complete |
| **Card Expansion** | Clicking/tapping any week card expands it to reveal all scheduled tasks for that week. | ✅ Complete |
| **Create Task** | Modal form with **Title** (mandatory), **Date & Time** (mandatory), **Description** (optional), and **Priority** (`Low`, `Medium`, `High`). | ✅ Complete |
| **Edit Task** | Select any task to modify any attribute (Title, Description, Date & Time, Priority, Status). | ✅ Complete |
| **Delete Task (Swipe Left)** | Swipe left on any task item to reveal a red **Delete** action button, with tap-to-delete confirmation. | ✅ Complete |
| **Search Task** | Real-time search by keywords across Title and Description, with inline options to view, edit, or delete tasks. | ✅ Complete |
| **Task Status Update** | Toggle tasks between **In Progress** and **Completed** with instant visual updates to the week summary counters. | ✅ Complete |
| **Mobile UI & Responsive Design** | Mobile-first design using Tailwind CSS, featuring an interactive phone preview on desktop and full responsive layout on mobile devices. | ✅ Complete |
| **Dual Storage Resilience** | Connects to **MongoDB** via Mongoose, with automatic fallback to in-memory store so the app runs immediately even without local MongoDB. | ✅ Complete |

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ODM), CORS, Dotenv
- **Deployment Ready**: Netlify (`netlify.toml` included) & single-command production server

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- *(Optional)* MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & Navigate
```bash
cd todo-list-app
```

### 2. Install All Dependencies
```bash
# Installs root, backend, and frontend packages
npm run install:all
```
*(Or install separately: `cd backend && npm install && cd ../frontend && npm install`)*

### 3. Configure Environment Variables (Optional)
In `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
```
> **Note**: If MongoDB is not running, the application automatically uses an in-memory/localStorage fallback seeded with sample tasks across current, previous, and next weeks!

### 4. Run Development Servers
From the root folder:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks/weekly` | Retrieve tasks grouped by Monday–Sunday weeks with open/completed counts |
| `GET` | `/api/tasks/search?q=keyword` | Search tasks by keywords in title and description |
| `GET` | `/api/tasks` | Get all tasks sorted by date & time |
| `GET` | `/api/tasks/:id` | Get details of a single task |
| `POST` | `/api/tasks` | Create task (`title` and `dateTime` mandatory) |
| `PUT` | `/api/tasks/:id` | Update task details |
| `PATCH`| `/api/tasks/:id/status` | Quick toggle task status (`In Progress` or `Completed`) |
| `DELETE`| `/api/tasks/:id` | Remove a task |
| `GET` | `/api/health` | Health check endpoint |

### Example Request (Create Task)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Prepare Sprint Presentation",
    "description": "Finalize slide deck and live demo",
    "dateTime": "2026-11-16T15:30:00.000Z",
    "priority": "High"
  }'
```

---

## 🌐 Deployment Instructions

### Deploying Frontend to Netlify
1. Connect your GitHub repository to [Netlify](https://www.netlify.com).
2. Set build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Set environment variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://your-api.onrender.com/api`)
4. Click **Deploy**. Netlify will use the included `netlify.toml` for Single Page App routing!

### Deploying Backend to Render / Railway
1. Set root or base directory to `backend`.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Environment variable: `MONGODB_URI` (your MongoDB Atlas connection string).

---

## 📱 Mobile Gestures & Features
- **Swipe Left on Task**: Drag or swipe a task item left to reveal the red **Delete** button.
- **Card Expansion**: Tap any weekly card header to expand or collapse its tasks.
- **Desktop Device Frame**: Tap the mobile/desktop icon in the top header to toggle between an iPhone-style mockup frame and a wider desktop view.
