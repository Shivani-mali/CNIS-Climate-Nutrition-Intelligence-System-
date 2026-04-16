import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './config/i18n';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import RoleSelection from './pages/RoleSelection';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ScreeningPage from './pages/ScreeningPage';
import ReportsPage from './pages/ReportsPage';
import ChatbotPage from './pages/ChatbotPage';
import DosesPage from './pages/DosesPage';
import DietPlanPage from './pages/DietPlanPage';
import AnalyticsPage from './pages/AnalyticsPage';

import logo from './assets/logo.png';

function AppContent({ showSplash, onSplashFinish }) {
  const { user, role, loading } = useAuth();

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onFinish={onSplashFinish} />;
  }

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-clinical">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex flex-col items-center justify-center animate-pulse overflow-hidden">
             <img src={logo} alt="Loading..." className="w-full h-full object-contain p-2" />
          </div>
          <p className="text-white/80 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginPage />;
  }

  // No role selected
  if (!role) {
    return <RoleSelection />;
  }

  // Main app
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/screening" element={<ScreeningPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/doses" element={<DosesPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/diet-plan" element={<DietPlanPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <AuthProvider>
      <AppContent showSplash={showSplash} onSplashFinish={handleSplashFinish} />
    </AuthProvider>
  );
}
