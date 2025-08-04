// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        {/* Sobre Nosotros */}
        <div className="footer__section">
          <h3>Sobre Nosotros</h3>
          <p>
            ElectroGalíndez es una tienda líder en electrodomésticos de alta calidad.
            Comprometidos con la innovación, el servicio y la experiencia del cliente.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div className="footer__section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li>
              <Link to="/about" aria-label="Conoce más sobre nosotros">
                Quiénes somos
              </Link>
            </li>
            <li>
              <Link to="/terms" aria-label="Términos y condiciones">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link to="/privacy" aria-label="Política de privacidad">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link to="/contact" aria-label="Contáctanos">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Suscripción */}
        <div className="footer__section">
          <h3>Suscríbete a nuestro Boletín</h3>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Tu correo electrónico" aria-label="Correo electrónico" />
            <button type="submit" aria-label="Suscribirse al boletín">
              →
            </button>
          </form>
        </div>

        {/* Contacto */}
        <div className="footer__section">
          <h3>Contacto</h3>
          <ul>
            <li>
              <FaPhoneAlt aria-hidden="true" />
              <a href="tel:+123456789">+1 (234) 567 89</a>
            </li>
            <li>
              <FaEnvelope aria-hidden="true" />
              <a href="mailto:contacto@electrogalindez.com">contacto@electrogalindez.com</a>
            </li>
            <li>
              <FaMapMarkerAlt aria-hidden="true" />
              <a
                href="https://goo.gl/maps/XYZ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nuestra ubicación
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer__section">
          <h3>Síguenos</h3>
          <div className="footer__socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en Twitter"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Síguenos en LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} ElectroGalíndez. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;