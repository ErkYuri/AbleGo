import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CadastroLocal from './pages/CadastroLocal';

function App() {
  return (
    <BrowserRouter>
      {/* A Navbar fica fora das rotas porque queremos ela visível em TODAS as telas */}
      <Navbar />

      {/* Como a Navbar tem 4rem de altura e é fixa, damos esse espaço no topo para o conteúdo não ficar escondido atrás dela */}
      <main style={{ paddingTop: '4rem' }}>
        <Routes>
          {/* Rota da página inicial */}
          <Route path="/" element={<Home />} />
          
          {/* Rota da nossa página de cadastro */}
          <Route path="/cadastro" element={<CadastroLocal />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;