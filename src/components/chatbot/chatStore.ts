import { useSyncExternalStore } from "react";

type State = {
  open: boolean;
  pendingScopeCheck: boolean;
  pendingContactForm: boolean;
};

let state: State = {
  open: false,
  pendingScopeCheck: false,
  pendingContactForm: false,
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const chatStore = {
  get: () => state,
  setOpen(v: boolean) {
    state = { open: v, pendingScopeCheck: v ? state.pendingScopeCheck : false, pendingContactForm: v ? state.pendingContactForm : false };
    emit();
  },
  openInScopeCheck() {
    state = { open: true, pendingScopeCheck: true, pendingContactForm: false };
    emit();
  },
  openInContactForm() {
    state = { open: true, pendingScopeCheck: false, pendingContactForm: true };
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
  consumePendingContactForm() {
    if (state.pendingContactForm) {
      state = { ...state, pendingContactForm: false };
      emit();
      return true;
    }
    return false;
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
