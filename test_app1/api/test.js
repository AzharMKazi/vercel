import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test connection
    const { data, error } = await supabase
      .from('orders')
      .select('count', { count: 'exact', head: true });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.status(200).json({ status: 'ok', message: 'API is working' });
  } catch (error) {
    console.error('API Test Error:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
}