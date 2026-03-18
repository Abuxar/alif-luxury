import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get dashboard analytics data
// @route   GET /api/analytics
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    // 1. Basic Stats
    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    
    // 2. Revenue calculation
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // 3. Sales over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOrders = await Order.find({
      isPaid: true,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    // Group by date (YYYY-MM-DD)
    const salesDataMap = {};
    recentOrders.forEach(order => {
        const dateStr = order.createdAt.toISOString().split('T')[0];
        if (!salesDataMap[dateStr]) {
            salesDataMap[dateStr] = 0;
        }
        salesDataMap[dateStr] += order.totalPrice;
    });

    const salesData = Object.keys(salesDataMap).map(date => ({
        date,
        revenue: salesDataMap[date]
    }));

    // Fill in missing dates for the chart
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        if (!salesDataMap[dateStr]) {
            salesData.push({ date: dateStr, revenue: 0 });
        }
    }
    
    salesData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 4. Recent orders for the dashboard table
    const latestOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'firstName lastName email');

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      salesData,
      latestOrders
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Error generating analytics data' });
  }
});

// @desc    Get all users for CRM
// @route   GET /api/analytics/crm
// @access  Private/Admin
router.get('/crm', protect, admin, async (req, res) => {
    try {
        const clients = await User.find({ role: 'user' })
            .select('-password')
            .populate('orderHistory');
            
        // Calculate LTV (Lifetime Value) per user
        const crmData = clients.map(client => {
            const ltv = client.orderHistory.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
            return {
                _id: client._id,
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
                createdAt: client.createdAt,
                totalOrders: client.orderHistory.length,
                ltv
            };
        });
        
        // Sort by highest value clients first
        crmData.sort((a, b) => b.ltv - a.ltv);
        
        res.json(crmData);
    } catch (error) {
        console.error('CRM Error:', error);
        res.status(500).json({ message: 'Error retrieving CRM data' });
    }
});

export default router;
