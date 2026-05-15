import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        
        {/* Coluna 1: A Marca */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-text">Able<span className="brand-highlight">Go</span></span>
          </div>
          <p className="brand-description">
            Sua cidade sem barreiras. Nossa missão é mapear e promover a acessibilidade, garantindo o direito de ir e vir para todos.
          </p>
        </div>

        {/* Coluna 2: Links Úteis */}
        <div className="footer-col">
          <h4 className="footer-col-title">Links Úteis</h4>
          <a href="#" className="footer-link">Lei Brasileira de Inclusão</a>
          <a href="#" className="footer-link">Solicitar Passe Livre</a>
          <a href="#" className="footer-link">Guia do Cão-Guia</a>
          <a href="#" className="footer-link">Denunciar Barreiras</a>
        </div>

        {/* Coluna 3: O Projeto */}
        <div className="footer-col">
          <h4 className="footer-col-title">O Projeto</h4>
          <a href="#" className="footer-link">Sobre Nós</a>
          <a href="#" className="footer-link">Como Avaliar um Local</a>
        </div>

      </div>

      {/* Direitos Autorais */}
      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; 2026 AbleGo.
        </p>
        <p className="footer-slogan">
          Feito para um mundo mais inclusivo
        </p>
      </div>
    </footer>
  );
}

export default Footer;