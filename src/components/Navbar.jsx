import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar-container">
      
      {/* Área da Logo (Esquerda) */}
      <div className="navbar-logo-area">
        <img 
          src="/logo-mini-nobg.png" 
          alt="Logo Minimalista AbleGo" 
          className="navbar-logo-img" 
        />
        <span className="navbar-brand-name">
          AbleGo
        </span>
      </div>

      {/* Área de Ações (Direita) */}
      <div className="navbar-actions">
        <button className="btn-help">
          Ajuda
        </button>
        <button className="btn-login">
          Entrar
        </button>
      </div>
    </nav>
  );
}

export default Navbar;