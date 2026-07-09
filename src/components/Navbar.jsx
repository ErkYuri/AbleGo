import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Assim que a Navbar aparece, ela checa o "bolso" do navegador
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  // Função para fazer logout (jogar o crachá fora)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/'; // Recarrega a página inicial
  };

  return (
    <nav className="navbar-container" aria-label="Navegação principal">
      
      <div className="navbar-logo-area">
        <a href="/" className="navbar-logo-link" aria-label="Ir para a página inicial do AbleGo">
          <img src="/logo-mini-nobg.png" alt="" className="navbar-logo-img" aria-hidden="true" />
          <span className="navbar-brand-name">AbleGo</span>
        </a>
      </div>

      <div className="navbar-actions">
        <a href="/cadastro" className="nav-link" aria-label="Acessar formulário para cadastrar um novo local">
          + Cadastrar Local
        </a>
        
        <button className="nav-link" aria-label="Abrir central de ajuda">
          Ajuda
        </button>

        {/* Lógica Mágica: Se tem usuário, mostra o nome dele. Se não tem, mostra o botão de Entrar */}
        {usuarioLogado ? (
          <div className="user-menu">
            {/* Pega apenas o primeiro nome da pessoa */}
            <span className="user-greeting">
              Olá, {usuarioLogado.nome.split(' ')[0]}
            </span>
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