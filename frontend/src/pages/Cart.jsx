import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  const handleOrder = () => {
    const user_id = 1; // en app real vendría del login
    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    createOrder(user_id, items).then(() => {
      clearCart();
      navigate("/success");
    });
  };

  return (
    <div>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <ul>
          {cart.map(({ product, quantity }, i) => (
            <li key={product.id}>
              {product.name} - €{product.price} x {quantity}
              <button onClick={() => removeFromCart(product.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: €{total}</p>
      <button onClick={handleOrder}>Realizar pedido</button>
    </div>
  );
}

export default Cart;
