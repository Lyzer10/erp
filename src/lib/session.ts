// Client-safe session settings shared by the server token and the browser idle timer.

// Sessions expire after this much inactivity; the client renews the token while the user is active.
export const SESSION_IDLE_MINUTES = 60;
