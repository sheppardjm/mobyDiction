import { create } from 'zustand';
import type { IssueCategory } from '../types/grammar';

interface UIStore {
  // State
  isModalOpen: boolean;
  isSidebarOpen: boolean;
  activeFilters: IssueCategory[];

  // Actions
  openModal: () => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setFilters: (filters: IssueCategory[]) => void;
  toggleFilter: (filter: IssueCategory) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  isModalOpen: false,
  isSidebarOpen: true,
  activeFilters: [],

  // Actions
  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set({ isModalOpen: false }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  setFilters: (filters) => set({ activeFilters: filters }),

  toggleFilter: (filter) => {
    const { activeFilters } = get();
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];
    set({ activeFilters: newFilters });
  },

  clearFilters: () => set({ activeFilters: [] }),
}));
