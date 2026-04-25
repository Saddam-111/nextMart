import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

/**
 * @desc    Generate CSV report
 * @route   GET /api/v1/reports/sales/csv
 * @access  Private (Admin)
 */
export const generateSalesCSV = async (req, res) => {
  try {
    const { startDate, endDate, type = 'orders' } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last 30 days
      end = new Date();
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    let data = [];
    let filename = '';

    if (type === 'orders') {
      // Generate orders report
      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
        status: { $ne: 'Cancelled' }
      })
      .populate('userId', 'name email')
      .select('orderId userId amount status paymentMethod createdAt items');

      data = orders.map(order => ({
        'Order ID': order.orderId,
        'Customer Name': order.userId?.name || 'N/A',
        'Customer Email': order.userId?.email || 'N/A',
        'Amount': order.amount,
        'Status': order.status,
        'Payment Method': order.paymentMethod,
        'Order Date': order.createdAt.toISOString().split('T')[0],
        'Items Count': order.items.length
      }));

      filename = `orders_report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.csv`;

    } else if (type === 'products') {
      // Generate products sales report
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
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            orderCount: { $addToSet: '$orderId' }
          }
        },
        {
          $project: {
            _id: 0,
            'Product Name': '$name',
            'Total Sold': '$totalSold',
            'Revenue': '$revenue',
            'Orders Count': { $size: '$orderCount' }
          }
        },
        { $sort: { 'Total Sold': -1 } }
      ]);

      data = productSales;
      filename = `products_sales_report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.csv`;

    } else if (type === 'customers') {
      // Generate customers report
      const customers = await User.find({
        createdAt: { $gte: start, $lte: end }
      }).select('name email phone createdAt');

      // Add order statistics for each customer
      const customersWithStats = await Promise.all(
        customers.map(async (customer) => {
          const orderStats = await Order.aggregate([
            { $match: { userId: customer._id, status: { $ne: 'Cancelled' } } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$amount' },
                lastOrderDate: { $max: '$createdAt' }
              }
            }
          ]);

          return {
            'Customer Name': customer.name,
            'Email': customer.email,
            'Phone': customer.phone || 'N/A',
            'Registration Date': customer.createdAt.toISOString().split('T')[0],
            'Total Orders': orderStats[0]?.totalOrders || 0,
            'Total Spent': orderStats[0]?.totalSpent || 0,
            'Last Order Date': orderStats[0]?.lastOrderDate ?
              orderStats[0].lastOrderDate.toISOString().split('T')[0] : 'N/A'
          };
        })
      );

      data = customersWithStats;
      filename = `customers_report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.csv`;
    }

    // Convert to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);

  } catch (error) {
    console.error('CSV Generation Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate CSV report",
      error: error.message
    });
  }
};

/**
 * @desc    Generate PDF report
 * @route   GET /api/v1/reports/sales/pdf
 * @access  Private (Admin)
 */
export const generateSalesPDF = async (req, res) => {
  try {
    const { startDate, endDate, type = 'orders' } = req.query;

    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Create PDF document
    const doc = new PDFDocument();
    const filename = `${type}_report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Period: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    if (type === 'orders') {
      // Orders report
      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
        status: { $ne: 'Cancelled' }
      })
      .populate('userId', 'name email')
      .select('orderId userId amount status paymentMethod createdAt')
      .limit(100); // Limit for PDF generation

      doc.fontSize(14).text('Orders Summary');
      doc.moveDown();

      orders.forEach((order, index) => {
        doc.fontSize(10).text(
          `${index + 1}. Order ID: ${order.orderId} | Customer: ${order.userId?.name || 'N/A'} | Amount: ₹${order.amount} | Status: ${order.status}`
        );
        doc.moveDown(0.5);
      });

    } else if (type === 'products') {
      // Products sales report
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
        { $sort: { totalSold: -1 } },
        { $limit: 50 }
      ]);

      doc.fontSize(14).text('Top Selling Products');
      doc.moveDown();

      productSales.forEach((product, index) => {
        doc.fontSize(10).text(
          `${index + 1}. ${product.name} | Sold: ${product.totalSold} | Revenue: ₹${product.revenue}`
        );
        doc.moveDown(0.5);
      });
    }

    // Add summary at the end
    doc.moveDown(2);
    doc.fontSize(12).text('Report generated on: ' + new Date().toLocaleString(), { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate PDF report",
      error: error.message
    });
  }
};

/**
 * @desc    Get report summary
 * @route   GET /api/v1/reports/summary
 * @access  Private (Admin)
 */
export const getReportSummary = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Sales summary
    const salesSummary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start },
          payment: true,
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$amount' }
        }
      }
    ]);

    // Payment method breakdown
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start },
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

    // Top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start },
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
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      period: `${days} days`,
      summary: {
        totalRevenue: salesSummary[0]?.totalRevenue || 0,
        totalOrders: salesSummary[0]?.totalOrders || 0,
        avgOrderValue: salesSummary[0]?.avgOrderValue || 0,
        paymentMethods,
        topProducts
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