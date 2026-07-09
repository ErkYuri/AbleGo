import { useState, useEffect } from 'react';
import CardLocal from '../components/CardLocal';
import ModalDetalhes from '../components/ModalDetalhes';
import ModalEditar from '../components/ModalEditar'; // 1. IMPORTA O NOVO MODAL
import Footer from '../components/Footer';
import './Home.css'; 

function Home() {
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState(null);
  
  // 2. NOVO ESTADO: Para saber qual local está sendo editado no momento
  const [localEmEdicao, setLocalEmEdicao] = useState(null);
  
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Isolamos a função de busca de locais para podermos chamá-la de novo após uma edição com sucesso
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

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    carregarDadosDoServidor();
  }, []);

  const handleExcluir = async (id, nome) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir permanentemente o local "${nome}"?`);
    
    if (confirmacao) {
      try {
        const resposta = await fetch(`http://localhost:3000/api/locais/${id}`, {
          method: 'DELETE'
        });

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

  // 3. ATUALIZADO: Salva o local inteiro no estado para abrir o modal de edição
  const handleAbrirEdicao = (local) => {
    setLocalEmEdicao(local);
  };

  const locaisFiltrados = locales => locais.filter((local) => {
    const combinaCategoria = categoriaSelecionada === 'Todos' || local.categoria === categoriaSelecionada;
    const combinaBusca = 
      local.nome.toLowerCase().includes(busca.toLowerCase()) || 
      local.endereco.toLowerCase().includes(busca.toLowerCase());
    return combinaCategoria && combinaBusca;
  });

  return (
    <div className="home-container">
      <main className="home-main">
        
        <h1 className="home-title">
          Sua cidade <span className="text-highlight">sem barreiras.</span>
        </h1>
        <p className="home-subtitle">
          Encontre e avalie a acessibilidade de restaurantes, parks e pontos culturais perto de você.
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="search-btn-icon" aria-hidden="true">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="filters-container" aria-label="Filtros de categoria">
          <button className={`filter-btn ${categoriaSelecionada === 'Todos' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Todos')}>📍 Todos</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Restaurantes' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Restaurantes')}>🍽️ Restaurantes</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Cafés' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Cafés')}>☕ Cafés</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Museus' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Museus')}>🏛️ Museus</button>
          <button className={`filter-btn ${categoriaSelecionada === 'Parques' ? 'active' : ''}`} onClick={() => setCategoriaSelecionada('Parques')}>🌳 Parques</button>
        </div>

        <div className="cards-section" aria-label="Lista de estabelecimentos">
          <h2 className="cards-title">Locais em Destaque</h2>

          {carregando && <p className="status-msg" aria-live="polite">Buscando locais...</p>}
          {erro && <p className="status-msg erro" role="alert">{erro}</p>}
          {!carregando && !erro && locaisFiltrados(locais).length === 0 && (
            <p className="status-msg">Nenhum estabelecimento encontrado com esses termos. 🔍</p>
          )}

          <div className="cards-grid">
            {locaisFiltrados(locais).map((local) => (
              <CardLocal 
                key={local.id}
                id={local.id}
                nome={local.nome}
                categoria={local.categoria}
                nota="Novo"
                imagem={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"}
                acessibilidade={local.acessibilidade} 
                donoId={local.usuario_id}
                usuarioLogadoId={usuarioLogado ? usuarioLogado.id : null}
                onAbrirModal={() => setLocalSelecionado(local)}
                onExcluir={handleExcluir}
                
                // Passa o objeto 'local' inteiro para sabermos qual linha editar
                onEditar={() => handleAbrirEdicao(local)} 
              />
            ))}
          </div>
        </div>
      </main>

      {localSelecionado && (
        <ModalDetalhes 
          local={localSelecionado} 
          fecharModal={() => setLocalSelecionado(null)} 
        />
      )}

      {/* 4. SE O ESTADO CONTER UM LOCAL, ABRE O MODAL DE EDIÇÃO */}
      {localEmEdicao && (
        <ModalEditar 
          local={localEmEdicao} 
          fecharModal={() => setLocalEmEdicao(null)} 
          onSalvarSucesso={carregarDadosDoServidor} // Puxa a lista nova na tela na hora
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;