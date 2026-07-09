import { useState, useEffect } from 'react';
import './ModalDetalhes.css';

function ModalDetalhes({ local, fecharModal }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [notaAtual, setNotaAtual] = useState(5);
  const [comentario, setComentario] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Busca o usuário logado e as avaliações deste local assim que o modal abre
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }

    const buscarAvaliacoes = async () => {
      try {
        const resposta = await fetch(`http://localhost:3000/api/locais/${local.id}/avaliacoes`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setAvaliacoes(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações", error);
      }
    };

    if (local) buscarAvaliacoes();
  }, [local]);

  if (!local) return null;

  const handleEnviarAvaliacao = async (e) => {
    e.preventDefault();
    if (!usuarioLogado) return alert("Faça login para avaliar!");
    
    setCarregando(true);
    try {
      const resposta = await fetch(`http://localhost:3000/api/locais/${local.id}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioLogado.id,
          nota: notaAtual,
          comentario: comentario
        })
      });

      if (resposta.ok) {
        // Atualiza a lista na hora, limpando o formulário
        const novaData = await resposta.json();
        // Injetamos o nome do usuário logado na avaliação recém-criada para aparecer na tela
        novaData.nome_usuario = usuarioLogado.nome; 
        setAvaliacoes([novaData, ...avaliacoes]);
        setComentario('');
        setNotaAtual(5);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar avaliação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={fecharModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={fecharModal}>&times;</button>
        
        <div className="modal-img-container">
          <img src={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"} alt={local.nome} className="modal-img" />
          <span className="modal-categoria">{local.categoria}</span>
        </div>

        <div className="modal-body">
          <h2 className="modal-nome">{local.nome}</h2>
          <p className="modal-endereco">📍 {local.endereco}</p>

          {/* Área 1: Checklist de Acessibilidade */}
          <div className="modal-section">
            <h3 className="modal-section-title">Checklist de Acessibilidade</h3>
            {local.acessibilidade && local.acessibilidade.length > 0 ? (
              <div className="modal-checklist-grid">
                {local.acessibilidade.map((item) => (
                  <div key={item.id} className="modal-check-item">
                    <span>{item.icone}</span> {item.nome}
                  </div>
                ))}
              </div>
            ) : (
              <p className="modal-empty-msg">Nenhum item informado.</p>
            )}
          </div>

          {/* Área 2: Avaliações */}
          <div className="modal-section reviews-section">
            <h3 className="modal-section-title">Avaliações da Comunidade</h3>
            
            {/* Formulário para quem está logado */}
            {usuarioLogado ? (
              <form onSubmit={handleEnviarAvaliacao} className="review-form">
                <div className="stars-selector">
                  <span>Sua Nota: </span>
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num} 
                      type="button" 
                      className={`star-btn ${notaAtual >= num ? 'active' : ''}`}
                      onClick={() => setNotaAtual(num)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea 
                  placeholder="Como foi sua experiência com a acessibilidade neste local?"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="review-textarea"
                  rows="3"
                ></textarea>
                <button type="submit" className="btn-enviar-review" disabled={carregando || !comentario.trim()}>
                  {carregando ? 'Enviando...' : 'Publicar Avaliação'}
                </button>
              </form>
            ) : (
              <div className="login-prompt">
                <p><a href="/login">Faça login</a> para deixar sua avaliação!</p>
              </div>
            )}

            {/* Lista de Comentários */}
            <div className="reviews-list">
              {avaliacoes.length > 0 ? (
                avaliacoes.map(av => (
                  <div key={av.id} className="review-card">
                    <div className="review-header">
                      <span className="review-author">{av.nome_usuario}</span>
                      <span className="review-stars">{"★".repeat(av.nota)}{"☆".repeat(5-av.nota)}</span>
                    </div>
                    <p className="review-text">{av.comentario}</p>
                  </div>
                ))
              ) : (
                <p className="modal-empty-msg">Seja o primeiro a avaliar este estabelecimento!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ModalDetalhes;