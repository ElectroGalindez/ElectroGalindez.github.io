// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Por favor, ingresa un correo válido.');
      return;
    }

    setIsSubmitting(true);

    const subject = `Nuevo suscriptor: ${email}`;
    const whatsappUrl = `https://wa.me/5358956749?text=${encodeURIComponent(subject)}`;
    window.open(whatsappUrl, '_blank');

    // Simular envío
    setTimeout(() => {
      alert(`¡Gracias por tu interés, ${email}! Pronto lanzaremos ofertas exclusivas.`);
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top">
        {/* Sobre Nosotros */}
        <div className="footer__section">
          <h3>Sobre ElectroGalíndez</h3>
          <p>
            Líder en electrodomésticos de alta calidad en Cuba. 
            Comprometidos con la innovación, el servicio y la experiencia del cliente.
          </p>
          <div className="footer__socials">
            <a
              href="https://wa.me/5358956749"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactar por WhatsApp"
              className="social-icon whatsapp"
            >
              <FaWhatsapp size={22} />
            </a>
            <a
              href="https://facebook.com/electrogalindez.cuba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Página de Facebook"
              className="social-icon facebook"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://instagram.com/electrogalindez.cuba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de Instagram"
              className="social-icon instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="mailto:electrogalindez@gmail.com"
              aria-label="Enviar correo"
              className="social-icon email"
            >
              <FaEnvelope size={22} />
            </a>
          </div>
        </div>

        {/* Enlaces Rápidos */}
        <div className="footer__section">
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/about">Quiénes somos</Link></li>
            <li><Link to="/products">Todos los productos</Link></li>
            <li><Link to="/products/featured">Ofertas</Link></li>
            <li><Link to="/help">Ayuda</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer__section">
          <h3>Recibe ofertas</h3>
          <p>Únete a nuestra lista y sé el primero en saber de promociones.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Correo electrónico"
              disabled={isSubmitting}
            />
            <button type="submit" aria-label="Suscribirse" disabled={isSubmitting}>
              {isSubmitting ? '...' : '→'}
            </button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </div>

        {/* Contacto */}
        <div className="footer__section">
          <h3>Contacto</h3>
          <ul>
            <li>
              <FaPhoneAlt aria-hidden="true" />
              <a href="tel:+5358956749">+53 58956749</a>
            </li>
            <li>
              <FaEnvelope aria-hidden="true" />
              <a href="mailto:electrogalindez@gmail.com">electrogalindez@gmail.com</a>
            </li>
            <li>
              <FaMapMarkerAlt aria-hidden="true" />
              <span>La Habana, Cuba</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Derechos */}
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} ElectroGalíndez. Todos los derechos reservados.</p>
        <div className="footer__legal">
          <Link to="/terms">Términos</Link>
          <Link to="/privacy">Privacidad</Link>
          <Link to="/shipping">Envíos</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;