
import { User, RegistrationData, UserType } from '../types';
import { BackendService } from './backend';

const CURRENT_USER_KEY = 'agevee_current_user';

export const AuthService = {
  // Login
  login: async (email: string, password: string): Promise<User> => {
    const user = await BackendService.findUser(email);
    
    if (!user) {
        throw new Error("User not found.");
    }
    
    if (user.password && user.password !== password) {
        throw new Error("Invalid password.");
    }
    
    if (user.type === UserType.ADMIN && password !== 'admin') {
         throw new Error("Invalid admin credentials.");
    }

    if (user.isBlocked) {
        throw new Error("This account has been suspended.");
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // Register
  register: async (data: RegistrationData): Promise<User> => {
    const existing = await BackendService.findUser(data.email);
    if (existing) {
      throw new Error("Email already registered.");
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      type: data.type,
      isApproved: true, 
      password: data.password,
      createdAt: new Date().toISOString()
    };

    await BackendService.createUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  // Update Profile
  updateProfile: async (user: User): Promise<User> => {
      await BackendService.updateUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get Current User
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  }
};
