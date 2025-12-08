
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { BackendService } from '../services/backend';
import { Listing, User, UserType, ActivityLog } from '../types';
import { Check, X, Trash2, Shield, LayoutList, Users, Activity, Clock, LogOut } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'USERS' | 'LOGS'>('LISTINGS');
  
  // Data State
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      const user = AuthService.getCurrentUser();
      if (!user || user.type !== UserType.ADMIN) {
        navigate('/');
      }
    };
    checkAdmin();
    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    const [fetchedListings, fetchedUsers, fetchedLogs] = await Promise.all([
      BackendService.getListings(),
      BackendService.getUsers(),
      BackendService.getLogs()
    ]);
    setListings(fetchedListings);
    setUsers(fetchedUsers);
    setLogs(fetchedLogs);
    setLoading(false);
  };

  // --- HANDLERS ---

  const handleApprove = async (id: string) => {
    await BackendService.updateListingStatus(id, 'APPROVED');
    loadAllData();
  };

  const handleReject = async (id: string) => {
    await BackendService.updateListingStatus(id, 'REJECTED');
    loadAllData();
  };

  const handleDeleteListing = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
        await BackendService.deleteListing(id);
        loadAllData();
    }
  };

  const handleDeleteUser = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
          await BackendService.deleteUser(id);
          loadAllData();
      }
  }

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  // --- RENDER HELPERS ---

  const renderListingsTab = () => (
    <div className="space-y-8">
        {/* Pending Approvals */}
        <div className="bg-brand-secondary border border-yellow-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                Pending Approvals
            </h2>
            {listings.filter(l => l.status === 'PENDING').length === 0 ? (
                <p className="text-gray-500 text-sm">No pending listings at the moment.</p>
            ) : (
                <div className="space-y-4">
                    {listings.filter(l => l.status === 'PENDING').map(listing => (
                        <div key={listing.id} className="bg-brand-dark p-4 rounded border border-gray-700 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-white text-lg">{listing.name}</h3>
                                <div className="text-xs text-brand-primary uppercase font-bold mt-1">{listing.type} • {listing.contact}</div>
                                <p className="text-gray-400 text-sm mt-2">{listing.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleApprove(listing.id)}
                                    className="bg-green-600 hover:bg-green-500 text-white p-2 rounded transition"
                                    title="Approve"
                                >
                                    <Check size={18} />
                                </button>
                                <button 
                                    onClick={() => handleReject(listing.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition"
                                    title="Reject"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* All Listings */}
        <div className="bg-brand-secondary border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Manage Active Listings</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-gray-500 text-xs uppercase border-b border-gray-700">
                        <tr>
                            <th className="pb-3">Name</th>
                            <th className="pb-3">Type</th>
                            <th className="pb-3">Contact</th>
                            <th className="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300 text-sm">
                        {listings.filter(l => l.status === 'APPROVED').map(listing => (
                            <tr key={listing.id} className="border-b border-gray-800 last:border-0 hover:bg-white/5">
                                <td className="py-3 font-medium text-white">{listing.name}</td>
                                <td className="py-3"><span className="bg-brand-dark px-2 py-1 rounded text-[10px] font-bold border border-gray-700">{listing.type}</span></td>
                                <td className="py-3">{listing.contact}</td>
                                <td className="py-3 text-right">
                                    <button 
                                        onClick={() => handleDeleteListing(listing.id)}
                                        className="text-red-400 hover:text-red-300 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="bg-brand-secondary border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-gray-500 text-xs uppercase border-b border-gray-700">
                    <tr>
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Joined</th>
                        <th className="pb-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300 text-sm">
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-800 last:border-0 hover:bg-white/5">
                            <td className="py-3 font-medium text-white flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center text-xs font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                {user.name}
                            </td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                    user.type === UserType.ADMIN ? 'bg-purple-900/50 text-purple-400 border-purple-800' : 
                                    user.type === UserType.TOURIST ? 'bg-blue-900/50 text-blue-400 border-blue-800' :
                                    'bg-brand-primary/20 text-brand-primary border-brand-primary/40'
                                }`}>
                                    {user.type}
                                </span>
                            </td>
                            <td className="py-3 text-gray-500">{new Date(user.createdAt || '').toLocaleDateString()}</td>
                            <td className="py-3 text-right">
                                {user.type !== UserType.ADMIN && (
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-400 hover:text-red-300 transition flex items-center justify-end gap-1 ml-auto"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderLogsTab = () => (
    <div className="bg-brand-secondary border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">System Activity Logs</h2>
            <div className="text-xs text-gray-500 uppercase tracking-widest">{logs.length} events recorded</div>
        </div>
        
        <div className="space-y-0">
            {logs.length === 0 ? (
                <p className="text-gray-500 italic">No activity recorded yet.</p>
            ) : (
                logs.map((log) => (
                    <div key={log.id} className="flex gap-4 border-b border-gray-800 py-4 last:border-0">
                        <div className="pt-1">
                             {log.type === 'INFO' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                             {log.type === 'WARNING' && <div className="w-2 h-2 rounded-full bg-yellow-500"></div>}
                             {log.type === 'DANGER' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold ${
                                    log.type === 'DANGER' ? 'text-red-400' : 
                                    log.type === 'WARNING' ? 'text-yellow-400' : 'text-blue-400'
                                }`}>{log.action}</span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock size={10} /> {new Date(log.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">{log.details}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark pt-24 px-4 pb-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary p-2 rounded-lg text-brand-dark">
                <Shield size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">Admin Control Panel</h1>
              <p className="text-gray-400 text-sm">Site Overview & Management</p>
            </div>
          </div>
          <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-red-400 hover:text-red-300 transition border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/20"
           >
             <LogOut size={16} /> Logout
           </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('LISTINGS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                    activeTab === 'LISTINGS' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary text-gray-400 hover:text-white'
                }`}
            >
                <LayoutList size={18} /> Listings
            </button>
            <button 
                onClick={() => setActiveTab('USERS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                    activeTab === 'USERS' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary text-gray-400 hover:text-white'
                }`}
            >
                <Users size={18} /> Users
            </button>
            <button 
                onClick={() => setActiveTab('LOGS')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                    activeTab === 'LOGS' ? 'bg-brand-primary text-brand-dark' : 'bg-brand-secondary text-gray-400 hover:text-white'
                }`}
            >
                <Activity size={18} /> Activity Logs
            </button>
        </div>

        {/* Content */}
        {renderListingsTab()}
        {activeTab === 'USERS' && <div className="animate-fade-in-up">{renderUsersTab()}</div>}
        {activeTab === 'LOGS' && <div className="animate-fade-in-up">{renderLogsTab()}</div>}
        {activeTab === 'LISTINGS' && <div className="hidden"></div> /* Kept in DOM but hidden handled by logic above is easier, but here we used conditionals. Fixed by just rendering conditional above. */}

      </div>
    </div>
  );
};
