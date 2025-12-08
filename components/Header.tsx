
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { Logo } from './Logo';
import { AuthService } from '../services/authService';
import { UserType } from '../types';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Districts', path: '/explore' },
    { name: 'Smart Search', path: '/search' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Listen for auth changes (simple custom event or poll)
    const checkAuth = () => {
        setCurrentUser(AuthService.getCurrentUser());
    };
    
    window.addEventListener('scroll', handleScroll);
    // Poll for auth changes since we don't have a context provider in this simplified structure
    const authInterval = setInterval(checkAuth, 1000);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(authInterval);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Header background logic
  const headerClass = scrolled 
    ? 'bg-brand-dark/90 backdrop-blur-xl border-b border-white/5 shadow-lg py-2' 
    : 'bg-transparent border-transparent py-4';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group ${
                    isActive(link.path)
                      ? 'text-brand-primary'
                      : 'text-gray-300 hover:text-brand-primary'
                  }`}
                >
                  {link.name}
                  {/* Hover Underline Animation */}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              ))}
              
              {/* Dynamic Auth Link */}
              {currentUser ? (
                  <Link 
                    to={currentUser.type === UserType.ADMIN ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 bg-brand-primary/10 border border-brand-primary text-brand-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-primary hover:text-brand-dark transition-all duration-300"
                  >
                     <UserIcon size={14} />
                     {currentUser.type === UserType.ADMIN ? "Admin Panel" : "My Dashboard"}
                  </Link>
              ) : (
                  <Link 
                    to="/register"
                    className="px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-[0.15em] text-gray-300 hover:text-brand-primary transition-colors"
                  >
                    Register / Login
                  </Link>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-brand-secondary/50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none border border-white/10"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark/95 border-b border-brand-secondary backdrop-blur-xl animate-fade-in-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest ${
                  isActive(link.path)
                    ? 'text-brand-primary bg-brand-secondary'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
             {currentUser ? (
                  <Link 
                    to={currentUser.type === UserType.ADMIN ? "/admin" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest text-brand-primary bg-brand-secondary/50 border border-brand-primary/20"
                  >
                     {currentUser.type === UserType.ADMIN ? "Admin Panel" : "My Dashboard"}
                  </Link>
              ) : (
                  <Link 
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest text-gray-300"
                  >
                    Register / Login
                  </Link>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};
