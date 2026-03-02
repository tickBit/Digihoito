import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthProvider';

import MainPage from './Components/MainPage';
import Register from './Components/Register';
import Login from './Components/Login';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>,
)
