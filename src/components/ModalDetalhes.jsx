import './ModalDetalhes.css';

function ModalDetalhes({ local, fecharModal }) {
  // Se não houver nenhum local selecionado, não desenha nada na tela
  if (!local) return null;

  return (
    <div className="modal-overlay">
      
      {/* A Caixa Branca do Modal */}
      <div className="modal-content">
        
        {/* Header com a Foto do Local */}
        <div className="modal-header">
          <img 
            src={local.imagem} 
            alt={local.nome} 
            className="modal-image" 
          />
          {/* Botão de Fechar (O "X") */}
          <button 
            onClick={fecharModal}
            className="modal-close-btn"
          >
            ✖
          </button>
        </div>

        {/* Conteúdo Completo */}
        <div className="modal-body">
          <h2 className="modal-title">{local.nome}</h2>
          <p className="modal-category">
            {local.categoria}
          </p>

          <h3 className="modal-checklist-title">
            Checklist Completo
          </h3>
          
          {/* Lista Mockada */}
          <ul className="modal-checklist">
            <li className="checklist-item checklist-green">
              <span className="checklist-icon">{local.iconeVerde}</span> 
              <span className="checklist-text">{local.tagVerde}</span>
            </li>
            
            {local.tagVermelha && (
              <li className="checklist-item checklist-red">
                <span className="checklist-icon">❌</span> 
                <span className="checklist-text">Falta: {local.tagVermelha}</span>
              </li>
            )}
            
            <li className="checklist-item checklist-green">
              <span className="checklist-icon">🦮</span> 
              <span className="checklist-text">Cão Guia Permitido</span>
            </li>
            <li className="checklist-item checklist-green">
              <span className="checklist-icon">♿</span> 
              <span className="checklist-text">Banheiro Adaptado</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default ModalDetalhes;