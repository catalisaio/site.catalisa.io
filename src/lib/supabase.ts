import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  created_at?: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    // Add timestamp
    const dataWithTimestamp = {
      ...formData,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([dataWithTimestamp]);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error };
  }
};