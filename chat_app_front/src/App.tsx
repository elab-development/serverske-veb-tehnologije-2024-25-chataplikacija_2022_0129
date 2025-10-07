import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import Home from './pages/Home'
import Login from './pages/auth/login'
import { ProtectedRoute } from './routes/protected-route'
import Register from './pages/auth/register'
import { AuthProvider } from './context/auth-provider'
import { ConversationsProvider } from './context/conversations-provider'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ConversationsProvider>
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
              <Route path="/conversations/:conversationId?" element={
                <Home />
              } />
            </Routes>
          </ConversationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
