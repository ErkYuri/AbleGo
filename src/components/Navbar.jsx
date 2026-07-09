import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/'; 
  };

  return (
    <nav className="navbar-container" aria-label="Navegação principal">
      
      {/* NOVO: Grupo da Esquerda (Logo + Saudação) */}
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

      {/* Grupo da Direita (Ações) */}
      <div className="navbar-actions">
        <a href="/cadastro" className="nav-link" aria-label="Acessar formulário para cadastrar um novo local">
          + Cadastrar Local
        </a>
        
        <button className="nav-link" aria-label="Abrir central de ajuda">
          Ajuda
        </button>

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