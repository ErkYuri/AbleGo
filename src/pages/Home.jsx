import { useState } from 'react';
import Navbar from '../components/Navbar';
import CardLocal from '../components/CardLocal';
import ModalDetalhes from '../components/ModalDetalhes';
import Footer from '../components/Footer';
import './Home.css'; // Aqui importamos o seu novo arquivo de estilos!

// Nossa lista de locais (Array de Objetos)
const listaDeLocais = [
  {
    id: 1,
    nome: "Café Sereno",
    categoria: "Cafeteria",
    nota: "4.8",
    imagem: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    tagVerde: "Rampa de Acesso",
    iconeVerde: "♿",
    tagVermelha: "Menu em Braille",
    extras: "2"
  },
  {
    id: 2,
    nome: "Museu Histórico",
    categoria: "Cultura",
    nota: "4.9",
    imagem: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&q=80",
    tagVerde: "Elevador",
    iconeVerde: "↕️",
    tagVermelha: "Audiodescrição",
    extras: "7"
  },
  {
    id: 3,
    nome: "Parque Central",
    categoria: "Lazer",
    nota: "4.5",
    imagem: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80",
    tagVerde: "Pistas Planas",
    iconeVerde: "🛣️",
    tagVermelha: "Banheiro Adaptado",
    extras: "3"
  }
];

function Home() {
  const [localSelecionado, setLocalSelecionado] = useState(null);

  return (
    <div className="home-container">
      <Navbar />

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
        <div className="search-container">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          <input 
            type="text" 
            placeholder="Para onde deseja ir?" 
            className="search-input"
          />

          <button className="search-button">
            <span className="search-text">Buscar</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="search-btn-icon">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Filtros em Pílulas */}
        <div className="filters-container">
          <button className="filter-btn active">📍 Todos</button>
          <button className="filter-btn">🍽️ Restaurantes</button>
          <button className="filter-btn">☕ Cafés</button>
          <button className="filter-btn">🏛️ Museus</button>
          <button className="filter-btn">🌳 Parques</button>
        </div>

        {/* Bloco dos Cards */}
        <div className="cards-section">
          <h2 className="cards-title">Locais em Destaque</h2>

          <div className="cards-grid">
            {listaDeLocais.map((local) => (
              <CardLocal 
                key={local.id}
                nome={local.nome}
                categoria={local.categoria}
                nota={local.nota}
                imagem={local.imagem}
                tagVerde={local.tagVerde}
                iconeVerde={local.iconeVerde}
                tagVermelha={local.tagVermelha}
                extras={local.extras}
                onAbrirModal={() => setLocalSelecionado(local)}
              />
            ))}
          </div>
        </div>
      </main>

      <ModalDetalhes 
        local={localSelecionado} 
        fecharModal={() => setLocalSelecionado(null)} 
      />

      <Footer />
    </div>
  );
}

export default Home;