import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";


function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  const handleOrder = async () => {
    const user_id = 1; 
    const items = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      await createOrder(user_id, items);
      clearCart();
      navigate("/success");
    } catch (err) {
      console.error("Error al crear orden:", err);
      alert("Hubo un error al procesar tu orden.");
    }
  };

  return (
    <div className="cart-container">
      <h2>Carrito de compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className="cart-item">
                <img src={product.image_url} alt={product.name} width="80" />
                <div>
                  <h4>{product.name}</h4>
                  <p>€{product.price} x {quantity}</p>
                </div>
                <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p className="cart-total">Total: €{total}</p>
          <button className="checkout-button" onClick={handleOrder}>Realizar pedido</button>
        </>
      )}
    </div>
  );
}

export default Cart;
