// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Por favor, ingresa un correo válido.');
      return;
    }
    alert(`¡Gracias por suscribirte, ${email}! Pronto activaremos nuestra lista de ofertas.`);
    setEmail('');
    setMessage('');
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
              href="https://facebook.com/electrogalindez.cuba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Página de Facebook - ElectroGalíndez Cuba"
              title="Facebook"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="https://instagram.com/electrogalindez.cuba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de Instagram - ElectroGalíndez Cuba"
              title="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="https://twitter.com/electrogalindez"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de Twitter - ElectroGalíndez"
              title="Twitter"
            >
              <FaTwitter size={22} />
            </a>
            <a
              href="https://linkedin.com/company/electrogalindez-cuba"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de LinkedIn - ElectroGalíndez Cuba"
              title="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
          </div>
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
              <Link to="/products" aria-label="Ver todos los productos">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link to="/offers" aria-label="Ver ofertas actuales">
                Ofertas
              </Link>
            </li>
            <li>
              <Link to="/help" aria-label="Centro de ayuda">
                Ayuda
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
          <h3>Próximamente</h3>
          <p>Estamos lanzando nuestro boletín. Déjanos tu correo para ser el primero en recibir ofertas.</p>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Correo electrónico para suscripción"
            />
            <button type="submit" aria-label="Suscribirse al boletín">
              →
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
              <a href="tel:+5358956749" aria-label="Llamar al 5358956749">
                +53 58956749
              </a>
            </li>
            <li>
              <FaEnvelope aria-hidden="true" />
              <a href="mailto:contacto@electrogalindez.com" aria-label="Enviar correo a contacto@electrogalindez.com">
                contacto@electrogalindez.com
              </a>
            </li>
            <li>
              <FaMapMarkerAlt aria-hidden="true" />
              <span>La Habana, Cuba</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Pie de página */}
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