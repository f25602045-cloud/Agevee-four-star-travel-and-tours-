
import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { BackendService } from '../services/backend';
import { Booking, User, UserType } from '../types';
import { Calendar, Package, MapPin, Loader2, LogOut, LayoutDashboard, Settings, CheckCircle, XCircle, Clock, Save, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // Data States
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BOOKINGS' | 'SETTINGS'>('OVERVIEW');

  // Form State for Settings
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/register');
      return;
    }
    setUser(currentUser);
    setEditForm({ name: currentUser.name, email: currentUser.email, password: currentUser.password || '' });
    fetchData(currentUser);
  }, [navigate]);

  const fetchData = async (currentUser: User) => {
    setLoading(true);
    
    // If Tourist -> Fetch "My Bookings"
    const outgoing = await BackendService.getUserBookings(currentUser.id);
    setMyBookings(outgoing);

    // If Business -> Fetch "Incoming Bookings"
    if (currentUser.type !== UserType.TOURIST) {
        const incoming = await BackendService.getBusinessBookings(currentUser.id);
        setIncomingBookings(incoming);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  const handleBookingAction = async (bookingId: string, action: 'CONFIRMED' | 'REJECTED' | 'CANCELLED') => {
      await BackendService.updateBookingStatus(bookingId, action);
      if (user) fetchData(user); // Refresh data
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setSaving(true);
      try {
          const updatedUser = { ...user, ...editForm };
          await AuthService.updateProfile(updatedUser);
          setUser(updatedUser);
          setSuccessMsg('Profile updated successfully.');
          setTimeout(() => setSuccessMsg(''), 3000);
      } catch (error) {
          console.error(error);
      } finally {
          setSaving(false);
      }
  };

  if (!user) return null;
  const isBusiness = user.type !== UserType.TOURIST && user.type !== UserType.ADMIN;

  // --- SUB-COMPONENTS ---

  const renderOverview = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Stats Cards */}
          <div className="bg-brand-secondary p-6 rounded-lg border border-gray-700">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Activity</h3>
              <div className="text-4xl font-bold text-white font-serif">
                  {isBusiness ? incomingBookings.length : myBookings.length}
              </div>
              <p className="text-sm text-gray-500 mt-2">{isBusiness ? 'Reservations Received' : 'Trips Planned'}</p>
          </div>

          <div className="bg-brand-secondary p-6 rounded-lg border border-gray-700">
               <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Account Status</h3>
               <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold uppercase text-sm">Active & Verified</span>
               </div>
               <p className="text-sm text-gray-500 mt-2">Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
          </div>

          {isBusiness && (
              <div className="bg-brand-secondary p-6 rounded-lg border border-gray-700">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Est. Revenue</h3>
                  <div className="text-4xl font-bold text-brand-primary font-serif">
                      ${incomingBookings.filter(b => b.status === 'CONFIRMED').reduce((acc, curr) => acc + curr.totalPrice, 0)}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">From confirmed bookings</p>
              </div>
          )}
      </div>
  );

  const renderBookings = () => (
      <div className="space-y-8 animate-fade-in-up">
          {/* TOURIST VIEW */}
          {!isBusiness && (
              <div className="bg-brand-secondary rounded-lg border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Package className="text-brand-primary" size={20} /> My Trips
                      </h2>
                  </div>
                  <div className="divide-y divide-gray-700">
                      {myBookings.length === 0 ? (
                          <div className="p-12 text-center text-gray-500">No bookings found. Time to explore!</div>
                      ) : myBookings.map(b => (
                          <div key={b.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition">
                              <div>
                                  <div className="flex items-center gap-3 mb-1">
                                      <h3 className="font-bold text-white text-lg">{b.listingName}</h3>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                          b.status === 'CONFIRMED' ? 'bg-green-900 text-green-400' : 
                                          b.status === 'CANCELLED' ? 'bg-red-900 text-red-400' :
                                          b.status === 'REJECTED' ? 'bg-red-900 text-red-400' :
                                          'bg-yellow-900 text-yellow-400'
                                      }`}>{b.status}</span>
                                  </div>
                                  <p className="text-sm text-gray-400">{b.details} • <span className="text-brand-primary font-bold">${b.totalPrice}</span></p>
                                  <p className="text-xs text-gray-600 mt-1">Booked on {new Date(b.createdAt).toLocaleDateString()}</p>
                              </div>
                              {b.status === 'PENDING' && (
                                  <button 
                                    onClick={() => handleBookingAction(b.id, 'CANCELLED')}
                                    className="text-red-400 text-sm hover:text-red-300 border border-red-900/50 px-3 py-1 rounded"
                                  >
                                      Cancel Request
                                  </button>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* BUSINESS VIEW */}
          {isBusiness && (
              <div className="bg-brand-secondary rounded-lg border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Clock className="text-brand-primary" size={20} /> Incoming Requests
                      </h2>
                  </div>
                  <div className="divide-y divide-gray-700">
                      {incomingBookings.length === 0 ? (
                          <div className="p-12 text-center text-gray-500">No new requests.</div>
                      ) : incomingBookings.map(b => (
                          <div key={b.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition">
                              <div>
                                  <div className="flex items-center gap-3 mb-1">
                                      <h3 className="font-bold text-white text-lg">{b.listingName}</h3>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                          b.status === 'CONFIRMED' ? 'bg-green-900 text-green-400' : 
                                          b.status === 'PENDING' ? 'bg-yellow-900 text-yellow-400' :
                                          'bg-red-900 text-red-400'
                                      }`}>{b.status}</span>
                                  </div>
                                  <p className="text-sm text-gray-400">{b.details}</p>
                                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                      <span>Date: {b.date}</span>
                                      <span>Value: <span className="text-brand-primary">${b.totalPrice}</span></span>
                                  </div>
                              </div>
                              {b.status === 'PENDING' && (
                                  <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleBookingAction(b.id, 'CONFIRMED')}
                                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                                      >
                                          <CheckCircle size={16} /> Accept
                                      </button>
                                      <button 
                                        onClick={() => handleBookingAction(b.id, 'REJECTED')}
                                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                                      >
                                          <XCircle size={16} /> Decline
                                      </button>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );

  const renderSettings = () => (
      <div className="max-w-2xl bg-brand-secondary rounded-lg border border-gray-700 p-8 animate-fade-in-up">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="text-brand-primary" size={20} /> Profile Settings
          </h2>
          
          {successMsg && (
              <div className="mb-6 bg-green-900/30 border border-green-800 text-green-300 p-3 rounded flex items-center gap-2 text-sm">
                  <CheckCircle size={16} /> {successMsg}
              </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input 
                      type="text" 
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
                  />
              </div>
              <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  <input 
                      type="email" 
                      value={editForm.email}
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
                  />
              </div>
              <div>
                  <label className="block text-gray-400 text-sm mb-2">Change Password</label>
                  <input 
                      type="password" 
                      value={editForm.password}
                      onChange={e => setEditForm({...editForm, password: e.target.value})}
                      className="w-full bg-brand-dark border border-gray-600 rounded p-3 text-white focus:border-brand-primary outline-none"
                      placeholder="Leave blank to keep current"
                  />
              </div>
              
              <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-brand-primary text-brand-dark font-bold px-6 py-3 rounded hover:bg-white transition flex items-center gap-2"
              >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
              </button>
          </form>
      </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 pb-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center text-2xl font-bold border-4 border-brand-dark shadow-lg">
                {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white mb-1">{user.name}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className={`bg-brand-primary/20 text-brand-primary border border-brand-primary/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>{user.type}</span>
                <span>• {user.email}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/20"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
                    activeTab === 'OVERVIEW' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary text-gray-400 hover:text-white'
                }`}
            >
                <LayoutDashboard size={18} /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('BOOKINGS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
                    activeTab === 'BOOKINGS' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary text-gray-400 hover:text-white'
                }`}
            >
                {isBusiness ? <Building size={18} /> : <Package size={18} />} 
                {isBusiness ? 'Reservations' : 'My Bookings'}
            </button>
            <button 
                onClick={() => setActiveTab('SETTINGS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
                    activeTab === 'SETTINGS' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary text-gray-400 hover:text-white'
                }`}
            >
                <Settings size={18} /> Settings
            </button>
        </div>

        {/* Dashboard Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
           <>
              {activeTab === 'OVERVIEW' && renderOverview()}
              {activeTab === 'BOOKINGS' && renderBookings()}
              {activeTab === 'SETTINGS' && renderSettings()}
           </>
        )}
      </div>
    </div>
  );
};
