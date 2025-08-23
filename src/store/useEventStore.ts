import { create } from 'zustand';
import { Alert } from '../types';

interface EventStore {
  events: Alert[];                         
  fetchEvents: () => Promise<void>;        // Fetch events from backend API and replace local state
  addEvent: (event: Alert) => void;        // Prepend a new event to the list (e.g., real-time push)
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],                              // Initial empty events array

  // Retrieve events from the server and update local state
  fetchEvents: async () => {
    try {
      const res = await fetch("http://localhost:4001/api/events"); // GET all events
      const data = await res.json();                                // Parse JSON payload
      set({ events: data });                                        // Replace current state with fetched events
    } catch (err) {
      // Log any network/parse errors to help with debugging
      console.error("Failed to fetch events:", err);
    }
  },

  // Add a single event to the beginning of the array (keeps latest-first ordering)
  addEvent: (event: Alert) =>
    set((state) => ({
      events: [event, ...state.events],    // Prepend new event; keep existing ones after it
    })),
}));