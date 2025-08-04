// src/components/Cart.jsx
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  const handleOrder = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar el pedido.");
      navigate("/login");
      return;
    }

    const items = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    if (window.confirm(`¿Confirmas tu pedido por un total de €${total}?`)) {
      try {
        await createOrder(items);
        clearCart();
        navigate("/success");
      } catch (err) {
        console.error("Error al crear orden:", err);
        alert(err.message || "Hubo un error al procesar tu pedido.");
      }
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de compras</h2>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <button onClick={() => navigate("/products")} className="btn-browse">
            Ver productos
          </button>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={product.image_url} alt={product.name} loading="lazy" />
                </div>
                <div className="cart-item-info">
                  <h4>{product.name}</h4>
                  <p>€{product.price.toFixed(2)} × {quantity}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Eliminar ${product.name}`}
                    className="btn-remove"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p className="cart-total">
              Total: <span>€{total}</span>
            </p>
            <button className="checkout-button" onClick={handleOrder}>
              Realizar pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;