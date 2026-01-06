import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Driver } from '../types/driver';
import { MOCK_DRIVERS } from '../features/drivers/data/drivers';

/**
 * Database driver profile shape (from driver_profiles table)
 */
interface DbDriverProfile {
  id: string;
  display_name: string;
  phone_number: string | null;
  avatar_url: string | null;
  vehicle_type: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_color: string | null;
  vehicle_year: number | null;
  license_plate: string | null;
  seats: number | null;
  languages: string[] | null;
  service_area_tags: string[] | null;
  rating_average: number | null;
  rating_count: number | null;
  bio: string | null;
  status: 'ACTIVE' | 'UNVERIFIED' | 'SUSPENDED';
  is_rora_pro: boolean;
  is_accepting_requests: boolean;
  created_at: string;
}

/**
 * Map database driver profile to app Driver type
 */
function mapDbDriverToDriver(db: DbDriverProfile): Driver {
  const vehicleModel = [db.vehicle_make, db.vehicle_model, db.vehicle_year]
    .filter(Boolean)
    .join(' ');

  return {
    id: db.id,
    name: db.display_name,
    rating: db.rating_average ?? 0,
    reviewCount: db.rating_count ?? 0,
    onDuty: db.is_accepting_requests,
    vehicleType: db.vehicle_type ?? 'Unknown',
    vehicleModel: vehicleModel || 'Unknown',
    licensePlate: db.license_plate ?? '',
    profileImage: db.avatar_url ?? undefined,
    phone: db.phone_number ?? '',
    email: '', // Not stored in driver_profiles
    bio: db.bio ?? '',
    yearsExperience: 0, // Could calculate from created_at
    languages: db.languages ?? ['en'],
    // Extended fields for full driver info
    isRoraPro: db.is_rora_pro,
    serviceAreaTags: db.service_area_tags ?? [],
    seats: db.seats ?? 4,
  };
}

/**
 * Fetch all active drivers from the database
 * Falls back to mock data if Supabase is not configured
 */
export async function fetchDrivers(): Promise<Driver[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock drivers');
    return MOCK_DRIVERS;
  }

  try {
    const { data, error } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('rating_average', { ascending: false });

    if (error) {
      console.error('Failed to fetch drivers:', error);
      return MOCK_DRIVERS;
    }

    if (!data || data.length === 0) {
      console.warn('No drivers found in database, using mock drivers');
      return MOCK_DRIVERS;
    }

    return (data as unknown as DbDriverProfile[]).map(mapDbDriverToDriver);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return MOCK_DRIVERS;
  }
}

/**
 * Fetch a single driver by ID
 */
export async function fetchDriverById(id: string): Promise<Driver | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_DRIVERS.find(d => d.id === id) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('id', id)
      .eq('status', 'ACTIVE')
      .single();

    if (error || !data) {
      // Fallback to mock data
      return MOCK_DRIVERS.find(d => d.id === id) ?? null;
    }

    return mapDbDriverToDriver(data as unknown as DbDriverProfile);
  } catch (error) {
    console.error('Error fetching driver:', error);
    return MOCK_DRIVERS.find(d => d.id === id) ?? null;
  }
}

/**
 * Fetch drivers who are currently on duty (accepting requests)
 */
export async function fetchOnDutyDrivers(): Promise<Driver[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_DRIVERS.filter(d => d.onDuty);
  }

  try {
    const { data, error } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('status', 'ACTIVE')
      .eq('is_accepting_requests', true)
      .order('rating_average', { ascending: false });

    if (error) {
      console.error('Failed to fetch on-duty drivers:', error);
      return MOCK_DRIVERS.filter(d => d.onDuty);
    }

    if (!data || data.length === 0) {
      return MOCK_DRIVERS.filter(d => d.onDuty);
    }

    return (data as unknown as DbDriverProfile[]).map(mapDbDriverToDriver);
  } catch (error) {
    console.error('Error fetching on-duty drivers:', error);
    return MOCK_DRIVERS.filter(d => d.onDuty);
  }
}

/**
 * Fetch drivers by service area tag (for discovery waves)
 */
export async function fetchDriversByServiceArea(
  serviceAreaTag: string
): Promise<Driver[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_DRIVERS.filter(d => d.onDuty);
  }

  try {
    const { data, error } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('status', 'ACTIVE')
      .eq('is_accepting_requests', true)
      .contains('service_area_tags', [serviceAreaTag])
      .order('rating_average', { ascending: false });

    if (error) {
      console.error('Failed to fetch drivers by service area:', error);
      return MOCK_DRIVERS.filter(d => d.onDuty);
    }

    if (!data || data.length === 0) {
      // Fall back to all on-duty drivers
      return fetchOnDutyDrivers();
    }

    return (data as unknown as DbDriverProfile[]).map(mapDbDriverToDriver);
  } catch (error) {
    console.error('Error fetching drivers by service area:', error);
    return MOCK_DRIVERS.filter(d => d.onDuty);
  }
}
