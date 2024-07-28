import React, { useState } from 'react'
import './App.css'
import UserRoutes from './routes/UserRoutes'
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={clientId}>
        <UserRoutes />
      </GoogleOAuthProvider >
    </ThemeProvider>
  )
}

export default App
