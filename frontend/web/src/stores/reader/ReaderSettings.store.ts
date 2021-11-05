// Importing modules
import { writable } from "svelte/store";

// Exporting ReaderSettings store interface
export interface ReaderSettingsStore {
  viewportSize: 'full' | '1/3' | '1/2'
};

// Function to initialize ReaderSettings store
function ReaderSettingsStoreInit() {
  const defaultStore: Partial<ReaderSettingsStore> = {
    viewportSize: 'full',
  };
  const { update, subscribe } = writable(defaultStore);

  return {
    subscribe,

    // setViewportSize
    setViewportSize(size: 'full' | '1/3' | '1/2') {
      update((object) => {
        object.viewportSize = size;

        return object;
      });
    },
  };
};

// Exporting initialized ReaderSettings store
export const ReaderSettings = ReaderSettingsStoreInit();
