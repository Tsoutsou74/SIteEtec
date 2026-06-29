import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import HomPages from './pages/HomPages';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      {/* Tes routes ou ta page principale ici */}
      {/*<HomPages />*/}
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;