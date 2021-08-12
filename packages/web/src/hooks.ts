import type { GetSession } from "@sveltejs/kit";
import { handleSession } from "svelte-kit-cookie-session";

/** @type {import('@sveltejs/kit').GetSession} */
export const getSession: GetSession<Locals> = function ({ locals }) {
  return locals.session.data;
};

export const handle = handleSession(
  {
    secret: "A_VERY_SECRET_SECRET_32_CHARS_LONG",
  }
);