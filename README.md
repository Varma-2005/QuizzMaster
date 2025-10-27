# 🎓 QuizzMaster - AI-Powered Quiz Application

<div align="center">

![QuizzMaster](https://img.shields.io/badge/QuizzMaster-AI%20Quiz%20Platform-ff6b35?style=for-the-badge)

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

**An intelligent quiz platform with AI-powered question generation and real-time progress tracking**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Testing](#-api-testing) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 🤖 **AI Quiz Generation** - Unlimited quizzes using Google Gemini AI
- 📊 **Progress Tracking** - Monitor performance with detailed analytics
- 🎯 **Multiple Difficulty Levels** - Easy, Medium, and Hard questions
- ⚡ **Real-time Feedback** - Instant answer validation with explanations
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**AI Integration:** Google Gemini AI  
**Authentication:** JWT, bcryptjs

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- Google Gemini API key ([Get key](https://ai.google.dev/))

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/Varma-2005/QuizzMaster.git
cd QuizzMaster

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# 4. Setup environment variables (see below)

# 5. Start backend server
cd server
npm start

# 6. Start frontend (new terminal)
cd client
npm run dev

QuizzMaster/
│
├── client/                          # React Frontend Application
│   ├── public/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── assets/                 # Images, icons, static files
│   │   │
│   │   ├── common/                 # Shared components
│   │   │   ├── Button.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Timer.jsx
│   │   │
│   │   ├── components/             # Feature components
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.jsx
│   │   │   ├── pages/
│   │   │   │   ├── AllQuizzes.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── ProgressTracking.jsx
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   ├── QuizSelection.jsx
│   │   │   │   ├── Results.jsx
│   │   │   │   ├── StartQuiz.jsx
│   │   │   │   └── TakeQuiz.jsx
│   │   │   └── utils/
│   │   │       └── Api.js          # Axios configuration
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   │
│   │   ├── styles/
│   │   │   └── index.css           # Global styles + Tailwind
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── RootLayout.jsx          # Layout wrapper
│   │
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Node.js Backend Application
│   ├── APIs/                        # Route handlers
│   │   ├── dashboardApi.js         # Dashboard analytics
│   │   ├── geminiApi.js            # AI quiz generation
│   │   ├── quizApi.js              # Quiz CRUD operations
│   │   ├── quizResultApi.js        # Quiz submission & scoring
│   │   ├── subjectApi.js           # Subject management
│   │   └── userApi.js              # User auth & profile
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── quizModel.js
│   │   ├── quizResultModel.js
│   │   ├── subjectModel.js
│   │   ├── userModel.js
│   │   └── userProgressModel.js
│   │
│   ├── services/
│   │   └── geminiService.js        # Google Gemini AI integration
│   │
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── req.http                     # REST Client tests
│   └── server.js                    # Express server entry point
│
├── .gitignore
├── README.md
└── LICENSE
