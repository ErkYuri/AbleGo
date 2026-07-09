import './ModalDetalhes.css';

function ModalDetalhes({ local, fecharModal }) {
  // Se não houver local selecionado, não renderiza nada
  if (!local) return null;

  return (
    // Overlay escuro no fundo que fecha o modal se clicar fora dele
    <div className="modal-overlay" onClick={fecharModal}>
      
      {/* O container branco principal (stopPropagation impede que o clique feche o modal) */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        
        <button className="modal-close-btn" onClick={fecharModal} aria-label="Fechar detalhes">
          &times;
        </button>
        
        <div className="modal-img-container">
          <img 
            src={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"} 
            alt={`Foto de ${local.nome}`} 
            className="modal-img" 
          />
          <span className="modal-categoria">{local.categoria}</span>
        </div>

        <div className="modal-body">
          <h2 id="modal-titulo" className="modal-nome">{local.nome}</h2>
          <p className="modal-endereco">📍 {local.endereco}</p>

          <div className="modal-section">
            <h3 className="modal-section-title">Checklist Completo de Acessibilidade</h3>
            
            {/* Verifica se o local tem itens cadastrados para fazer a listagem */}
            {local.acessibilidade && local.acessibilidade.length > 0 ? (
              <ul className="modal-checklist">
                {local.acessibilidade.map((item) => (
                  <li key={item.id} className="modal-check-item">
                    <span aria-hidden="true">{item.icone}</span> {item.nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="modal-empty-msg">Nenhum item de acessibilidade foi informado para este local ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhes;