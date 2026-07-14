import { useState, useEffect } from 'react';
import './CadastroLocal.css';

function CadastroLocal() {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    categoria: '',
    imagem_url: '',
    acessibilidade: [] 
  });
  
  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    } else {
      window.location.href = '/login';
    }

    const carregarItens = async () => {
      try {
        const resposta = await fetch('http://localhost:3000/api/locais/itens');
        if (resposta.ok) {
          const dados = await resposta.json();
          setItensDisponiveis(dados);
        }
      } catch (error) {
        console.error('Erro ao buscar itens de acessibilidade:', error);
      }
    };
    carregarItens();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const itemId = parseInt(value, 10);
    
    setFormData((estadoAnterior) => {
      if (checked) {
        return { ...estadoAnterior, acessibilidade: [...estadoAnterior.acessibilidade, itemId] };
      } else {
        return { ...estadoAnterior, acessibilidade: estadoAnterior.acessibilidade.filter(id => id !== itemId) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    if (!usuarioLogado) {
      setMensagem({ tipo: 'erro', texto: 'Você precisa estar logado para cadastrar.' });
      setCarregando(false);
      return;
    }

    const dadosParaEnviar = {
      ...formData,
      usuario_id: usuarioLogado.id 
    };

    try {
      const resposta = await fetch('http://localhost:3000/api/locais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar)
      });

      if (resposta.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Estabelecimento cadastrado com sucesso!' });
        setFormData({ nome: '', endereco: '', categoria: '', imagem_url: '', acessibilidade: [] });
      } else {
        const erroMsg = await resposta.text();
        setMensagem({ tipo: 'erro', texto: erroMsg || 'Erro ao cadastrar. Tente novamente.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    } finally {
      setCarregando(false);
    }
  };

  if (!usuarioLogado) return null;

  return (
    <div className="cadastro-container">
      <main className="cadastro-card">
        <h2 className="cadastro-title">Cadastrar Novo Local</h2>
        <p className="cadastro-subtitle">Ajude a construir uma cidade mais inclusiva mapeando novos estabelecimentos.</p>
        
        {mensagem.texto && (
          <div className={`mensagem-alerta ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <form className="cadastro-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="nome">Nome do Estabelecimento *</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Ex: Padaria Central" />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria *</label>
            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
              <option value="">Selecione uma categoria...</option>
              <option value="Restaurantes">Restaurantes</option>
              <option value="Farmácias">Farmácias</option>
              <option value="Supermercados">Supermercados</option>
              <option value="Bancos">Bancos</option>
              <option value="Lazer">Lazer</option>
              <option value="Hospital">Hospital</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço Completo *</label>
            <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} required placeholder="Rua, Número, Bairro, Cidade" />
          </div>

          <div className="form-group">
            <label htmlFor="imagem_url">Link da Imagem (Opcional)</label>
            <input type="url" id="imagem_url" name="imagem_url" value={formData.imagem_url} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          </div>

          <div className="form-group">
            <label>O que este local oferece? (Checklist de Acessibilidade)</label>
            <div className="checkbox-grid">
              {itensDisponiveis.map((item) => (
                <label key={item.id} className="checkbox-item">
                  <input 
                    type="checkbox" 
                    value={item.id}
                    checked={formData.acessibilidade.includes(item.id)}
                    onChange={handleCheckboxChange}
                  />
                  <span><span aria-hidden="true">{item.icone}</span> {item.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Finalizar Cadastro'}
          </button>
          
        </form>
      </main>
    </div>
  );
}

export default CadastroLocal;