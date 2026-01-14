import { create } from 'zustand';
import type { GrammarIssue } from '../types/grammar';

interface GrammarStore {
  // State
  issues: GrammarIssue[];
  currentIssueId: string | null;
  isChecking: boolean;
  checkError: string | null;

  // Computed getters
  activeIssues: () => GrammarIssue[];
  currentIssue: () => GrammarIssue | null;
  currentIssueIndex: () => number;

  // Actions
  setIssues: (issues: GrammarIssue[]) => void;
  updateIssue: (id: string, updates: Partial<GrammarIssue>) => void;
  setCurrentIssue: (id: string | null) => void;
  navigateToNextIssue: () => void;
  navigateToPreviousIssue: () => void;
  acceptIssue: (id: string) => void;
  rejectIssue: (id: string) => void;
  modifyIssue: (id: string) => void;
  clearIssues: () => void;
  setIsChecking: (isChecking: boolean) => void;
  setCheckError: (error: string | null) => void;
}

export const useGrammarStore = create<GrammarStore>((set, get) => ({
  // Initial state
  issues: [],
  currentIssueId: null,
  isChecking: false,
  checkError: null,

  // Computed getters
  activeIssues: () => {
    return get().issues.filter((issue) => issue.status === 'pending');
  },

  currentIssue: () => {
    const { issues, currentIssueId } = get();
    if (!currentIssueId) return null;
    return issues.find((issue) => issue.id === currentIssueId) || null;
  },

  currentIssueIndex: () => {
    const { activeIssues, currentIssueId } = get();
    const active = activeIssues();
    return active.findIndex((issue) => issue.id === currentIssueId);
  },

  // Actions
  setIssues: (issues) => set({ issues }),

  updateIssue: (id, updates) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, ...updates } : issue
      ),
    })),

  setCurrentIssue: (id) => set({ currentIssueId: id }),

  navigateToNextIssue: () => {
    const { activeIssues, currentIssueIndex, setCurrentIssue } = get();
    const active = activeIssues();
    const currentIdx = currentIssueIndex();

    if (active.length === 0) {
      setCurrentIssue(null);
      return;
    }

    const nextIdx = (currentIdx + 1) % active.length;
    setCurrentIssue(active[nextIdx].id);
  },

  navigateToPreviousIssue: () => {
    const { activeIssues, currentIssueIndex, setCurrentIssue } = get();
    const active = activeIssues();
    const currentIdx = currentIssueIndex();

    if (active.length === 0) {
      setCurrentIssue(null);
      return;
    }

    const prevIdx = currentIdx <= 0 ? active.length - 1 : currentIdx - 1;
    setCurrentIssue(active[prevIdx].id);
  },

  acceptIssue: (id) => {
    get().updateIssue(id, { status: 'accepted' });
  },

  rejectIssue: (id) => {
    get().updateIssue(id, { status: 'rejected' });
  },

  modifyIssue: (id) => {
    get().updateIssue(id, { status: 'modified' });
  },

  clearIssues: () => set({ issues: [], currentIssueId: null }),

  setIsChecking: (isChecking) => set({ isChecking }),

  setCheckError: (checkError) => set({ checkError }),
}));
