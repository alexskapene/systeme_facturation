import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import Product from '../models/Product';
import Client from '../models/Client';

export const getStats = async (_req: Request, res: Response) => {
  try {
    // 1. Total Revenue (TTC)
    const revenueStats = await Invoice.aggregate([
      {
        $group: { _id: null, total: { $sum: '$totalTTC' }, count: { $sum: 1 } },
      },
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;
    const totalInvoices = revenueStats.length > 0 ? revenueStats[0].count : 0;

    // 2. Total Clients
    const totalClients = await Client.countDocuments();

    // 3. Low Stock Alerts (Threshold < 10)
    const lowStockProducts = await Product.find({
      stockQuantity: { $lt: 10 },
      active: true,
    })
      .select('name stockQuantity')
      .limit(5);

    // 4. Recent Invoices
    const recentInvoices = await Invoice.find()
      .populate('client', 'name firstName')
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Sales by day (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesOverTime = await Invoice.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$totalTTC' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalInvoices,
          totalClients,
          lowStockCount: await Product.countDocuments({
            stockQuantity: { $lt: 10 },
            active: true,
          }),
        },
        lowStockProducts,
        recentInvoices,
        salesOverTime,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ success: false, message: err.message });
  }
};
