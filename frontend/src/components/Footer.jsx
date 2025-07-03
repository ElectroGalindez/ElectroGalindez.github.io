import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__section">
          <h3>Sobre Nosotros</h3>
          <p>Somos una tienda de tecnología líder en productos electrónicos.</p>
        </div>

        <div className="footer__section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/about">Quiénes somos</Link></li>
            <li><Link to="/terms">Términos y Condiciones</Link></li>
            <li><Link to="/privacy">Política de privacidad</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>Suscríbete a nuestro Boletín</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit">Suscribirse</button>
          </form>
        </div>

        <div className="footer__section">
          <h3>Contacto</h3>
          <ul>
            <li><FaPhoneAlt /> <a href="tel:+123456789">+1 (234) 567 89</a></li>
            <li><FaEnvelope /> <a href="mailto:contacto@electrogalindez.com">contacto@electrogalindez.com</a></li>
            <li><FaMapMarkerAlt /> <a href="https://goo.gl/maps/XYZ" target="_blank" rel="noopener noreferrer">Nuestra Ubicación</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>Síguenos</h3>
          <div className="footer__socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} ElectroGalíndez. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
