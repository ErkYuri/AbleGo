import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CadastroLocal from './pages/CadastroLocal';
import Login from './pages/Login';
import Perfil from './pages/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Adicionamos o 'r' no final para combinar com o botão flutuante */}
          <Route path="/cadastrar" element={<CadastroLocal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;