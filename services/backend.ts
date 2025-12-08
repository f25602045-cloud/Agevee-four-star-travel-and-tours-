
import { Booking, Listing, User, UserType, ActivityLog } from '../types';
import { LISTINGS } from './mockData';

const STORAGE_KEYS = {
  USERS: 'agevee_db_users',
  LISTINGS: 'agevee_db_listings',
  BOOKINGS: 'agevee_db_bookings',
  LOGS: 'agevee_db_logs',
};

// --- INITIALIZATION ---

const initDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const adminUser: User = {
        id: 'admin_1',
        name: 'Website Owner',
        email: 'admin@agevee.com',
        type: UserType.ADMIN,
        isApproved: true,
        password: 'admin',
        createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    // Seed with Mock Data
    // Assign a mock owner ID to these initial listings so they can be managed if we had those users
    const seededListings = LISTINGS.map(l => ({ ...l, status: 'APPROVED', ownerId: 'mock_owner' }));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(seededListings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
  }
};

// Run init immediately
initDB();

// --- HELPERS ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const get = <T>(key: string): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const set = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Internal logger
const logActivity = (action: string, details: string, type: 'INFO' | 'WARNING' | 'DANGER' = 'INFO') => {
  const logs = get<ActivityLog[]>(STORAGE_KEYS.LOGS);
  const newLog: ActivityLog = {
    id: `log_${Date.now()}`,
    action,
    details,
    type,
    timestamp: new Date().toISOString()
  };
  set(STORAGE_KEYS.LOGS, [newLog, ...logs]);
};

// --- CORE SERVICES ---

export const BackendService = {
  // LOGS
  getLogs: async (): Promise<ActivityLog[]> => {
    await delay(100);
    return get<ActivityLog[]>(STORAGE_KEYS.LOGS);
  },

  // USERS
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return get<User[]>(STORAGE_KEYS.USERS);
  },

  findUser: async (email: string): Promise<User | undefined> => {
    await delay(200);
    const users = get<User[]>(STORAGE_KEYS.USERS);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser: async (user: User): Promise<void> => {
    await delay(500);
    const users = get<User[]>(STORAGE_KEYS.USERS);
    users.push(user);
    set(STORAGE_KEYS.USERS, users);
    
    // Auto-create a listing placeholder if they are a business
    if (user.type !== UserType.TOURIST && user.type !== UserType.ADMIN) {
        // We just log this, the actual listing creation happens via a separate flow in a real app,
        // but for this demo, we assume they register and then add a listing later.
    }
    
    logActivity('User Registered', `New ${user.type} account created: ${user.email}`, 'INFO');
  },

  updateUser: async (updatedUser: User): Promise<void> => {
    await delay(400);
    let users = get<User[]>(STORAGE_KEYS.USERS);
    users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    set(STORAGE_KEYS.USERS, users);
    logActivity('Profile Updated', `User ${updatedUser.email} updated their profile details.`, 'INFO');
  },

  deleteUser: async (userId: string): Promise<void> => {
    await delay(300);
    let users = get<User[]>(STORAGE_KEYS.USERS);
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
        users = users.filter(u => u.id !== userId);
        set(STORAGE_KEYS.USERS, users);
        logActivity('User Deleted', `Admin deleted user: ${userToDelete.email}`, 'DANGER');
        
        // Cascade delete bookings? In a real app yes, or anonymize.
        // For now, we leave bookings for record keeping.
    }
  },

  // LISTINGS
  getListings: async (): Promise<Listing[]> => {
    await delay(200);
    return get<Listing[]>(STORAGE_KEYS.LISTINGS);
  },

  // Get listings owned by a specific user
  getOwnerListings: async (ownerId: string): Promise<Listing[]> => {
      await delay(200);
      const listings = get<Listing[]>(STORAGE_KEYS.LISTINGS);
      return listings.filter(l => l.ownerId === ownerId);
  },

  updateListingStatus: async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> => {
    await delay(500);
    let listings = get<Listing[]>(STORAGE_KEYS.LISTINGS);
    
    if (status === 'REJECTED') {
      const listing = listings.find(l => l.id === id);
      listings = listings.filter(l => l.id !== id);
      if (listing) {
          logActivity('Listing Rejected', `Listing "${listing.name}" was rejected.`, 'WARNING');
      }
    } else {
      listings = listings.map(l => {
          if (l.id === id) {
              logActivity('Listing Approved', `Listing "${l.name}" is now live.`, 'INFO');
              return { ...l, status: 'APPROVED' };
          }
          return l;
      });
    }
    set(STORAGE_KEYS.LISTINGS, listings);
  },
  
  deleteListing: async (id: string): Promise<void> => {
      await delay(300);
      let listings = get<Listing[]>(STORAGE_KEYS.LISTINGS);
      const listing = listings.find(l => l.id === id);
      set(STORAGE_KEYS.LISTINGS, listings.filter(l => l.id !== id));
      if (listing) {
        logActivity('Listing Deleted', `Listing "${listing.name}" was deleted.`, 'DANGER');
      }
  },

  // BOOKINGS 
  createBooking: async (booking: Booking): Promise<void> => {
    await delay(800);
    const bookings = get<Booking[]>(STORAGE_KEYS.BOOKINGS);
    
    // Try to find the owner of the listing to attach to booking
    const listings = get<Listing[]>(STORAGE_KEYS.LISTINGS);
    const listing = listings.find(l => l.id === booking.listingId);
    if (listing && listing.ownerId) {
        booking.ownerId = listing.ownerId;
    }

    booking.createdAt = new Date().toISOString();
    bookings.push(booking);
    set(STORAGE_KEYS.BOOKINGS, bookings);
    logActivity('New Booking', `Booking received for ${booking.listingName}`, 'INFO');
  },
  
  // For Tourists
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await delay(300);
    const bookings = get<Booking[]>(STORAGE_KEYS.BOOKINGS);
    // Sort by newest first
    return bookings.filter(b => b.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // For Business Owners (Hotels/Agencies)
  getBusinessBookings: async (ownerId: string): Promise<Booking[]> => {
      await delay(300);
      const bookings = get<Booking[]>(STORAGE_KEYS.BOOKINGS);
      return bookings.filter(b => b.ownerId === ownerId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Confirm, Reject, or Cancel
  updateBookingStatus: async (bookingId: string, status: 'CONFIRMED' | 'REJECTED' | 'CANCELLED'): Promise<void> => {
      await delay(400);
      let bookings = get<Booking[]>(STORAGE_KEYS.BOOKINGS);
      const booking = bookings.find(b => b.id === bookingId);
      
      bookings = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
      set(STORAGE_KEYS.BOOKINGS, bookings);

      if (booking) {
          const action = status === 'CONFIRMED' ? 'Booking Confirmed' : status === 'CANCELLED' ? 'Booking Cancelled' : 'Booking Rejected';
          logActivity(action, `Reservation for ${booking.listingName} was ${status.toLowerCase()}.`, status === 'REJECTED' ? 'WARNING' : 'INFO');
      }
  }
};
