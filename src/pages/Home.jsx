import { useState, useEffect } from 'react';
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
  
  // Estados dos Filtros
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  
  // NOVOS ESTADOS: Filtros Avançados
  const [itensAcessibilidade, setItensAcessibilidade] = useState([]);
  const [filtrosAcessibilidade, setFiltrosAcessibilidade] = useState([]);
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

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

  // Função para marcar/desmarcar um item no filtro avançado
  const toggleFiltroAcessibilidade = (id) => {
    setFiltrosAcessibilidade((prev) => 
      prev.includes(id) ? prev.filter(filtroId => filtroId !== id) : [...prev, id]
    );
  };

  // Lógica Mestra de Filtragem
  const locaisFiltrados = locais.filter((local) => {
    // 1. Filtro de Categoria
    const combinaCategoria = categoriaSelecionada === 'Todos' || local.categoria === categoriaSelecionada;
    
    // 2. Filtro de Busca por Texto
    const combinaBusca = 
      local.nome.toLowerCase().includes(busca.toLowerCase()) || 
      local.endereco.toLowerCase().includes(busca.toLowerCase());
      
    // 3. Filtro Avançado (O local DEVE ter TODOS os itens selecionados no filtro)
    const combinaAcessibilidade = filtrosAcessibilidade.length === 0 || filtrosAcessibilidade.every(filtroId => 
      local.acessibilidade.some(itemLocal => itemLocal.id === filtroId)
    );

    return combinaCategoria && combinaBusca && combinaAcessibilidade;
  });

  return (
    <div className="home-container">
      <main className="home-main">
        
        <h1 className="home-title">
          Sua cidade <span className="text-highlight">sem barreiras.</span>
        </h1>
        <p className="home-subtitle">
          Encontre e avalie a acessibilidade de restaurantes, parques e pontos culturais perto de você.
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
          <button className="search-button" aria-label="Pesquisar">
            <span className="search-text">Buscar</span>
          </button>
        </div>

        <div className="filters-container" aria-label="Filtros de categoria">
          <button className={`filter-btn ${categoriaSelecionada === 'Todos' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Todos')}>📍 Todos</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Restaurantes' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Restaurantes')}>🍽️ Restaurantes</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Cafés' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Cafés')}>☕ Cafés</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Museus' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Museus')}>🏛️ Museus</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Parques' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Parques')}>🌳 Parques</button>
        </div>

        {/* NOVA ÁREA: Filtros Avançados */}
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
          <h2 className="cards-title">Locais em Destaque</h2>

          {carregando && <p className="status-msg" aria-live="polite">Buscando locais...</p>}
          {erro && <p className="status-msg erro" role="alert">{erro}</p>}
          {!carregando && !erro && locaisFiltrados.length === 0 && (
            <p className="status-msg">Nenhum estabelecimento encontrado com esses filtros. 🔍</p>
          )}

          <div className="cards-grid">
            {locaisFiltrados.map((local) => (
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