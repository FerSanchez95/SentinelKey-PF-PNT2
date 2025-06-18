import { create } from 'zustand';
import { persist } from "zustand/middleware";

const dataPersist = persist((set) => ({
  user: null,
  isAuthenticated: false,

  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),
})
, {
  name: "userData",
}
)

export const useAuthStore = create(dataPersist);