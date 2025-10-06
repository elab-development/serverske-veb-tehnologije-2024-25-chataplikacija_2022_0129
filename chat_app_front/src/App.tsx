import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import Home from './pages/Home'
import Login from './pages/auth/login'
import { ProtectedRoute } from './routes/protected-route'
import Register from './pages/auth/register'
import { AuthProvider } from './context/auth-provider'

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
              } />
            <Route path="/login" element={
              <Login canResetPassword={true} />
              } />
            <Route path='/register' element={
              <Register />
            }/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
