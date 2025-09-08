import React from "react";
import { Link } from "react-router-dom";
import "../styles/CategoryGrid.css";

const categories = [
  {
    title: "Ofertas en Cantidad",
    subtitle: "Electrodomésticos al por mayor con descuentos especiales.",
    image: "/catg-1.jpg",
    button: "Ver Ofertas",
    link: "/ofertas",
  },
  {
    title: "Compras desde el Exterior",
    subtitle: "Envía electrodomésticos a tu familia en Cuba fácilmente.",
    image: "/catg-4.jpg",
    button: "Comprar Ahora",
    link: "/exterior",
  },
  {
    title: "Hogar Reluciente",
    subtitle: "Lo que necesitas para que tu casa luzca impecable.",
    image: "/catg-3.jpg",
    button: "Explorar",
    link: "/hogar",
  },
  {
    title: "Mensajería en La Habana",
    subtitle: "Entrega rápida y segura en todos los municipios.",
    image: "/catg-2.jpg",
    button: "Solicitar Envío",
    link: "/mensajeria",
  },
];

const CategoryGrid = () => {
  return (
    <section className="category-section">
      <div className="category-grid">
        {categories.map((cat, i) => (
          <Link to={cat.link} key={i} className="category-card">
            <img src={cat.image} alt={cat.title} className="category-image" />
            <div className="category-overlay">
              <div className="category-content">
                <h2>{cat.title}</h2>
                <p>{cat.subtitle}</p>
                <span className="category-button">{cat.button}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
