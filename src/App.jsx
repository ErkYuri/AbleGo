import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CadastroLocal from './pages/CadastroLocal';
import Login from './pages/Login';
import Perfil from './pages/Perfil'; // 1. Importamos a sala nova aqui!

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroLocal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} /> {/* 2. Criamos o caminho para ela aqui! */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;