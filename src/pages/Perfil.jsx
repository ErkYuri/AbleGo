import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalEditar from '../components/ModalEditar';
import './Perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [dadosPerfil, setDadosPerfil] = useState({ locaisCadastrados: [], avaliacoesFeitas: [] });
  const [carregando, setCarregando] = useState(true);

  // Estados para edição do perfil
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', pcd: false });
  const [salvando, setSalvando] = useState(false);

  // Estados para edição de avaliação (Adicionado editImagemUrl)
  const [avaliacaoEmEdicao, setAvaliacaoEmEdicao] = useState(null);
  const [editNota, setEditNota] = useState(5);
  const [editComentario, setEditComentario] = useState('');
  const [editImagemUrl, setEditImagemUrl] = useState('');

  // Estados para edição de local
  const [localEmEdicao, setLocalEmEdicao] = useState(null);

  const carregarDadosDoPerfil = async (idUsuario) => {
    try {
      const resposta = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}/perfil`);
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

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const userObj = JSON.parse(usuarioSalvo);
      setUsuario(userObj);
      setFormData({ nome: userObj.nome, email: userObj.email, pcd: userObj.pcd });
      carregarDadosDoPerfil(userObj.id);
    } else {
      window.location.href = '/login'; 
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const resposta = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (resposta.ok) {
        const usuarioAtualizado = await resposta.json();
        setUsuario(usuarioAtualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        setModoEdicao(false); 
        window.location.reload(); 
      } else {
        alert('Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error(error);
      alert('Falha na comunicação com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  // --- FUNÇÕES DE LOCAIS ---

  const handleExcluirLocal = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir permanentemente o local "${nome}"?`)) {
      try {
        const resposta = await fetch(`http://localhost:3000/api/locais/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
          setDadosPerfil(prev => ({
            ...prev,
            locaisCadastrados: prev.locaisCadastrados.filter(loc => loc.id !== id)
          }));
        } else {
          alert('Erro ao excluir local.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
      }
    }
  };

  // --- FUNÇÕES DE AVALIAÇÃO ---

  const handleExcluirAvaliacao = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        const resposta = await fetch(`http://localhost:3000/api/locais/avaliacao/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
          setDadosPerfil(prev => ({
            ...prev,
            avaliacoesFeitas: prev.avaliacoesFeitas.filter(av => av.id !== id)
          }));
        } else {
          alert('Erro ao excluir avaliação.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
      }
    }
  };

  const abrirEdicaoAvaliacao = (av) => {
    setAvaliacaoEmEdicao(av);
    setEditNota(av.nota);
    setEditComentario(av.comentario || '');
    setEditImagemUrl(av.imagem_url || ''); // Carrega a imagem antiga se existir
  };

  const fecharEdicaoAvaliacao = () => {
    setAvaliacaoEmEdicao(null);
  };

  const handleSalvarEdicaoAvaliacao = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const resposta = await fetch(`http://localhost:3000/api/locais/avaliacao/${avaliacaoEmEdicao.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota: editNota, comentario: editComentario, imagem_url: editImagemUrl })
      });

      if (resposta.ok) {
        setDadosPerfil(prev => ({
          ...prev,
          avaliacoesFeitas: prev.avaliacoesFeitas.map(av => 
            av.id === avaliacaoEmEdicao.id 
              ? { ...av, nota: editNota, comentario: editComentario, imagem_url: editImagemUrl } 
              : av
          )
        }));
        fecharEdicaoAvaliacao();
      } else {
        alert('Erro ao atualizar avaliação.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <p className="perfil-loading">Carregando seu histórico no AbleGo...</p>;
  if (!usuario) return null;

  return (
    <div className="perfil-page-container">
      <main className="perfil-card">
        
        <div className="perfil-header-container">
          <h2 className="perfil-page-title">Meu Perfil</h2>
          {!modoEdicao && (
            <button className="btn-editar-perfil" onClick={() => setModoEdicao(true)}>
              ✏️ Editar Perfil
            </button>
          )}
        </div>

        {modoEdicao ? (
          <form onSubmit={handleSalvarPerfil} className="perfil-form">
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group-checkbox">
              <label className="checkbox-item">
                <input type="checkbox" name="pcd" checked={formData.pcd} onChange={handleChange} />
                <span>Sou uma pessoa com deficiência (PcD)</span>
              </label>
            </div>
            <div className="perfil-form-actions">
              <button type="submit" className="btn-salvar-perfil" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button type="button" className="btn-cancelar-perfil" onClick={() => {
                setModoEdicao(false);
                setFormData({ nome: usuario.nome, email: usuario.email, pcd: usuario.pcd }); 
              }}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="perfil-header">
            <div className="perfil-avatar">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="perfil-nome">{usuario.nome}</h2>
              <p className="perfil-email">{usuario.email}</p>
              {usuario.pcd && <span className="tag-pcd">♿ Usuário PcD</span>}
            </div>
          </div>
        )}

        <hr className="perfil-divisor" />

        <section className="perfil-section">
          <h3 className="perfil-section-title">
            📍 Locais que eu cadastrei ({dadosPerfil.locaisCadastrados.length})
          </h3>
          {dadosPerfil.locaisCadastrados.length === 0 ? (
            <p className="perfil-empty-msg">Você ainda não contribuiu com nenhum local no mapa.</p>
          ) : (
            <div className="perfil-list">
              {dadosPerfil.locaisCadastrados.map(local => (
                <div key={local.id} className="perfil-list-item review-item">
                  
                  <div className="review-top-row">
                    <div className="local-header-left">
                      <strong>{local.nome}</strong>
                      <span className="perfil-item-categoria">{local.categoria}</span>
                    </div>
                    
                    <div className="review-item-actions">
                      <button className="btn-action-review edit" onClick={() => setLocalEmEdicao(local)} title="Editar Local">✏️</button>
                      <button className="btn-action-review delete" onClick={() => handleExcluirLocal(local.id, local.nome)} title="Excluir Local">🗑️</button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

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
                  
                  <div className="review-top-row">
                    <div className="review-header-left">
                      <strong>{av.nome_local}</strong>
                      <span className="review-stars">
                        {"★".repeat(av.nota)}{"☆".repeat(5 - av.nota)}
                      </span>
                    </div>
                    
                    <div className="review-item-actions">
                      <button className="btn-action-review edit" onClick={() => abrirEdicaoAvaliacao(av)} title="Editar Avaliação">✏️</button>
                      <button className="btn-action-review delete" onClick={() => handleExcluirAvaliacao(av.id)} title="Excluir Avaliação">🗑️</button>
                    </div>
                  </div>
                  
                  {av.comentario && <p className="review-comentario">"{av.comentario}"</p>}

                  {/* NOVO: Exibe a imagem anexada à avaliação */}
                  {av.imagem_url && (
                    <div className="review-image-attachment">
                      <img 
                        src={av.imagem_url} 
                        alt="Evidência anexada" 
                        onClick={() => window.open(av.imagem_url, '_blank')} 
                        title="Clique para abrir em tamanho real"
                      />
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* MODAL DE EDIÇÃO DE AVALIAÇÃO */}
      {avaliacaoEmEdicao && (
        <div className="modal-overlay" onClick={fecharEdicaoAvaliacao}>
          <div className="modal-content-small" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Editar Avaliação</h3>
            <p className="modal-subtitle">Local: {avaliacaoEmEdicao.nome_local}</p>
            
            <form onSubmit={handleSalvarEdicaoAvaliacao} className="review-form">
              <div className="stars-selector-edit">
                <span>Nova Nota: </span>
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num} 
                    type="button" 
                    className={`star-btn ${editNota >= num ? 'active' : ''}`}
                    onClick={() => setEditNota(num)}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <textarea 
                value={editComentario}
                onChange={(e) => setEditComentario(e.target.value)}
                className="review-textarea"
                rows="4"
                placeholder="Atualize seu comentário..."
              ></textarea>

              {/* NOVO: Input para editar URL da imagem na avaliação */}
              <div className="form-group" style={{ marginTop: '1rem', textAlign: 'left' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#334155' }}>Link da Imagem (Opcional)</label>
                <input 
                  type="url" 
                  value={editImagemUrl} 
                  onChange={(e) => setEditImagemUrl(e.target.value)}
                  placeholder="https://exemplo.com/imagem-rampa.jpg"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    marginTop: '0.3rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div className="modal-editar-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharEdicaoAvaliacao}>Cancelar</button>
                <button type="submit" className="btn-salvar" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE LOCAL */}
      {localEmEdicao && (
        <ModalEditar 
          local={localEmEdicao} 
          fecharModal={() => setLocalEmEdicao(null)} 
          onSalvarSucesso={() => {
            carregarDadosDoPerfil(usuario.id);
            setLocalEmEdicao(null);
          }} 
        />
      )}

      {/* BOTÃO FLUTUANTE DE CADASTRO */}
      <Link to="/cadastrar" className="floating-action-button" title="Cadastrar Novo Local">
        <span className="fab-icon">+</span>
        <span className="fab-text">Cadastrar Local</span>
      </Link>
    </div>
  );
}

export default Perfil;