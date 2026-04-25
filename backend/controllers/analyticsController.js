import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/v1/analytics/dashboard
 * @access  Private (Admin)
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Revenue calculations
    const totalRevenue = await Order.aggregate([
      { $match: { payment: true, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          payment: true,
          status: { $ne: 'Cancelled' },
          createdAt: { $gte: startOfDay }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          payment: true,
          status: { $ne: 'Cancelled' },
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Order Placed' });
    const completedOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
     const lowStockProducts = await Product.countDocuments({
       $expr: { $lte: ['$stock', '$lowStockThreshold'] },
       isActive: true
     });

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Top selling products
    const topSellingProducts = await Product.find({ soldCount: { $gt: 0 } })
      .sort({ soldCount: -1 })
      .limit(5)
      .select('name soldCount price images');

    // Revenue by month (last 12 months)
    const monthlyRevenueData = await Order.aggregate([
      {
        $match: {
          payment: true,
          status: { $ne: 'Cancelled' },
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId amount status payment createdAt');

    // Conversion rate (orders per user)
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          total: totalRevenue[0]?.total || 0,
          today: todayRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
        },
        orders: {
          total: totalOrders,
          today: todayOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          conversionRate: conversionRate.toFixed(2),
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          lowStock: lowStockProducts,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        topSellingProducts,
        monthlyRevenueData,
        orderStatusDistribution,
        recentOrders,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

/**
 * @desc    Get sales reports
 * @route   GET /api/v1/analytics/sales-report
 * @access  Private (Admin)
 */
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, type = 'daily' } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last 30 days
      end = new Date();
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    let groupBy;
    switch (type) {
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'daily':
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          payment: true,
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Product-wise sales
    const productSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          payment: true,
          status: { $ne: 'Cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      { $limit: 20 }
    ]);

    // Payment method distribution
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          payment: true,
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      report: {
        period: { start, end, type },
        salesData,
        productSales,
        paymentMethods,
        summary: {
          totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
          totalOrders: salesData.reduce((sum, item) => sum + item.orders, 0),
          avgOrderValue: salesData.length > 0 ?
            salesData.reduce((sum, item) => sum + item.avgOrderValue, 0) / salesData.length : 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};