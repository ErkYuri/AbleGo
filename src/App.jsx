import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CadastroLocal from './pages/CadastroLocal';
import Login from './pages/Login'; // 1. Adicione esta linha

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<CadastroLocal />} />
          <Route path="/login" element={<Login />} /> {/* 2. Adicione esta linha */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;