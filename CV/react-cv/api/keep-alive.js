import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Vercel pe VITE_ prefix ke sath variables available hone chahiye
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ status: 'Error', message: 'Credentials not found' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Database ko "Ping" karne ke liyan kisi bhi table ka 1 record fetch karna kaafi hai
    const { data, error } = await supabase.from('projects').select('id').limit(1);

    if (error) {
       console.error("Supabase Ping Error:", error);
    }
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Supabase database pinged effectively to prevent pausing.',
      time: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
