import './CardLocal.css';

function CardLocal({ nome, categoria, nota, imagem, tagVerde, iconeVerde, tagVermelha, extras, onAbrirModal }) {
  return (
    <div className="card-container">
      
      {/* 1. Bloco da Foto */}
      <div className="card-image-wrapper">
        <img 
          src={imagem} 
          alt={`Foto de ${nome}`} 
          className="card-img"
        />
        <span className="card-category">
          {categoria}
        </span>
        <div className="card-rating">
          <span className="rating-star">⭐</span> {nota}
        </div>
      </div>
      
      {/* 2. Bloco dos Textos */}
      <div className="card-content">
        <h3 className="card-title">{nome}</h3>
        
        <p className="checklist-label">
          Checklist de Acessibilidade
        </p>

        <div className="badges-container">
          
          {/* Selo Verde */}
          <div className="badge-green">
            <span>{iconeVerde}</span> {tagVerde}
          </div>

          {/* Selo Vermelho */}
          {tagVermelha && (
            <div className="badge-red">
              <span>❌</span> {tagVermelha}
            </div>
          )}

          {/* Botão de Extras */}
          {extras && (
            <div className="extras-container">
              <button 
                onClick={onAbrirModal}
                className="btn-extras"
              >
                +{extras}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default CardLocal;