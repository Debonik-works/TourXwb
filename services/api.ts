import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Place, Hotel, Artisan } from '../constants/Data';

export const fetchPlaces = async (): Promise<Place[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Returning mock data.');
    return [
        {
            id: '1',
            name: 'Victoria Memorial (Mock)',
            category: 'Historical Monument',
            lat: 22.5448,
            lon: 88.3426,
            city: 'Kolkata',
            description: 'Iconic white marble monument (Mock Data due to missing credentials)',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80']
        }
    ];
  }
  const { data, error } = await supabase.from('places').select('*');
  if (error) {
    console.error('Error fetching places:', error);
    return [];
  }
  return data as Place[];
};

export const fetchHotels = async (): Promise<Hotel[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.from('hotels').select('*');
  if (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
  return data as Hotel[];
};

export const fetchArtisans = async (): Promise<Artisan[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase.from('artifacts').select('*');
  if (error) {
    console.error('Error fetching artisans:', error);
    return [];
  }
  return data as Artisan[];
};
