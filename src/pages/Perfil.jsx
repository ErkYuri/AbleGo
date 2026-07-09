import { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [dadosPerfil, setDadosPerfil] = useState({ locaisCadastrados: [], avaliacoesFeitas: [] });
  const [carregando, setCarregando] = useState(true);

  // Estados para a edição
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', pcd: false });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      const userObj = JSON.parse(usuarioSalvo);
      setUsuario(userObj);
      setFormData({ nome: userObj.nome, email: userObj.email, pcd: userObj.pcd }); // Preenche o form

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
      window.location.href = '/login'; 
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSalvar = async (e) => {
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
        // Atualiza a tela e a memória do navegador
        setUsuario(usuarioAtualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
        setModoEdicao(false); // Fecha o modo de edição
        
        // Recarrega a página para atualizar o nome na Navbar lá em cima
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

  if (carregando) return <p className="perfil-loading">Carregando seu histórico no AbleGo...</p>;
  if (!usuario) return null;

  return (
    <div className="perfil-page-container">
      <main className="perfil-card">
        
        <div className="perfil-header-container">
          <h2 className="perfil-page-title">Meu Perfil</h2>
          {!modoEdicao && (
            <button className="btn-editar-perfil" onClick={() => setModoEdicao(true)}>
              ✏️ Editar
            </button>
          )}
        </div>

        {modoEdicao ? (
          <form onSubmit={handleSalvar} className="perfil-form">
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
                setFormData({ nome: usuario.nome, email: usuario.email, pcd: usuario.pcd }); // Reseta se cancelar
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
                <div key={local.id} className="perfil-list-item">
                  <strong>{local.nome}</strong>
                  <span className="perfil-item-categoria">{local.categoria}</span>
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