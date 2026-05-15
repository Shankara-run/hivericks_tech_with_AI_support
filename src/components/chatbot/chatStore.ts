import { create } from "zustand";

type State = {
  open: boolean;
  pendingScopeCheck: boolean;
  setOpen: (v: boolean) => void;
  openInScopeCheck: () => void;
};

// Tiny zustand-like store without dep — use minimal subscription
import { useSyncExternalStore } from "react";

let state = {
  open: false,
  pendingScopeCheck: false,
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const chatStore = {
  get: () => state,
  setOpen(v: boolean) {
    state = { ...state, open: v };
    if (!v) state = { ...state, pendingScopeCheck: false };
    emit();
  },
  openInScopeCheck() {
    state = { open: true, pendingScopeCheck: true };
    emit();
  },
  consumePendingScopeCheck() {
    if (state.pendingScopeCheck) {
      state = { ...state, pendingScopeCheck: false };
      emit();
      return true;
    }
    return false;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useChatStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => state,
  );
}

// dummy export to satisfy zustand import line above (we don't actually use it)
const create = (() => null) as never;
export { create };
export type { State };
