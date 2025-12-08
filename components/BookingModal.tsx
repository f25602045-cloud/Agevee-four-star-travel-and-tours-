import React, { useState } from 'react';
import { Listing, RoomOption, TourPackage } from '../types';
import { X, Calendar, User, Check, Loader2, CreditCard, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  listing: Listing;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ listing, onClose }) => {
  const [step, setStep] = useState(1);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomOption[]>([]);
  
  // Contact Form
  const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '' });

  const isHotel = listing.type === 'HOTEL';

  const handleDateChange = (field: 'checkIn' | 'checkOut', value: string) => {
    setDates(prev => ({ ...prev, [field]: value }));
    if (isHotel) {
        setSelectedRoom(null);
        setStep(1);
    }
  };

  const checkAvailability = () => {
    if (!dates.checkIn || (isHotel && !dates.checkOut)) return;
    
    setCheckingAvailability(true);
    setTimeout(() => {
        setAvailableRooms(listing.rooms || []);
        setCheckingAvailability(false);
        setStep(2);
    }, 1500);
  };

  const calculateTotal = () => {
    if (isHotel && selectedRoom && dates.checkIn && dates.checkOut) {
        const start = new Date(dates.checkIn);
        const end = new Date(dates.checkOut);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return selectedRoom.price * nights;
    }
    if (!isHotel && selectedPackage) {
        return selectedPackage.price * guests;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setStep(3);
    }, 2000);
  };

  // Shared Input Style Class
  const inputClass = "w-full bg-brand-dark/50 border border-white/10 rounded p-4 text-white placeholder-gray-500 outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition duration-300";
  const labelClass = "block text-xs font-bold text-brand-primary uppercase tracking-widest mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-brand-secondary border border-white/10 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-brand-dark p-6 flex justify-between items-center border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">
                {isHotel ? 'Secure Reservation' : 'Booking Request'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-1 h-1 bg-brand-primary rounded-full"></span>
               <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{listing.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition bg-transparent hover:bg-white/5 p-2 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            
          {/* SUCCESS STEP */}
          {step === 3 ? (
            <div className="text-center py-12 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/50 rounded-full flex items-center justify-center mb-8 animate-pulse-slow">
                    <Check size={48} className="text-green-400" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-4">Request Confirmed</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-12 leading-relaxed">
                    {isHotel 
                        ? "Your reservation request has been transmitted securely. The concierge will email your confirmation shortly." 
                        : "Your expedition inquiry has been logged. Our agents will reach out within 24 hours to finalize details."}
                </p>
                <button 
                    onClick={onClose}
                    className="bg-brand-primary text-brand-dark font-bold px-10 py-4 rounded-sm hover:bg-white transition uppercase tracking-widest text-sm"
                >
                    Return to Exploration
                </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Dates & Selection */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>
                                <Calendar size={12} className="inline mr-1 mb-0.5"/> {isHotel ? 'Check-in' : 'Start Date'}
                            </label>
                            <input 
                                type="date" 
                                required
                                className={inputClass}
                                value={dates.checkIn}
                                onChange={(e) => handleDateChange('checkIn', e.target.value)}
                            />
                        </div>
                        {isHotel && (
                            <div>
                                <label className={labelClass}>
                                    <Calendar size={12} className="inline mr-1 mb-0.5"/> Check-out
                                </label>
                                <input 
                                    type="date" 
                                    required
                                    className={inputClass}
                                    value={dates.checkOut}
                                    onChange={(e) => handleDateChange('checkOut', e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>
                            <User size={12} className="inline mr-1 mb-0.5"/> Guests / Travelers
                        </label>
                        <select 
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className={inputClass}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <option key={num} value={num} className="bg-brand-dark">{num} {num === 1 ? 'Person' : 'People'}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Availability Check Button (Hotel Only) */}
                {isHotel && step === 1 && (
                    <div className="pt-4">
                        <button 
                            type="button"
                            onClick={checkAvailability}
                            disabled={!dates.checkIn || !dates.checkOut || checkingAvailability}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-sm hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 uppercase tracking-widest text-sm"
                        >
                            {checkingAvailability ? <Loader2 className="animate-spin" /> : 'Check Availability'} <ArrowRight size={16} />
                        </button>
                    </div>
                )}

                {/* Step 2: Selection (Rooms or Packages) */}
                {(!isHotel || step === 2) && (
                    <div className="animate-fade-in-up border-t border-white/5 pt-8">
                        <h3 className="text-white font-serif font-bold text-xl mb-6 flex items-center gap-2">
                            {isHotel ? 'Select Accommodation' : 'Select Experience'}
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {isHotel ? (
                                availableRooms.map(room => (
                                    <div 
                                        key={room.id}
                                        onClick={() => setSelectedRoom(room)}
                                        className={`p-6 rounded-sm border cursor-pointer transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${
                                            selectedRoom?.id === room.id 
                                            ? 'bg-brand-primary/10 border-brand-primary' 
                                            : 'bg-brand-dark/30 border-white/5 hover:border-brand-primary/30'
                                        }`}
                                    >
                                        <div className="relative z-10">
                                            <h4 className="font-bold text-white text-lg font-serif">{room.name}</h4>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">{room.features.join(' • ')}</p>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <div className="text-brand-primary font-bold text-2xl font-serif">${room.price}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">per night</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                listing.packages?.map(pkg => (
                                    <div 
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`p-6 rounded-sm border cursor-pointer transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${
                                            selectedPackage?.id === pkg.id 
                                            ? 'bg-brand-primary/10 border-brand-primary' 
                                            : 'bg-brand-dark/30 border-white/5 hover:border-brand-primary/30'
                                        }`}
                                    >
                                        <div className="relative z-10">
                                            <h4 className="font-bold text-white text-lg font-serif">{pkg.name}</h4>
                                            <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">{pkg.duration} • {pkg.features.join(' • ')}</p>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <div className="text-brand-primary font-bold text-2xl font-serif">${pkg.price}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">per person</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Contact Info (Only shown after selection) */}
                        {((isHotel && selectedRoom) || (!isHotel && selectedPackage)) && (
                            <div className="mt-8 pt-8 border-t border-white/5">
                                <h3 className="text-white font-serif font-bold text-xl mb-6">Guest Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="relative">
                                        <label className={labelClass}>Full Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-4.5 text-gray-500" />
                                            <input 
                                                type="text" 
                                                required
                                                className={`${inputClass} pl-12`}
                                                placeholder="e.g. Alexander Smith"
                                                value={contact.name}
                                                onChange={e => setContact({...contact, name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className={labelClass}>Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-4.5 text-gray-500" />
                                            <input 
                                                type="email" 
                                                required
                                                className={`${inputClass} pl-12`}
                                                placeholder="alex@example.com"
                                                value={contact.email}
                                                onChange={e => setContact({...contact, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative mb-6">
                                    <label className={labelClass}>Phone Number</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-4.5 text-gray-500" />
                                        <input 
                                            type="tel" 
                                            required
                                            className={`${inputClass} pl-12`}
                                            placeholder="+92 300 1234567"
                                            value={contact.phone}
                                            onChange={e => setContact({...contact, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <label className={labelClass}>Special Requests</label>
                                    <textarea 
                                        rows={3}
                                        className={inputClass}
                                        placeholder="Dietary restrictions, room preferences, etc..."
                                        value={contact.message}
                                        onChange={e => setContact({...contact, message: e.target.value})}
                                    />
                                </div>

                                {/* Total Price Area */}
                                <div className="bg-brand-dark p-6 rounded-sm border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-brand-secondary p-3 rounded-full border border-white/10">
                                            <ShieldCheck className="text-brand-primary" size={24} />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Estimated Total</span>
                                            <span className="text-3xl font-bold text-white font-serif tracking-tight">${calculateTotal()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto bg-brand-primary text-brand-dark font-bold px-10 py-4 rounded-sm hover:bg-white transition flex items-center justify-center gap-3 shadow-lg hover:shadow-brand-primary/20 uppercase tracking-widest text-sm"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <>
                                                {isHotel ? 'Confirm Reservation' : 'Send Inquiry'} <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};