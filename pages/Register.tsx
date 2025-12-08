
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UserType } from '../types';
import { User, Briefcase, Home, Map, Loader2, AlertCircle } from 'lucide-react';
import { AuthService } from '../services/authService';

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedType, setSelectedType] = useState<UserType>(UserType.TOURIST);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    details: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check URL params for type selection (e.g., ?type=AGENCY)
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && Object.values(UserType).includes(typeParam as UserType)) {
      setSelectedType(typeParam as UserType);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.register({
        ...formData,
        type: selectedType
      });
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { id: UserType.TOURIST, label: 'Tourist / Traveller', icon: <User />, desc: 'Book hotels and tours' },
    { id: UserType.AGENCY, label: 'Agency', icon: <Briefcase />, desc: 'List tours and packages' },
    { id: UserType.HOTEL, label: 'Hotel', icon: <Home />, desc: 'Manage room bookings' },
    { id: UserType.GUIDE, label: 'Guide', icon: <Map />, desc: 'Offer guiding services' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-brand-secondary rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-700 animate-fade-in-up">
        
        {/* Left Side: Type Selection */}
        <div className="md:w-1/3 bg-gray-900 p-8 border-r border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 font-serif">I am a...</h2>
          <div className="space-y-4">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                type="button"
                className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 border ${
                  selectedType === t.id 
                    ? 'bg-brand-primary text-brand-dark border-brand-primary transform scale-105 shadow-lg shadow-brand-primary/20' 
                    : 'bg-brand-secondary text-gray-400 border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                }`}
              >
                <div className={`p-2 rounded-full mr-4 ${selectedType === t.id ? 'bg-white/20' : 'bg-brand-dark'}`}>
                  {t.icon}
                </div>
                <div className="text-left">
                  <div className="font-bold">{t.label}</div>
                  <div className={`text-xs ${selectedType === t.id ? 'text-brand-dark/70' : 'text-gray-500'}`}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 md:p-12 relative">
          <h2 className="text-3xl font-bold text-white mb-2 font-serif">Join Agevee Four Star</h2>
          <p className="text-gray-400 mb-8">Create your {selectedType.toLowerCase()} account to get started.</p>
          
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-brand-dark border border-gray-600 rounded-lg p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full bg-brand-dark border border-gray-600 rounded-lg p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full bg-brand-dark border border-gray-600 rounded-lg p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {selectedType !== UserType.TOURIST && (
              <div>
                 <label className="block text-sm font-medium text-gray-400 mb-2">
                   {selectedType === UserType.AGENCY ? 'Agency Description & License' : 
                    selectedType === UserType.HOTEL ? 'Hotel Name & Location' : 
                    'Languages & Experience'}
                 </label>
                 <textarea
                    rows={3}
                    className="w-full bg-brand-dark border border-gray-600 rounded-lg p-3 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                    placeholder="Tell us about your services..."
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                 />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-lg hover:bg-amber-400 transition transform hover:translate-y-[-2px] shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Register Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account? <span className="text-brand-primary hover:underline cursor-pointer">Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
};
