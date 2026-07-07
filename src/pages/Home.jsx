import { useState, useEffect } from 'react';
import CardLocal from '../components/CardLocal';
import ModalDetalhes from '../components/ModalDetalhes';
import Footer from '../components/Footer';
import './Home.css'; 

function Home() {
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState(null);

  // O useEffect funciona como um "mensageiro" que vai buscar os dados no back-end
  useEffect(() => {
    const buscarLocais = async () => {
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

    buscarLocais();
  }, []);

  return (
    <div className="home-container">
      {/* Container Principal */}
      <main className="home-main">
        
        {/* Título de Impacto */}
        <h1 className="home-title">
          Sua cidade <span className="text-highlight">sem barreiras.</span>
        </h1>
        <p className="home-subtitle">
          Encontre e avalie a acessibilidade de restaurantes, parques e pontos culturais perto de você.
        </p>

        {/* Barra de Pesquisa Moderna */}
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
          />

          <button className="search-button" aria-label="Pesquisar">
            <span className="search-text">Buscar</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="search-btn-icon" aria-hidden="true">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Filtros em Pílulas */}
        <div className="filters-container" aria-label="Filtros de categoria">
          <button className="filter-btn active">📍 Todos</button>
          <button className="filter-btn">🍽️ Restaurantes</button>
          <button className="filter-btn">☕ Cafés</button>
          <button className="filter-btn">🏛️ Museus</button>
          <button className="filter-btn">🌳 Parques</button>
        </div>

        {/* Bloco dos Cards - Integrado com o Banco de Dados */}
        <div className="cards-section" aria-label="Lista de estabelecimentos">
          <h2 className="cards-title">Locais em Destaque</h2>

          {/* Tratamento de Estados (Carregando, Erro, Vazio) */}
          {carregando && <p className="status-msg" aria-live="polite">Buscando locais...</p>}
          
          {erro && <p className="status-msg erro" role="alert">{erro}</p>}

          {!carregando && !erro && locais.length === 0 && (
            <p className="status-msg">Nenhum local cadastrado ainda. Seja o primeiro a contribuir!</p>
          )}

          <div className="cards-grid">
            {locais.map((local) => (
              <CardLocal 
                key={local.id}
                nome={local.nome}
                categoria={local.categoria}
                // Como ainda não temos avaliações no banco, passamos valores temporários para o seu layout não quebrar
                nota="Novo"
                imagem={local.imagem_url || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"}
                tagVerde="Acessibilidade"
                iconeVerde="♿"
                tagVermelha="A avaliar"
                extras="+"
                onAbrirModal={() => setLocalSelecionado(local)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Renderiza o Modal apenas se houver um local selecionado */}
      {localSelecionado && (
        <ModalDetalhes 
          local={localSelecionado} 
          fecharModal={() => setLocalSelecionado(null)} 
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;