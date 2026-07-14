import { useState, useEffect } from 'react';
import './ModalDetalhes.css';

function ModalDetalhes({ local, fecharModal }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Estados do formulário de nova avaliação
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [imagemUrl, setImagemUrl] = useState(''); // NOVO: Estado para a foto na avaliação
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');

  const carregarAvaliacoes = async () => {
    try {
      const resposta = await fetch(`http://localhost:3000/api/locais/${local.id}/avaliacoes`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setAvaliacoes(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setCarregandoAvaliacoes(false);
    }
  };

  useEffect(() => {
    // Trava o scroll do fundo enquanto o modal está aberto
    document.body.style.overflow = 'hidden';

    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }

    carregarAvaliacoes();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [local.id]);

  const handleCompartilhar = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Link do AbleGo copiado para a área de transferência!');
  };

  // NOVO: Função para abrir rota no Google Maps
  const handleComoChegar = () => {
    const enderecoFormatado = encodeURIComponent(local.endereco);
    // Link corrigido do Google Maps (com o cifrão e URL de rotas)
    const urlMaps = `https://www.google.com/maps/dir/?api=1&destination=${enderecoFormatado}`;
    window.open(urlMaps, '_blank');
  };

  const handleSubmitAvaliacao = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setSucesso('');

    if (!usuarioLogado) {
      alert('Você precisa estar logado para avaliar!');
      setEnviando(false);
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/api/locais/${local.id}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioLogado.id,
          nota,
          comentario,
          imagem_url: imagemUrl // Envia a imagem para o banco
        })
      });

      if (resposta.ok) {
        setSucesso('Obrigado! Sua avaliação foi enviada.');
        setComentario('');
        setImagemUrl('');
        setNota(5);
        carregarAvaliacoes(); // Recarrega a lista com a nova avaliação
      } else {
        alert('Erro ao enviar avaliação.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-detalhes-overlay" onClick={fecharModal}>
      <div className="modal-detalhes-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="btn-modal-fechar" onClick={fecharModal} aria-label="Fechar modal">
          &times;
        </button>

        {/* Banner do topo */}
        <div className="modal-detalhes-banner">
          <img 
            src={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"} 
            alt={local.nome} 
            className="modal-banner-img"
          />
          <span className="modal-tag-categoria">{local.categoria}</span>
        </div>

        {/* Informações principais */}
        <div className="modal-detalhes-body">
          <div className="modal-local-header">
            <div>
              <h2 className="modal-local-nome">{local.nome}</h2>
              <p className="modal-local-endereco">📍 {local.endereco}</p>
            </div>
            
            {/* BOTÕES DE AÇÃO LADO A LADO */}
            <div className="modal-local-acoes">
              <button className="btn-acao-local share" onClick={handleCompartilhar}>
                🔗 Compartilhar
              </button>
              <button className="btn-acao-local maps" onClick={handleComoChegar}>
                🗺️ Ver Rota
              </button>
            </div>
          </div>

          <hr className="modal-divisor" />

          {/* Recursos de Acessibilidade */}
          <div className="modal-secao">
            <h3 className="modal-secao-title">Recursos Encontrados</h3>
            {local.acessibilidade && local.acessibilidade.length > 0 ? (
              <div className="modal-recursos-grid">
                {local.acessibilidade.map((item) => (
                  <span key={item.id} className="modal-recurso-tag">
                    <span aria-hidden="true" className="recurso-icone">{item.icone}</span> {item.nome}
                  </span>
                ))}
              </div>
            ) : (
              <p className="modal-empty-text">Nenhum item de acessibilidade cadastrado para este local.</p>
            )}
          </div>

          <hr className="modal-divisor" />

          {/* Lista de Avaliações */}
          <div className="modal-secao">
            <h3 className="modal-secao-title">Avaliações da Comunidade</h3>
            
            {carregandoAvaliacoes && <p className="modal-loading">Carregando opiniões...</p>}
            
            {!carregandoAvaliacoes && avaliacoes.length === 0 && (
              <p className="modal-empty-text">Seja o primeiro a avaliar a acessibilidade deste local! 🚀</p>
            )}

            {!carregandoAvaliacoes && avaliacoes.length > 0 && (
              <div className="modal-avaliacoes-list">
                {avaliacoes.map((av) => (
                  <div key={av.id} className="modal-avaliacao-card">
                    <div className="modal-av-header">
                      <strong>{av.nome_usuario}</strong>
                      <span className="modal-av-stars">
                        {"★".repeat(av.nota)}{"☆".repeat(5 - av.nota)}
                      </span>
                    </div>
                    {av.comentario && <p className="modal-av-comentario">"{av.comentario}"</p>}
                    
                    {/* NOVO: Mostra imagem na avaliação se existir */}
                    {av.imagem_url && (
                      <div className="modal-av-img-attachment">
                        <img 
                          src={av.imagem_url} 
                          alt="Evidência" 
                          onClick={() => window.open(av.imagem_url, '_blank')}
                          title="Clique para abrir imagem original"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formuário de Envio de Avaliação */}
          {usuarioLogado ? (
            <div className="modal-secao form-avaliacao-secao">
              <h3 className="modal-secao-title">Sua Avaliação</h3>
              
              {sucesso && <div className="alerta-sucesso-av">{sucesso}</div>}

              <form onSubmit={handleSubmitAvaliacao} className="modal-av-form">
                
                <div className="modal-av-nota-select">
                  <span>Nota de acessibilidade:</span>
                  <div className="stars-selector-container">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`star-select-btn ${nota >= num ? 'active' : ''}`}
                        onClick={() => setNota(num)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comentario">Comentário (Sua experiência no local)</label>
                  <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Conte como foi o acesso, largura de portas, banheiros, atendimento..."
                    rows="3"
                    required
                  ></textarea>
                </div>

                {/* NOVO: Campo de imagem na avaliação */}
                <div className="form-group">
                  <label htmlFor="av_imagem_url">Link da Imagem (Para provar acessibilidade / rampa quebrada, etc)</label>
                  <input
                    type="url"
                    id="av_imagem_url"
                    value={imagemUrl}
                    onChange={(e) => setImagemUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem-rampa.jpg"
                  />
                </div>

                <button type="submit" className="btn-enviar-av" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                </button>

              </form>
            </div>
          ) : (
            <div className="modal-av-login-banner">
              <p>Quer colaborar com a comunidade?</p>
              <a href="/login" className="btn-av-login">Fazer Login para Avaliar</a>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default ModalDetalhes;