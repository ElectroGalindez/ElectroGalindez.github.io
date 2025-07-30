const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id)
      .populate('user', 'email')
      .populate('items.product', 'name price images');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Acceso denegado. No estás autenticado.' });
    }

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user orders' });
  }
};

exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Acceso denegado. No estás autenticado.' });
  }

  try {
    // Validar y calcular el total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Producto ${item.productId} no encontrado` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Crear la orden
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes
    });

    const savedOrder = await order.save();

    // Actualizar stock de productos
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Poblar la orden antes de enviarla
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'email')
      .populate('items.product', 'name price images');

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      order: populatedOrder
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado de orden inválido' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'email')
     .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente',
      order
    });
  } catch (err) {
    res.status(500).json({ error: 'Error updating order status' });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    res.json({ 
      success: true,
      message: 'Order deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting order' });
  }
};
