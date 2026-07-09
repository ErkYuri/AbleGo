import { useState, useEffect } from 'react';
import './ModalEditar.css';

function ModalEditar({ local, fecharModal, onSalvarSucesso }) {
  const [formData, setFormData] = useState({
    nome: local.nome,
    endereco: local.endereco,
    categoria: local.categoria,
    imagem_url: local.imagem_url || '',
    itens: local.acessibilidade ? local.acessibilidade.map(item => item.id) : [] // Pega apenas os IDs dos itens que ele já tem
  });

  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Puxa a lista de itens de acessibilidade para renderizar os checkboxes
  useEffect(() => {
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
    setErro('');

    if (!formData.nome || !formData.endereco || !formData.categoria) {
      setErro('Por favor, preencha os campos obrigatórios.');
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch(`http://localhost:3000/api/locais/${local.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (resposta.ok) {
        onSalvarSucesso(); // Avisa a tela Home que deu certo para recarregar a lista
        fecharModal(); // Fecha a janela
      } else {
        setErro('Ocorreu um erro ao atualizar o estabelecimento.');
      }
    } catch (error) {
      console.error(error);
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-editar-overlay" onClick={fecharModal}>
      <div className="modal-editar-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-editar-close" onClick={fecharModal}>&times;</button>
        
        <h2 className="modal-editar-title">Editar Estabelecimento</h2>
        
        {erro && <p className="modal-editar-error" role="alert">{erro}</p>}

        <form onSubmit={handleSubmit} className="modal-editar-form">
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
              <option value="Restaurantes">Restaurante</option>
              <option value="Supermercados">Supermercados</option>
              <option value="Bancos">Bancos</option>
              <option value="Lazer">Lazer</option>
              <option value="Hospital">Hospital</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagem_url">URL da Imagem</label>
            <input type="url" id="imagem_url" name="imagem_url" value={formData.imagem_url} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Itens de Acessibilidade</label>
            <div className="edit-checkbox-grid">
              {itensDisponiveis.map((item) => (
                <label key={item.id} className="edit-checkbox-item">
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

          <div className="modal-editar-actions">
            <button type="submit" className="btn-editar-salvar" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button type="button" className="btn-editar-cancelar" onClick={fecharModal}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditar;