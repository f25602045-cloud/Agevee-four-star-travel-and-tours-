
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-secondary text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Discover the beauty of Gilgit-Baltistan. <br/>
              Connecting you with the best hotels, guides, and agencies in the North.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-brand-dark p-2 rounded-full hover:bg-brand-primary hover:text-brand-dark transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-brand-dark p-2 rounded-full hover:bg-brand-primary hover:text-brand-dark transition-colors"><Twitter size={20} /></a>
              <a href="#" className="bg-brand-dark p-2 rounded-full hover:bg-brand-primary hover:text-brand-dark transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#/explore" className="hover:text-brand-primary transition flex items-center gap-2"><span className="text-brand-primary">›</span> Destinations</a></li>
              <li><a href="#/search" className="hover:text-brand-primary transition flex items-center gap-2"><span className="text-brand-primary">›</span> Find Hotels</a></li>
              <li><a href="#/search" className="hover:text-brand-primary transition flex items-center gap-2"><span className="text-brand-primary">›</span> Tour Guides</a></li>
              <li><a href="#/register" className="hover:text-brand-primary transition flex items-center gap-2"><span className="text-brand-primary">›</span> Register Business</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-brand-primary shrink-0 mt-1" />
                <span>Main Bazaar, Gilgit City & Skardu, Gilgit-Baltistan, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-brand-primary shrink-0" />
                <div>
                  <a href="tel:03492899537" className="hover:text-brand-primary transition block">0349 2899537</a>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><MessageCircle size={12} /> WhatsApp Available</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-brand-primary shrink-0" />
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=mtatheer333@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-primary transition"
                  title="Open in Gmail"
                >
                  mtatheer333@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Agevee Four Star. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
