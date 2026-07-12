import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [altoContraste, setAltoContraste] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  const toggleAltoContraste = () => {
    const novoEstado = !altoContraste;
    setAltoContraste(novoEstado);
    if (novoEstado) {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/'; 
  };

  return (
    <nav className="navbar-container" aria-label="Navegação principal">
      
      {/* GRUPO DA ESQUERDA */}
      <div className="navbar-left-group">
        <a href="/" className="navbar-logo-link" aria-label="Ir para a página inicial do AbleGo">
          <img src="/logo-mini-nobg.png" alt="" className="navbar-logo-img" aria-hidden="true" />
          <span className="navbar-brand-name">AbleGo</span>
        </a>
        
        {usuarioLogado && (
          <span className="user-greeting-left">
            Olá, {usuarioLogado.nome.split(' ')[0]}
          </span>
        )}

        
      </div>

      {/* GRUPO DA DIREITA */}
      <div className="navbar-actions">
        <button 
          className="nav-link btn-contraste" 
          onClick={toggleAltoContraste}
          aria-label="Alternar modo de alto contraste"
          title="Alto Contraste"
        >
          {altoContraste ? '☀️ Modo Normal' : '🌓 Alto Contraste'}
        </button>
        
        {/* O BOTÃO DE AJUDA FOI TOTALMENTE REMOVIDO DAQUI */}

        {usuarioLogado ? (
          <div className="user-menu">
            <a href="/perfil" className="nav-link" aria-label="Acessar meu perfil">
              Meu Perfil
            </a>

            <button onClick={handleLogout} className="btn-logout" aria-label="Sair da conta">
              Sair
            </button>
          </div>
        ) : (
          <a href="/login" className="btn-login" aria-label="Fazer login no sistema">
            Entrar
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;