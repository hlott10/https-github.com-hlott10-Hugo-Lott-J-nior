import { supabase } from "./supabase";

export interface Establishment {
  id: string;
  name: string;
  city: string;
  state: string;
  specialty: string;
  google_rating: number;
  review_count: number;
  review_count_total?: number;
  response_rate: number;
  vertical: string;
  address?: string;
  phone?: string;
  website?: string;
  image_url?: string;
  google_maps_url?: string;
  description?: string;
  slug: string;
  recent_reviews_score?: number;
  growth_rate?: number;
  ai_tone?: string;
  user_id?: string;
  created_at?: string;
  metadata?: any;
}

export const getClinics = async (filters?: { city?: string; specialty?: string }) => {
  let query = supabase
    .from('establishments')
    .select('*')
    .eq('vertical', 'saude');

  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }

  if (filters?.specialty) {
    query = query.ilike('specialty', `%${filters.specialty}%`);
  }

  const { data, error } = await query.order('google_rating', { ascending: false });
  
  if (error) throw error;
  return data as Establishment[];
};

export const getClinicById = async (id: string) => {
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Establishment;
};

export const createClinic = async (clinic: Omit<Establishment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('establishments')
    .insert([clinic])
    .select()
    .single();

  if (error) throw error;
  return data as Establishment;
};

export const updateClinic = async (id: string, updates: Partial<Establishment>) => {
  const { data, error } = await supabase
    .from('establishments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Establishment;
};

export const getMyClinic = async (userId: string) => {
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Establishment | null;
};

export const getClinicBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .eq('slug', slug)
    .eq('vertical', 'saude')
    .maybeSingle();

  if (error) throw error;
  return data as Establishment | null;
};
