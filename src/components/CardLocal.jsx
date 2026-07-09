import './CardLocal.css';

function CardLocal({ id, nome, categoria, nota, imagem, acessibilidade = [], donoId, usuarioLogadoId, onAbrirModal, onExcluir, onEditar }) {
  const MAX_ITENS = 2;
  const itensVisiveis = acessibilidade.slice(0, MAX_ITENS);
  const quantidadeOculta = acessibilidade.length - MAX_ITENS;

  // Verifica se o usuário atual é o criador deste local
  const isDono = usuarioLogadoId && usuarioLogadoId === donoId;

  return (
    <article className="card-local" onClick={onAbrirModal} aria-label={`Detalhes de ${nome}`}>
      
      <div className="card-img-container">
        <img src={imagem} alt={`Foto de ${nome}`} className="card-img" />
        <span className="card-categoria">{categoria}</span>
        <div className="card-nota">⭐ {nota}</div>
      </div>
      
      <div className="card-info">
        {/* Cabeçalho do Card com Título e Botões alinhados */}
        <div className="card-header-flex">
          <h3 className="card-nome">{nome}</h3>
          
          {/* Só mostra os botões se o usuário for o dono */}
          {isDono && (
            <div className="card-actions">
              <button 
                className="btn-icon btn-edit" 
                title="Editar"
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o modal abra
                  onEditar();
                }}
              >
                {/* Ícone de Lápis */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              
              <button 
                className="btn-icon btn-delete" 
                title="Excluir"
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o modal abra
                  onExcluir(id, nome);
                }}
              >
                {/* Ícone de Lixeira */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          )}
        </div>
        
        <span className="checklist-title">RECURSOS ENCONTRADOS</span>
        
        <div className="tags-container">
          {itensVisiveis.map((item) => (
            <div key={item.id} className="tag-verde" aria-label={`Possui ${item.nome}`}>
              <span aria-hidden="true">{item.icone}</span> {item.nome}
            </div>
          ))}

          {quantidadeOculta > 0 && (
            <div className="tag-extra" aria-label={`Mais ${quantidadeOculta} itens disponíveis`}>
              +{quantidadeOculta}
            </div>
          )}

          {acessibilidade.length === 0 && (
            <div className="tag-neutra">Nenhum item informado</div>
          )}
        </div>
      </div>
    </article>
  );
}

export default CardLocal;