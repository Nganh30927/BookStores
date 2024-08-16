import { create } from 'zustand';
import { axiosClient } from '../library/axiosClient';
import { persist, createJSONStorage } from 'zustand/middleware';
import config from '../constants/config';

export interface User {
  id: number;
  email?: string;
  name: string;
  contact: string;
  address: string;
  gender?: string;
}

export interface Auth {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
  updateUser: (user: Partial<User>) => Promise<{ ok: boolean; message: string }>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ isAuthenticated: boolean; error: string }>;
  signup: (name: string, email: string, password: string, address: string, contact: string, gender: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
}

const useAuth = create(
  persist<Auth>(
    (set, get) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      getUser: () => get().user,
      updateUser: async (updatedUser: Partial<User>) => {
        try {
          set({ isLoading: true });
          const response = await axiosClient.put(`${config.urlAPI}/users/${get().user?.id}`, updatedUser);
          if (response && response.status === 200) {
            set((state) => ({
              user: { ...state.user, ...updatedUser } as User,
              isLoading: false,
            }));
            return { ok: true, message: 'User updated successfully' };
          } else {
            set({ isLoading: false });
            return { ok: false, message: 'Update failed' };
          }
        } catch (error) {
          console.log('updateUser error', error);
          set({ isLoading: false });
          return { ok: false, message: 'Update failed' };
        }
      },
      isLoading: false,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await axiosClient.post(`${config.urlAPI}/users/login`, { email, password });
          console.log('useAuth', response);
          if (response && response.status === 200) {
            const { data } = await axiosClient.get(`${config.urlAPI}/users/profile`);
            set({ user: data, isAuthenticated: true, isLoading: false });
            return { isAuthenticated: true, error: '' };
          } else {
            set({ isLoading: false });
            return { isAuthenticated: false, error: 'Username or password is invalid' };
          }
        } catch (error) {
          console.log('login error', error);
          set({ isLoading: false });
          return { isAuthenticated: false, error: 'Login failed' };
        }
      },
      signup: async (name: string, email: string, password: string, address: string, contact: string, gender: string) => {
        try {
          set({ isLoading: true });
          const response = await axiosClient.post(`${config.urlAPI}/members`, { name, email, password, address, contact, gender });
          if (response && response.status === 200) {
            return { ok: true, message: 'Signup successful' };
          } else {
            set({ isLoading: false });
            return { ok: false, message: 'Signup failed' };
          }
        } catch (error) {
          console.log('signup error', error);
          set({ isLoading: false });
          return { ok: false, message: 'Signup failed' };
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAuth;
