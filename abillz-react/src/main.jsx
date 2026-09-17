import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import './index.css'
import { CartProvider } from './contexts/CartProvider.jsx'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <ContextProvider>
      <CartProvider>
      <RouterProvider router={router} />
      </CartProvider>
      <ToastContainer />
    </ContextProvider>
  </StrictMode>
)
