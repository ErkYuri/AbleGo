import { useState } from 'react';
import './CadastroLocal.css';

function CadastroLocal() {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    categoria: '',
    imagem_url: ''
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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

    try {
      const resposta = await fetch('http://localhost:3000/api/locais/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (resposta.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Estabelecimento cadastrado com sucesso!' });
        setFormData({ nome: '', endereco: '', categoria: '', imagem_url: '' });
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro || 'Erro ao tentar cadastrar o local.' });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMensagem({ tipo: 'erro', texto: 'Não foi possível conectar ao servidor.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-page-container">
      <main className="cadastro-card">
        <h2 className="cadastro-title">Cadastrar Novo Estabelecimento</h2>
        <p className="cadastro-subtitle">
          Ajude a comunidade expandindo o mapa. Adicione os dados do local para que outros usuários possam avaliá-lo!
        </p>

        {mensagem.texto && (
          <div 
            className={`cadastro-alert ${mensagem.tipo}`} 
            role="alert" 
            aria-live="assertive"
          >
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cadastro-form" noValidate>
          <div className="form-group">
            <label htmlFor="nome">Nome do Local (Obrigatório)</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Ex: Restaurante Central, Cine UFOP..."
              value={formData.nome}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço Completo (Obrigatório)</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              placeholder="Rua, Número, Bairro, Cidade - Estado"
              value={formData.endereco}
              onChange={handleChange}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria (Obrigatório)</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              aria-required="true"
            >
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
            <input
              type="url"
              id="imagem_url"
              name="imagem_url"
              placeholder="https://exemplo.com/foto.jpg"
              value={formData.imagem_url}
              onChange={handleChange}
            />
          </div>

          {/* Nova área de botões agrupados */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-cadastro-submit" 
              disabled={carregando}
              aria-busy={carregando}
            >
              {carregando ? 'Salvando...' : 'Cadastrar Local'}
            </button>
            
            <a 
              href="/" 
              className="btn-cadastro-cancelar" 
              aria-label="Cancelar cadastro e voltar para a página inicial"
            >
              Cancelar
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CadastroLocal;