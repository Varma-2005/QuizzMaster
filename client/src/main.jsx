import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout & Context
import RootLayout from '../components/RootLayout.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { QuizProvider } from './contexts/QuizContext.jsx'
import ProtectedRoute from '../components/Auth/ProtectedRoute.jsx'

// Pages
import Home from './pages/Home.jsx'
import Login from '../components/Auth/Login.jsx'
import Register from '../components/Auth/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import QuizSelection from './pages/QuizSelection.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import AllQuizzes from '../components/DashBoard/AllQuizes.jsx'

const browserRouterObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: "quiz-selection",
        element: (
          <ProtectedRoute>
            <QuizSelection />
          </ProtectedRoute>
        )
      },
      {
        path: "quiz/:quizId",
        element: (
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        )
      },
      {
        path: "results/:resultId",
        element: (
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        )
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <AllQuizzes />
          </ProtectedRoute>
        )
      }
    ]
  }
], {
  future: {
    v7_relativeSplatPath: true,
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QuizProvider>
        <RouterProvider router={browserRouterObj} future={{
          v7_startTransition: true,
        }} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QuizProvider>
    </AuthProvider>
  </StrictMode>,
)