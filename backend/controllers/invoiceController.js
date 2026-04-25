import Order from "../models/orderModel.js";
import PDFDocument from 'pdfkit';

/**
 * @desc    Generate invoice PDF
 * @route   GET /api/v1/invoice/:orderId
 * @access  Private
 */
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    // Find the order
    const order = await Order.findOne({ orderId, userId })
      .populate('userId', 'name email')
      .populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Cannot generate invoice for cancelled order" });
    }

    // Generate invoice number if not exists
    if (!order.invoiceNumber) {
      order.invoiceNumber = `INV-${order.orderId}-${Date.now()}`;
      await order.save();
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    const filename = `invoice_${order.orderId}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Company Header
    doc.fontSize(24).font('Helvetica-Bold').text('nextMart', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).font('Helvetica').text('Invoice', { align: 'center' });
    doc.moveDown(2);

    // Invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: ${order.invoiceNumber}`, 50, doc.y);
    doc.text(`Order ID: ${order.orderId}`, 350, doc.y - 15);
    doc.moveDown();
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`, 50, doc.y);
    doc.text(`Status: ${order.status}`, 350, doc.y - 15);
    doc.moveDown(2);

    // Billing Information
    doc.fontSize(14).font('Helvetica-Bold').text('Bill To:', 50);
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(order.address.firstName + ' ' + order.address.lastName);
    doc.text(order.address.email);
    if (order.address.phone) doc.text(order.address.phone);
    doc.text(order.address.street);
    doc.text(`${order.address.city}, ${order.address.state} ${order.address.pincode}`);
    doc.text(order.address.country);
    doc.moveDown(2);

    // Items table header
    const tableTop = doc.y;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 300, tableTop);
    doc.text('Price', 350, tableTop);
    doc.text('Total', 420, tableTop);

    // Table line
    doc.moveTo(50, doc.y + 5).lineTo(500, doc.y + 5).stroke();
    doc.moveDown(1);

    // Items
    doc.font('Helvetica');
    let yPosition = doc.y;

    order.items.forEach((item) => {
      doc.text(item.name, 50, yPosition);
      doc.text(item.quantity.toString(), 300, yPosition);
      doc.text(`₹${item.price}`, 350, yPosition);
      doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 420, yPosition);
      yPosition += 20;
    });

    // Separator line
    doc.moveTo(50, yPosition + 5).lineTo(500, yPosition + 5).stroke();
    doc.moveDown(2);

    // Totals
    const subtotal = order.subtotal || order.amount;
    const discount = order.discount || 0;
    const couponDiscount = order.couponDiscount || 0;
    const shipping = order.shipping || 0;
    const tax = order.tax || 0;

    doc.fontSize(12);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, doc.y);
    doc.moveDown(0.5);

    if (discount > 0) {
      doc.text(`Discount: -₹${discount.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    if (couponDiscount > 0) {
      doc.text(`Coupon Discount: -₹${couponDiscount.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    if (shipping > 0) {
      doc.text(`Shipping: ₹${shipping.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    if (tax > 0) {
      doc.text(`Tax: ₹${tax.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    // Final total
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold');
    doc.text(`Total: ₹${order.amount.toFixed(2)}`, 350, doc.y);

    // Payment info
    doc.moveDown(2);
    doc.font('Helvetica');
    doc.text(`Payment Method: ${order.paymentMethod}`, 50);
    doc.text(`Payment Status: ${order.payment ? 'Paid' : 'Pending'}`, 50, doc.y);

    // Footer
    doc.moveDown(3);
    doc.fontSize(10);
    doc.text('Thank you for shopping with nextMart!', { align: 'center' });
    doc.text('For any queries, contact support@nextmart.com', { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Invoice Generation Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message
    });
  }
};

/**
 * @desc    Generate invoice for admin view
 * @route   GET /api/v1/admin/invoice/:orderId
 * @access  Private (Admin)
 */
export const generateAdminInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId })
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name images stock');

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Same PDF generation logic as above
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    const filename = `admin_invoice_${order.orderId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Company Header
    doc.fontSize(24).font('Helvetica-Bold').text('nextMart - Admin Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).font('Helvetica').text('Order Invoice', { align: 'center' });
    doc.moveDown(2);

    // Invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: ${order.invoiceNumber || `INV-${order.orderId}`}`, 50, doc.y);
    doc.text(`Order ID: ${order.orderId}`, 350, doc.y - 15);
    doc.moveDown();
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`, 50, doc.y);
    doc.text(`Status: ${order.status}`, 350, doc.y - 15);
    doc.moveDown(2);

    // Customer Information
    doc.fontSize(14).font('Helvetica-Bold').text('Customer Information:', 50);
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Name: ${order.userId?.name || 'N/A'}`);
    doc.text(`Email: ${order.userId?.email || 'N/A'}`);
    if (order.userId?.phone) doc.text(`Phone: ${order.userId.phone}`);
    doc.moveDown();

    // Billing Address
    doc.fontSize(14).font('Helvetica-Bold').text('Billing Address:', 50);
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(order.address.firstName + ' ' + order.address.lastName);
    doc.text(order.address.email);
    if (order.address.phone) doc.text(order.address.phone);
    doc.text(order.address.street);
    doc.text(`${order.address.city}, ${order.address.state} ${order.address.pincode}`);
    doc.text(order.address.country);
    doc.moveDown(2);

    // Items table (same as user invoice)
    const tableTop = doc.y;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 280, tableTop);
    doc.text('Price', 320, tableTop);
    doc.text('Stock', 380, tableTop);
    doc.text('Total', 440, tableTop);

    doc.moveTo(50, doc.y + 5).lineTo(500, doc.y + 5).stroke();
    doc.moveDown(1);

    doc.font('Helvetica');
    let yPosition = doc.y;

    order.items.forEach((item) => {
      doc.text(item.name, 50, yPosition, { width: 200 });
      doc.text(item.quantity.toString(), 280, yPosition);
      doc.text(`₹${item.price}`, 320, yPosition);
      doc.text(item.productId?.stock?.toString() || 'N/A', 380, yPosition);
      doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 440, yPosition);
      yPosition += 20;
    });

    doc.moveTo(50, yPosition + 5).lineTo(500, yPosition + 5).stroke();
    doc.moveDown(2);

    // Totals (same as user invoice)
    const subtotal = order.subtotal || order.amount;
    const discount = order.discount || 0;
    const couponDiscount = order.couponDiscount || 0;
    const shipping = order.shipping || 0;
    const tax = order.tax || 0;

    doc.fontSize(12);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, doc.y);
    doc.moveDown(0.5);

    if (discount > 0) {
      doc.text(`Discount: -₹${discount.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    if (couponDiscount > 0) {
      doc.text(`Coupon (${order.couponCode}): -₹${couponDiscount.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    if (shipping > 0) {
      doc.text(`Shipping: ₹${shipping.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    if (tax > 0) {
      doc.text(`Tax: ₹${tax.toFixed(2)}`, 350, doc.y);
      doc.moveDown(0.5);
    }

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold');
    doc.text(`Total: ₹${order.amount.toFixed(2)}`, 350, doc.y);

    // Payment info
    doc.moveDown(2);
    doc.font('Helvetica');
    doc.text(`Payment Method: ${order.paymentMethod}`, 50);
    doc.text(`Payment Status: ${order.payment ? 'Paid' : 'Pending'}`, 50, doc.y);

    // Timeline if available
    if (order.timeline && order.timeline.length > 0) {
      doc.moveDown(2);
      doc.font('Helvetica-Bold').text('Order Timeline:', 50);
      doc.moveDown(0.5);
      doc.font('Helvetica');

      order.timeline.forEach((event) => {
        doc.text(`${event.status}: ${new Date(event.timestamp).toLocaleString()}`, 70);
        doc.moveDown(0.3);
      });
    }

    // Footer
    doc.moveDown(3);
    doc.fontSize(10);
    doc.text('nextMart Admin System', { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Admin Invoice Generation Error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to generate admin invoice",
      error: error.message
    });
  }
};