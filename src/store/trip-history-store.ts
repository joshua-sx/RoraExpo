import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Trip, TripStatus } from '@/src/types/trip';

// Valid status transitions
const VALID_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  not_taken: ['pending', 'cancelled'],
  pending: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

interface TripHistoryStore {
  trips: Trip[];
  _hasSeededDemo: boolean;
  addTrip: (trip: Trip) => void;
  updateTripStatus: (id: string, status: TripStatus, driverId?: string) => void;
  confirmTrip: (id: string, method: 'qr_scan' | 'manual_code') => void;
  completeTrip: (id: string, completedBy: 'passenger' | 'driver') => void;
  toggleSaved: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
  getRecentTrips: (limit?: number) => Trip[];
  getNotTakenTrips: () => Trip[];
  getSavedTrips: () => Trip[];
  getAvailableTrips: () => Trip[];
  deleteTrip: (id: string) => void;
  reset: () => void;
  seedDemoUpcomingTrip: () => void;
}

// Demo upcoming trip - scheduled for ~1 week in the future
function createDemoUpcomingTrip(): Trip {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7); // 1 week from now
  futureDate.setHours(20, 30, 0, 0); // 8:30 PM

  return {
    id: 'demo-upcoming-001',
    timestamp: futureDate.getTime(),
    origin: {
      placeId: 'demo-origin',
      name: 'Princess Juliana Intl Airport',
      description: 'Airport Rd, Simpson Bay, Sint Maarten',
      coordinates: { latitude: 18.0410, longitude: -63.1089 },
    },
    destination: {
      placeId: 'demo-destination',
      name: 'Sonesta Maho Beach Resort',
      description: '1 Rhine Rd, Maho Bay, Sint Maarten',
      coordinates: { latitude: 18.0392, longitude: -63.1156 },
    },
    quote: {
      estimatedPrice: 12,
      currency: 'USD',
      pricingVersion: 'v1.0',
      createdAt: futureDate.toISOString(),
    },
    routeData: {
      distance: 2.1,
      duration: 6,
      price: 12,
      coordinates: [],
    },
    status: 'not_taken',
    driverId: 'demo-driver-marcus',
    saved: true,
  };
}

export const useTripHistoryStore = create<TripHistoryStore>()(
  persist(
    (set, get) => ({
      trips: [],
      _hasSeededDemo: false,

  seedDemoUpcomingTrip: () => {
    const state = get();
    // Only seed once and if no trips exist
    if (state._hasSeededDemo || state.trips.length > 0) {
      return;
    }
    set({
      trips: [createDemoUpcomingTrip()],
      _hasSeededDemo: true,
    });
  },

  addTrip: (trip) => {
    set((state) => ({
      trips: [trip, ...state.trips],
    }));
  },

  updateTripStatus: (id, status, driverId) => {
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id !== id) return trip;

        // Validate transition
        const validNext = VALID_TRANSITIONS[trip.status];
        if (!validNext.includes(status)) {
          console.warn(`[trip-store] Invalid status transition: ${trip.status} -> ${status}`);
          return trip;
        }

        return {
          ...trip,
          status,
          driverId:
            status === 'not_taken' || status === 'cancelled'
              ? undefined
              : driverId ?? trip.driverId,
        };
      }),
    }));
  },

  confirmTrip: (id, method) => {
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id !== id) return trip;

        // Validate transition to in_progress
        const validNext = VALID_TRANSITIONS[trip.status];
        if (!validNext.includes('in_progress')) {
          console.warn(`[trip-store] Cannot confirm trip from status: ${trip.status}`);
          return trip;
        }

        return {
          ...trip,
          status: 'in_progress',
          confirmationMethod: method,
          confirmedAt: new Date().toISOString(),
          confirmedBy: 'driver',
        };
      }),
    }));
  },

  completeTrip: (id, completedBy) => {
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id !== id) return trip;

        // Validate transition to completed
        const validNext = VALID_TRANSITIONS[trip.status];
        if (!validNext.includes('completed')) {
          console.warn(`[trip-store] Cannot complete trip from status: ${trip.status}`);
          return trip;
        }

        return {
          ...trip,
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedBy,
        };
      }),
    }));
  },

  toggleSaved: (id) => {
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === id
          ? {
              ...trip,
              saved: !trip.saved,
            }
          : trip
      ),
    }));
  },

  getTripById: (id) => {
    return get().trips.find((trip) => trip.id === id);
  },

  getRecentTrips: (limit = 10) => {
    return get().trips.slice(0, limit);
  },

  getNotTakenTrips: () => {
    return get().trips.filter((trip) => trip.status === 'not_taken');
  },

  getSavedTrips: () => {
    return get().trips.filter((trip) => trip.saved === true);
  },

  getAvailableTrips: () => {
    return get().trips.filter((trip) => trip.status === 'not_taken' && trip.saved === true);
  },

  deleteTrip: (id) => {
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
    }));
  },

  reset: () => {
    set({ trips: [] });
  },
    }),
    {
      name: 'trip-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
