import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get all orders
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json(data);
      
    } else if (req.method === 'POST') {
      // Create new order
      const {
        customer_name,
        date,
        rate,
        order_item,
        quantity,
        payment_type,
        total_amount
      } = req.body;

      // Validation
      if (!customer_name || !date || !rate || !order_item || !quantity || !payment_type || !total_amount) {
        return res.status(400).json({ 
          message: 'Missing required fields' 
        });
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name,
          date,
          rate: parseFloat(rate),
          order_item,
          quantity: parseInt(quantity),
          payment_type,
          total_amount: parseFloat(total_amount)
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(data);
      
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
}