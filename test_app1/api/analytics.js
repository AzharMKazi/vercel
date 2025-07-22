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
    const { data, error } = await supabase
      .from('orders')
      .select('*');

    if (error) throw error;

    // Calculate analytics
    const totalOrders = data.length;
    const totalRevenue = data.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    // Group by date
    const salesByDate = data.reduce((acc, order) => {
      const date = new Date(order.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.total_amount;
      return acc;
    }, {});

    // Group by payment type
    const paymentCounts = data.reduce((acc, order) => {
      acc[order.payment_type] = (acc[order.payment_type] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      totalOrders,
      totalRevenue,
      salesByDate,
      paymentCounts
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    res.status(500).json({ 
      message: 'Failed to load analytics', 
      error: error.message 
    });
  }
}