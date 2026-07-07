import './Navbar.css';

function Navbar() {
  // O aria-label na tag nav identifica a região para quem navega por atalhos de teclado
  return (
    <nav className="navbar-container" aria-label="Navegação principal">
      
      <div className="navbar-logo-area">
        <a 
          href="/" 
          className="navbar-logo-link"
          aria-label="Ir para a página inicial do AbleGo"
        >
          <img 
            src="/logo-mini-nobg.png" 
            alt="" 
            className="navbar-logo-img" 
            aria-hidden="true"
          />
          <span className="navbar-brand-name">
            AbleGo
          </span>
        </a>
      </div>

      <div className="navbar-actions">
        <a href="/cadastro" className="nav-link" aria-label="Acessar formulário para cadastrar um novo local">
          + Cadastrar Local
        </a>
        
        <button className="nav-link" aria-label="Abrir central de ajuda">
          Ajuda
        </button>

        <button className="btn-login" aria-label="Fazer login no sistema">
          Entrar
        </button>
      </div>
    </nav>
  );
}

export default Navbar;