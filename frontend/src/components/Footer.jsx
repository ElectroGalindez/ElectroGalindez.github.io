import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>&copy; {new Date().getFullYear()} ElectroGalíndez. Todos los derechos reservados.</p>
        <p>Hecho con ❤️ para los mejores clientes.</p>
      </div>
    </footer>
  );
}

export default Footer;
