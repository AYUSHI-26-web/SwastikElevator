// Base URL for the backend API. Empty by default so requests stay relative
// (works with the Vite dev proxy locally, or when frontend+backend share one domain).
// Set VITE_API_BASE_URL when the frontend and backend are deployed as separate Vercel projects.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
