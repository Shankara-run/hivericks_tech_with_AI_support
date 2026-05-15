import { useSyncExternalStore } from "react";

type State = {
  open: boolean;
  pendingScopeCheck: boolean;
};

let state: State = {
  open: false,
  pendingScopeCheck: false,
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const chatStore = {
  get: () => state,
  setOpen(v: boolean) {
    state = { open: v, pendingScopeCheck: v ? state.pendingScopeCheck : false };
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
