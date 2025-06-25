import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  if (!product && !loading) return <p>Producto no encontrado</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Precio: €{product.price}</p>
      <p>{product.description}</p>
      <img src={product.image_url} alt={product.name} width="200" />
      <div>
        <button onClick={() => addToCart(product)}>Añadir al carrito</button>
      </div>
    </div>
  );
}
export default ProductDetail;
