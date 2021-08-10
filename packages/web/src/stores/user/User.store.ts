// Importin stores
import { writable } from "svelte/store";
import { page } from "$app/stores";
import { goto } from "$app/navigation";

export interface Store {
  // User information
  user?: {

  },

  // Token information
  token?: {

  },

  // Notifications
  notifications?: [],

  // Sessions
  sessions?: [],
};

const store = () => {
  const { subscribe, update } = writable(<Store>{});

  return {
    subscribe,

    // loginUser
    loginUser: () => {
      page.subscribe((obj) => {
        goto(`https://auth.odzi.dog/callback/${encodeURIComponent("pawcapsu.ml/api/session")}`);
      });
    },
  };
};

export const UserStore = store();