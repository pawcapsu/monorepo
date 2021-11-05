// Importing modules
import { writable } from 'svelte/store';

// Exporting SidebarState store interface
export interface SidebarStateStore {
  state: 'in-reader' | 'normal';
};

// Function to initialize SidebarState store
function SidebarStateStoreInit() {
  const defaultStore: SidebarStateStore = {
    state: 'normal',
  };

  const { update, subscribe } = writable(defaultStore);

  return {
    subscribe,

    // setState
    setState(state: 'in-reader' | 'normal') {
      update((object) => {
        object.state = state; 

        return object;
      });
    }
  };
};

// Exporting SidebarState stor 
export const SidebarState = SidebarStateStoreInit();