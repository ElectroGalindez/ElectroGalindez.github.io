// src/pages/Contact.jsx
import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular envío
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  if (success) {
    return (
      <div className="contact-container success">
        <div className="contact-success">
          <h2>✅ ¡Gracias por tu mensaje!</h2>
          <p>Pronto nos pondremos en contacto contigo.</p>
          <button onClick={() => setSuccess(false)} className="btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container" aria-labelledby="contact-title">
      <h1 id="contact-title">Contáctanos</h1>
      <p className="contact-subtitle">Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.</p>

      <div className="contact-grid">
        {/* Formulario */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Asunto</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un asunto</option>
              <option value="pedido">Consulta sobre un pedido</option>
              <option value="producto">Información de producto</option>
              <option value="soporte">Soporte técnico</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>

        {/* Información de contacto */}
        <div className="contact-info">
          <h3>Información de contacto</h3>
          <ul>
            <li>📞 <strong>Teléfono:</strong> +53 58956749</li>
            <li>📧 <strong>Email:</strong> contacto@electrogalindez.com</li>
            <li>📍 <strong>Ubicación:</strong> La Habana, Cuba</li>
          </ul>
          <div className="contact-whatsapp">
            <p>¿Prefieres hablar por WhatsApp?</p>
            <a
              href="https://wa.me/5358956749"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              📲 Chatea con nosotros
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;