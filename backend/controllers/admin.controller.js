// controllers/admin.controller.js
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");

exports.getAdminSummary = async (req, res) => {
  try {
    // 1. Obtener total de usuarios
    const totalUsers = await User.countDocuments();

    // 2. Obtener total de productos
    const totalProducts = await Product.countDocuments({ active: true });

    // 3. Obtener total de categorías
    const totalCategories = await Category.countDocuments({ active: true });

    // 4. Obtener conteo de órdenes por estado
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const ordersByStatus = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orderStats.forEach(stat => {
      ordersByStatus[stat._id] = stat.count;
    });

    // 5. Calcular ingresos totales (solo órdenes confirmadas, procesando, enviadas o entregadas)
    const incomeResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

    // 6. Obtener productos con bajo stock (menos de 10 unidades)
    const lowStockProducts = await Product.find({ 
      stock: { $lt: 10 }, 
      active: true 
    }).select('name stock').limit(5);

    // 7. Obtener órdenes recientes
    const recentOrders = await Order.find()
      .populate('user', 'email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // 8. Productos más vendidos
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalSold: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalIncome,
          ordersByStatus
        },
        lowStockProducts,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error("Error obteniendo resumen admin:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Ventas del mes actual
    const currentMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Ventas del mes pasado
    const lastMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const currentSales = currentMonthSales[0] || { total: 0, count: 0 };
    const lastSales = lastMonthSales[0] || { total: 0, count: 0 };

    const salesGrowth = lastSales.total > 0 
      ? ((currentSales.total - lastSales.total) / lastSales.total * 100).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        currentMonth: currentSales,
        lastMonth: lastSales,
        salesGrowth: parseFloat(salesGrowth)
      }
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas del dashboard:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    });
  }
};
