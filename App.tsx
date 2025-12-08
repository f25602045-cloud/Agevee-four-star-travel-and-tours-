
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Search } from './pages/Search';
import { Register } from './pages/Register';
import { AlertBanner } from './components/AlertBanner';
import { FloatingWidget } from './components/FloatingWidget';
import { ChatWidget } from './components/ChatWidget';
import { IntroScreen } from './components/IntroScreen';
import { CustomCursor } from './components/CustomCursor';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      <CustomCursor />
      {!hasEntered && <IntroScreen onOpen={() => setHasEntered(true)} />}
      
      {hasEntered && (
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-brand-primary selection:text-brand-dark animate-fade-in-up">
            <Header />
            <AlertBanner />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/search" element={<Search />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <FloatingWidget />
            <ChatWidget />
          </div>
        </HashRouter>
      )}
    </>
  );
}

export default App;
