import { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [dadosPerfil, setDadosPerfil] = useState({ locaisCadastrados: [], avaliacoesFeitas: [] });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. Checa se o usuário está logado buscando o crachá no bolso do navegador
    const usuarioSalvo = localStorage.getItem('usuario');
    
    if (usuarioSalvo) {
      const userObj = JSON.parse(usuarioSalvo);
      setUsuario(userObj);

      // 2. Pede para o Back-end trazer a ficha completa do usuário
      const buscarPerfil = async () => {
        try {
          const resposta = await fetch(`http://localhost:3000/api/usuarios/${userObj.id}/perfil`);
          if (resposta.ok) {
            const dados = await resposta.json();
            setDadosPerfil(dados);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
        } finally {
          setCarregando(false);
        }
      };
      
      buscarPerfil();
    } else {
      // Se não tem crachá, é chutado gentilmente para a página de login
      window.location.href = '/login'; 
    }
  }, []);

  if (carregando) return <p className="perfil-loading">Carregando seu histórico no AbleGo...</p>;
  if (!usuario) return null;

  return (
    <div className="perfil-page-container">
      <main className="perfil-card">
        
        {/* Cabeçalho do Perfil */}
        <div className="perfil-header">
          <div className="perfil-avatar">
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="perfil-nome">{usuario.nome}</h2>
            {usuario.pcd && <span className="tag-pcd">♿ Usuário PcD</span>}
          </div>
        </div>

        <hr className="perfil-divisor" />

        {/* Seção 1: Locais Cadastrados */}
        <section className="perfil-section">
          <h3 className="perfil-section-title">
            📍 Locais que eu cadastrei ({dadosPerfil.locaisCadastrados.length})
          </h3>
          
          {dadosPerfil.locaisCadastrados.length === 0 ? (
            <p className="perfil-empty-msg">Você ainda não contribuiu com nenhum local no mapa.</p>
          ) : (
            <div className="perfil-list">
              {dadosPerfil.locaisCadastrados.map(local => (
                <div key={local.id} className="perfil-list-item">
                  <strong>{local.nome}</strong>
                  <span className="perfil-item-categoria">{local.categoria}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção 2: Avaliações Feitas */}
        <section className="perfil-section">
          <h3 className="perfil-section-title">
            ⭐ Minhas Avaliações ({dadosPerfil.avaliacoesFeitas.length})
          </h3>
          
          {dadosPerfil.avaliacoesFeitas.length === 0 ? (
            <p className="perfil-empty-msg">Você ainda não avaliou nenhum estabelecimento.</p>
          ) : (
            <div className="perfil-list">
              {dadosPerfil.avaliacoesFeitas.map(av => (
                <div key={av.id} className="perfil-list-item review-item">
                  <div className="review-item-header">
                    <strong>{av.nome_local}</strong>
                    <span className="review-stars">
                      {"★".repeat(av.nota)}{"☆".repeat(5 - av.nota)}
                    </span>
                  </div>
                  {av.comentario && <p className="review-comentario">"{av.comentario}"</p>}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default Perfil;