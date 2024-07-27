import React, { useState } from 'react'
import './App.css'
import UserRoutes from './routes/UserRoutes'
import { ThemeProvider } from "@/components/theme-provider"



function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserRoutes />
    </ThemeProvider>
  )
}

export default App
