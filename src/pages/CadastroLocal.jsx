import { useState, useEffect } from 'react';
import './CadastroLocal.css';

function CadastroLocal() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    categoria: '',
    imagem_url: '',
    itens: []
  });

  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Busca os itens E bloqueia a página se não estiver logado
  useEffect(() => {
    // 1. Checa o usuário
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      // Se não tem usuário, manda para o Login!
      window.location.href = '/login';
      return; 
    }

    // 2. Busca os itens de acessibilidade
    const buscarItens = async () => {
      try {
        const resposta = await fetch('http://localhost:3000/api/locais/itens');
        if (resposta.ok) {
          const dados = await resposta.json();
          setItensDisponiveis(dados);
        }
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };
    buscarItens();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (id) => {
    setFormData((prev) => {
      const jaSelecionado = prev.itens.includes(id);
      const novosItens = jaSelecionado
        ? prev.itens.filter((itemId) => itemId !== id)
        : [...prev.itens, id];
      
      return { ...prev, itens: novosItens };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    if (!formData.nome || !formData.endereco || !formData.categoria) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, preencha os campos obrigatórios.' });
      setCarregando(false);
      return;
    }

    // ATUALIZADO: Prepara o pacote de dados injetando o ID do usuário dono
    const pacoteDeDados = {
      ...formData,
      usuario_id: usuarioLogado.id 
    };

    try {
      const resposta = await fetch('http://localhost:3000/api/locais/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacoteDeDados)
      });

      if (resposta.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Estabelecimento cadastrado com sucesso!' });
        setFormData({ nome: '', endereco: '', categoria: '', imagem_url: '', itens: [] });
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro || 'Erro ao cadastrar.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem({ tipo: 'erro', texto: 'Não foi possível conectar ao servidor.' });
    } finally {
      setCarregando(false);
    }
  };

  // Se a página estiver checando o login, não mostra nada ainda
  if (!usuarioLogado) return null; 

  return (
    <div className="cadastro-page-container">
      <main className="cadastro-card">
        <h2 className="cadastro-title">Cadastrar Novo Estabelecimento</h2>
        <p className="cadastro-subtitle">
          Ajude a comunidade expandindo o mapa.
        </p>

        {mensagem.texto && (
          <div className={`cadastro-alert ${mensagem.tipo}`} role="alert" aria-live="assertive">
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form" noValidate>
          <div className="form-group">
            <label htmlFor="nome">Nome do Local *</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço Completo *</label>
            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria *</label>
            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
              <option value="">Selecione uma categoria...</option>
              <option value="Restaurantes">Restaurante</option>
              <option value="Cafés">Café</option>
              <option value="Museus">Museu</option>
              <option value="Parques">Parque</option>
              <option value="Cultura">Cultura / Lazer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagem_url">URL da Imagem (Opcional)</label>
            <input type="url" id="imagem_url" name="imagem_url" value={formData.imagem_url} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Itens de Acessibilidade Disponíveis</label>
            <div className="checkbox-grid">
              {itensDisponiveis.map((item) => (
                <label key={item.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.itens.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <span>{item.icone} {item.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-cadastro-submit" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Cadastrar Local'}
            </button>
            <a href="/" className="btn-cadastro-cancelar">Cancelar</a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CadastroLocal;