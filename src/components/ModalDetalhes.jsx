import { useState, useEffect, useCallback } from 'react'; // 1. Importamos o useCallback
import './ModalDetalhes.css';

function ModalDetalhes({ local, fecharModal }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true);

  // 2. CORREÇÃO 1: Inicialização inteligente do estado do utilizador (Lazy State)
  // Como nunca mudamos o utilizador logado dentro deste modal, nem precisamos do "setUsuarioLogado"
  const [usuarioLogado] = useState(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [imagemUrl, setImagemUrl] = useState(''); 
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');

  // 3. CORREÇÃO 2: Envolvemos a função em useCallback para o React saber quando ela muda
  const carregarAvaliacoes = useCallback(async () => {
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
  }, [local.id]); // Só recria a função se o ID do local mudar

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Chama a função memorizada
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarAvaliacoes();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [carregarAvaliacoes]); 

  const handleCompartilhar = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert('Link do AbleGo copiado para a área de transferência!');
  };

  const handleComoChegar = () => {
    const enderecoFormatado = encodeURIComponent(local.endereco);
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
          imagem_url: imagemUrl 
        })
      });

      if (resposta.ok) {
        setSucesso('Obrigado! Sua avaliação foi enviada.');
        setComentario('');
        setImagemUrl('');
        setNota(5);
        carregarAvaliacoes(); 
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
      <div 
        className="modal-detalhes-content" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title-id"
        onClick={(e) => e.stopPropagation()}
      >
        
        <button className="btn-modal-fechar" onClick={fecharModal} aria-label="Fechar detalhes do local">
          <span aria-hidden="true">×</span>
        </button>

        <div className="modal-detalhes-banner">
          <img 
            src={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"} 
            alt={local.nome} 
            className="modal-banner-img"
          />
          <span className="modal-tag-categoria">{local.categoria}</span>
        </div>

        <div className="modal-detalhes-body">
          <div className="modal-local-header">
            <div>
              <h2 id="modal-title-id" className="modal-local-nome">{local.nome}</h2>
              <p className="modal-local-endereco">
                <span aria-hidden="true">📍</span> {local.endereco}
              </p>
            </div>
            
            <div className="modal-local-acoes">
              <button className="btn-acao-local share" onClick={handleCompartilhar}>
                <span aria-hidden="true">🔗</span> Compartilhar
              </button>
              <button className="btn-acao-local maps" onClick={handleComoChegar}>
                <span aria-hidden="true">🗺️</span> Ver Rota
              </button>
            </div>
          </div>

          <hr className="modal-divisor" aria-hidden="true" />

          <div className="modal-secao">
            <h3 className="modal-secao-title">Recursos Encontrados</h3>
            {local.acessibilidade && local.acessibilidade.length > 0 ? (
              <div className="modal-recursos-grid" aria-label="Itens de acessibilidade disponíveis neste estabelecimento">
                {local.acessibilidade.map((item) => (
                  <span key={item.id} className="modal-recurso-tag">
                    <span aria-hidden="true" className="recurso-icone">{item.icone}</span> {item.nome}
                  </span>
                ))}
              </div>
            ) : (
              <p className="modal-empty-text">Nenhum recurso de acessibilidade cadastrado para este local.</p>
            )}
          </div>

          <hr className="modal-divisor" aria-hidden="true" />

          <div className="modal-secao">
            <h3 className="modal-secao-title">Avaliações da Comunidade</h3>
            
            {carregandoAvaliacoes && <p className="modal-loading" aria-live="polite">Carregando opiniões...</p>}
            
            {!carregandoAvaliacoes && avaliacoes.length === 0 && (
              <p className="modal-empty-text" aria-live="polite">Seja o primeiro a avaliar a acessibilidade deste local! 🚀</p>
            )}

            {!carregandoAvaliacoes && avaliacoes.length > 0 && (
              <div className="modal-avaliacoes-list" aria-label="Comentários de outros usuários">
                {avaliacoes.map((av) => (
                  <div key={av.id} className="modal-avaliacao-card">
                    <div className="modal-av-header">
                      <strong>{av.nome_usuario}</strong>
                      <span className="modal-av-stars" aria-label={`Nota: ${av.nota} de 5 estrelas`}>
                        <span aria-hidden="true">
                          {"★".repeat(av.nota)}{"☆".repeat(5 - av.nota)}
                        </span>
                      </span>
                    </div>
                    {av.comentario && <p className="modal-av-comentario">"{av.comentario}"</p>}
                    
                    {av.imagem_url && (
                      <div className="modal-av-img-attachment">
                        <img 
                          src={av.imagem_url} 
                          alt={`Evidência fotográfica enviada por ${av.nome_usuario}`} 
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

          {usuarioLogado ? (
            <div className="modal-secao form-avaliacao-secao">
              <h3 className="modal-secao-title">Sua Avaliação</h3>
              
              {sucesso && <div className="alerta-sucesso-av" role="alert">{sucesso}</div>}

              <form onSubmit={handleSubmitAvaliacao} className="modal-av-form">
                
                <div className="modal-av-nota-select">
                  <span id="label-selecao-estrelas">Nota de acessibilidade:</span>
                  <div className="stars-selector-container" role="radiogroup" aria-labelledby="label-selecao-estrelas">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`star-select-btn ${nota >= num ? 'active' : ''}`}
                        onClick={() => setNota(num)}
                        aria-label={`Avaliar com ${num} de 5 estrelas`}
                        aria-pressed={nota >= num}
                      >
                        <span aria-hidden="true">★</span>
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

                <div className="form-group">
                  <label htmlFor="av_imagem_url">Link da Imagem (Opcional - rampa, elevador, etc)</label>
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