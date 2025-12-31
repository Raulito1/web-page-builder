import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DndContext, closestCorners } from '@dnd-kit/core';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <DndContext collisionDetection={closestCorners}>
        <App />
      </DndContext>
    </ThemeProvider>
  </StrictMode>,
)
