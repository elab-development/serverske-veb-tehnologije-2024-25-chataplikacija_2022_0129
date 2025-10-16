import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/login'
import { ProtectedRoute } from './routes/protected-route'
import Register from './pages/auth/register'
import { AuthProvider } from './context/auth-provider'
import { ConversationsProvider } from './context/conversations-provider'
import { IsUserOnlineProvider } from './context/is-user-online-provider'
import { Toaster } from 'react-hot-toast'
import ResetPassword from './pages/auth/reset-password'
import ForgotPassword from './pages/auth/forgot-password'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ConversationsProvider>
            <IsUserOnlineProvider>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
                } />
              <Route path="/login" element={
                <Login canResetPassword={true} />
                } />
              <Route path='/register' element={
                <Register />
              }/>
              <Route path="/forgot-password" element={
                <ForgotPassword />
              } />
              <Route path="/reset-password" element={
                <ResetPassword />
              } />
              <Route path="/conversations/:conversationId?" element={
                <Home />
              } />
            </Routes>
            </IsUserOnlineProvider>
          </ConversationsProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster/>
    </>
  )
}

export default App
