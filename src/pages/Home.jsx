import { useState, useEffect, useRef } from 'react';
import CardLocal from '../components/CardLocal';
import ModalDetalhes from '../components/ModalDetalhes';
import ModalEditar from '../components/ModalEditar';
import Footer from '../components/Footer';
import './Home.css'; 

function Home() {
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [localEmEdicao, setLocalEmEdicao] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('relevantes'); 
  
  const [itensAcessibilidade, setItensAcessibilidade] = useState([]);
  const [filtrosAcessibilidade, setFiltrosAcessibilidade] = useState([]);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  const carrosselRef = useRef(null);

  const carregarDadosDoServidor = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/api/locais');
      if (resposta.ok) {
        const dados = await resposta.json();
        setLocais(dados);
      } else {
        setErro('Falha ao carregar os estabelecimentos.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const carregarItensAcessibilidade = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/api/locais/itens');
      if (resposta.ok) {
        const dados = await resposta.json();
        setItensAcessibilidade(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar itens de acessibilidade:', error);
    }
  };

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    carregarDadosDoServidor();
    carregarItensAcessibilidade();
  }, []);

  const handleExcluir = async (id, nome) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir permanentemente o local "${nome}"?`);
    if (confirmacao) {
      try {
        const resposta = await fetch(`http://localhost:3000/api/locais/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
          setLocais((locaisAnteriores) => locaisAnteriores.filter(local => local.id !== id));
        } else {
          alert('Erro ao tentar excluir o local.');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Falha na comunicação com o servidor.');
      }
    }
  };

  const handleAbrirEdicao = (local) => {
    setLocalEmEdicao(local);
  };

  const toggleFiltroAcessibilidade = (id) => {
    setFiltrosAcessibilidade((prev) => 
      prev.includes(id) ? prev.filter(filtroId => filtroId !== id) : [...prev, id]
    );
  };

  const rolarCarrossel = (direcao) => {
    if (carrosselRef.current) {
      const distancia = 250;
      if (direcao === 'esq') {
        carrosselRef.current.scrollBy({ left: -distancia, behavior: 'smooth' });
      } else {
        carrosselRef.current.scrollBy({ left: distancia, behavior: 'smooth' });
      }
    }
  };

  const locaisProcessados = locais
    .filter((local) => {
      const combinaCategoria = categoriaSelecionada === 'Todos' || local.categoria === categoriaSelecionada;
      const combinaBusca = local.nome.toLowerCase().includes(busca.toLowerCase()) || local.endereco.toLowerCase().includes(busca.toLowerCase());
      const combinaAcessibilidade = filtrosAcessibilidade.length === 0 || filtrosAcessibilidade.every(filtroId => 
        local.acessibilidade.some(itemLocal => itemLocal.id === filtroId)
      );
      return combinaCategoria && combinaBusca && combinaAcessibilidade;
    })
    .sort((a, b) => {
      if (ordenacao === 'alfabetica_asc') {
        return a.nome.localeCompare(b.nome);
      } else if (ordenacao === 'alfabetica_desc') {
        return b.nome.localeCompare(a.nome);
      } else if (ordenacao === 'relevantes') {
        const notaA = a.total_avaliacoes > 0 ? parseFloat(a.nota_media) : 0;
        const notaB = b.total_avaliacoes > 0 ? parseFloat(b.nota_media) : 0;
        if (notaB !== notaA) return notaB - notaA; 
        return a.nome.localeCompare(b.nome); 
      }
      return 0;
    });

  return (
    <div className="home-container">
      <main className="home-main">
        
        <h1 className="home-title">
          Sua cidade <span className="text-highlight">sem barreiras.</span>
        </h1>
        <p className="home-subtitle">
          Encontre e avalie a acessibilidade de restaurantes, pontos comerciais e serviços perto de você.
        </p>

        <div className="search-container" role="search">
          <div className="search-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Para onde deseja ir?" 
            className="search-input"
            aria-label="Buscar estabelecimentos"
            value={busca}
            onChange={(e) => setBusca(e.target.value)} 
          />
        </div>

        {/* CARROSSEL DE CATEGORIAS COM AS NOVAS OPÇÕES */}
        <div className="categories-carousel-wrapper">
          <button className="carousel-arrow" onClick={() => rolarCarrossel('esq')} aria-label="Rolar para esquerda">
            &#10094;
          </button>
          
          <div className="filters-container" ref={carrosselRef} aria-label="Filtros de categoria">
            <button className={`filter-btn ${categoriaSelecionada === 'Todos' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Todos')}>📍 Todos</button>
            <button className={`filter-btn ${categoriaSelecionada === 'Restaurantes' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Restaurantes')}>🍽️ Restaurantes</button>
            
            <button className={`filter-btn ${categoriaSelecionada === 'Supermercados' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Supermercados')}>🛒 Supermercados</button>
            <button className={`filter-btn ${categoriaSelecionada === 'Bancos' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Bancos')}>🏦 Bancos</button>
            <button className={`filter-btn ${categoriaSelecionada === 'Lazer' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Lazer')}>🎭 Lazer</button>
            <button className={`filter-btn ${categoriaSelecionada === 'Hospital' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Hospital')}>🏥 Hospital</button>
          </div>

          <button className="carousel-arrow" onClick={() => rolarCarrossel('dir')} aria-label="Rolar para direita">
            &#10095;
          </button>
        </div>

        <div className="advanced-filters-wrapper">
          <button 
            className={`btn-toggle-advanced ${mostrarFiltrosAvancados ? 'active' : ''}`}
            onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
          >
            ⚙️ Filtros Avançados {filtrosAcessibilidade.length > 0 && `(${filtrosAcessibilidade.length})`}
          </button>

          {mostrarFiltrosAvancados && (
            <div className="advanced-filters-panel">
              <p className="advanced-filters-title">Mostrar apenas locais que possuam:</p>
              <div className="advanced-filters-grid">
                {itensAcessibilidade.map(item => (
                  <button 
                    key={item.id}
                    className={`adv-filter-item ${filtrosAcessibilidade.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => toggleFiltroAcessibilidade(item.id)}
                  >
                    <span aria-hidden="true">{item.icone}</span> {item.nome}
                  </button>
                ))}
              </div>
              {filtrosAcessibilidade.length > 0 && (
                <button className="btn-clear-filters" onClick={() => setFiltrosAcessibilidade([])}>
                  Limpar Filtros Específicos
                </button>
              )}
            </div>
          )}
        </div>

        <div className="cards-section" aria-label="Lista de estabelecimentos">
          
          <div className="cards-header">
            <h2 className="cards-title">Locais em Destaque</h2>
            
            <div className="ordenacao-container">
              <label htmlFor="ordenacao" className="ordenacao-label">Ordenar por:</label>
              <select 
                id="ordenacao" 
                className="select-ordenacao" 
                value={ordenacao} 
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="relevantes">⭐ Mais Relevantes</option>
                <option value="alfabetica_asc">🔤 A - Z</option>
                <option value="alfabetica_desc">🔤 Z - A</option>
              </select>
            </div>
          </div>

          {carregando && <p className="status-msg" aria-live="polite">Buscando locais...</p>}
          {erro && <p className="status-msg erro" role="alert">{erro}</p>}
          {!carregando && !erro && locaisProcessados.length === 0 && (
            <p className="status-msg">Nenhum estabelecimento encontrado com esses filtros. 🔍</p>
          )}

          <div className="cards-grid">
            {locaisProcessados.map((local) => (
              <CardLocal 
                key={local.id}
                id={local.id}
                nome={local.nome}
                categoria={local.categoria}
                nota={local.total_avaliacoes > 0 ? local.nota_media : "Novo"}
                imagem={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"}
                acessibilidade={local.acessibilidade} 
                donoId={local.usuario_id}
                usuarioLogadoId={usuarioLogado ? usuarioLogado.id : null}
                onAbrirModal={() => setLocalSelecionado(local)}
                onExcluir={handleExcluir}
                onEditar={() => handleAbrirEdicao(local)} 
              />
            ))}
          </div>
        </div>
      </main>

      {localSelecionado && (
        <ModalDetalhes local={localSelecionado} fecharModal={() => setLocalSelecionado(null)} />
      )}

      {localEmEdicao && (
        <ModalEditar 
          local={localEmEdicao} 
          fecharModal={() => setLocalEmEdicao(null)} 
          onSalvarSucesso={carregarDadosDoServidor} 
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;