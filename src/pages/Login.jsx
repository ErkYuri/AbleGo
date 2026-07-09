import { useState } from 'react';
import './Login.css';

function Login() {
  // Estado para alternar entre a tela de Login e a tela de Cadastro
  const [modoLogin, setModoLogin] = useState(true);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    pcd: false
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    // Define qual rota do back-end vamos chamar
    const url = modoLogin 
      ? 'http://localhost:3000/api/usuarios/login' 
      : 'http://localhost:3000/api/usuarios/cadastrar';

    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        
        if (modoLogin) {
          // Se for Login, salva o crachá na memória do navegador e redireciona
          localStorage.setItem('token', dados.token);
          localStorage.setItem('usuario', JSON.stringify(dados.usuario));
          window.location.href = '/'; // Volta para a tela inicial
        } else {
          // Se for Cadastro, avisa que deu certo e muda para a tela de login
          setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login.' });
          setModoLogin(true);
          setFormData({ ...formData, senha: '' }); // Limpa a senha por segurança
        }
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro || 'Ocorreu um erro.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setMensagem({ tipo: 'erro', texto: 'Não foi possível conectar ao servidor.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page-container">
      <main className="login-card">
        <h2 className="login-title">
          {modoLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        </h2>
        <p className="login-subtitle">
          {modoLogin 
            ? 'Faça login para avaliar estabelecimentos.' 
            : 'Junte-se à comunidade AbleGo.'}
        </p>

        {mensagem.texto && (
          <div className={`login-alert ${mensagem.tipo}`} role="alert">
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* O campo de Nome só aparece se o usuário estiver criando uma conta */}
          {!modoLogin && (
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required />
          </div>

          {/* O campo PCD só aparece no cadastro */}
          {!modoLogin && (
            <div className="form-group-checkbox">
              <label className="checkbox-item">
                <input type="checkbox" name="pcd" checked={formData.pcd} onChange={handleChange} />
                <span>Sou uma pessoa com deficiência (PcD)</span>
              </label>
            </div>
          )}

          <button type="submit" className="btn-login-submit" disabled={carregando}>
            {carregando ? 'Aguarde...' : (modoLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="login-toggle">
          <p>
            {modoLogin ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
            <button 
              type="button" 
              className="btn-toggle-mode" 
              onClick={() => {
                setModoLogin(!modoLogin);
                setMensagem({ tipo: '', texto: '' });
              }}
            >
              {modoLogin ? 'Cadastre-se aqui' : 'Faça login'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;