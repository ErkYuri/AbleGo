import { useState } from 'react';
import './Login.css';

function Login() {
  const [modoLogin, setModoLogin] = useState(true);
  const [modoRecuperacao, setModoRecuperacao] = useState(false);
  const [etapaRecuperacao, setEtapaRecuperacao] = useState(1); // 1: Pedir Email, 2: Responder e Nova Senha

  // Estado para Cadastro e Login
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', pcd: false, pergunta_secreta: '', resposta_secreta: ''
  });

  // Estado para Recuperação de Senha
  const [dadosRecuperacao, setDadosRecuperacao] = useState({ email: '', pergunta: '', resposta: '', novaSenha: '' });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleChangeRecuperacao = (e) => {
    const { name, value } = e.target;
    setDadosRecuperacao({ ...dadosRecuperacao, [name]: value });
  };

  // --- SUBMIT: LOGIN OU CADASTRO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    // Validação extra pro Cadastro
    if (!modoLogin && (!formData.pergunta_secreta || !formData.resposta_secreta)) {
      setMensagem({ tipo: 'erro', texto: 'Preencha a pergunta e resposta secreta.' });
      setCarregando(false);
      return;
    }

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
          localStorage.setItem('token', dados.token);
          localStorage.setItem('usuario', JSON.stringify(dados.usuario));
          window.location.href = '/'; 
        } else {
          setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Faça login.' });
          setModoLogin(true);
          setFormData({ ...formData, senha: '' }); 
        }
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro || 'Ocorreu um erro.' });
      }
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: 'Falha na conexão.' });
    } finally {
      setCarregando(false);
    }
  };

  // --- BUSCAR PERGUNTA SECRETA ---
  const handleBuscarPergunta = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const resposta = await fetch(`http://localhost:3000/api/usuarios/pergunta-secreta/${dadosRecuperacao.email}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        setDadosRecuperacao({ ...dadosRecuperacao, pergunta: dados.pergunta_secreta });
        setEtapaRecuperacao(2); // Avança para a etapa de responder
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão.' });
    } finally {
      setCarregando(false);
    }
  };

  // --- REDEFINIR A SENHA ---
  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: dadosRecuperacao.email,
          resposta_secreta: dadosRecuperacao.resposta,
          novaSenha: dadosRecuperacao.novaSenha
        })
      });

      if (resposta.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso! Faça login.' });
        setModoRecuperacao(false); // Volta para a tela de login
        setDadosRecuperacao({ email: '', pergunta: '', resposta: '', novaSenha: '' });
        setEtapaRecuperacao(1);
      } else {
        const textoErro = await resposta.text();
        setMensagem({ tipo: 'erro', texto: textoErro });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro de conexão.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page-container">
      <main className="login-card">
        
        {/* === FLUXO DE RECUPERAÇÃO DE SENHA === */}
        {modoRecuperacao ? (
          <>
            <h2 className="login-title">Recuperar Senha</h2>
            <p className="login-subtitle">Siga os passos para criar uma nova senha.</p>
            {mensagem.texto && <div className={`login-alert ${mensagem.tipo}`}>{mensagem.texto}</div>}

            {etapaRecuperacao === 1 ? (
              <form onSubmit={handleBuscarPergunta} className="login-form">
                <div className="form-group">
                  <label htmlFor="emailRecuperacao">Digite seu E-mail cadastrado</label>
                  <input type="email" id="emailRecuperacao" name="email" value={dadosRecuperacao.email} onChange={handleChangeRecuperacao} required />
                </div>
                <button type="submit" className="btn-login-submit" disabled={carregando}>
                  {carregando ? 'Buscando...' : 'Continuar'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRedefinirSenha} className="login-form">
                <div className="form-group alert-info">
                  <strong>Pergunta Secreta:</strong><br/>
                  {dadosRecuperacao.pergunta || "Não configurada"}
                </div>
                <div className="form-group">
                  <label htmlFor="respostaRecuperacao">Sua Resposta</label>
                  <input type="text" id="respostaRecuperacao" name="resposta" value={dadosRecuperacao.resposta} onChange={handleChangeRecuperacao} required />
                </div>
                <div className="form-group">
                  <label htmlFor="novaSenha">Criar Nova Senha</label>
                  <input type="password" id="novaSenha" name="novaSenha" value={dadosRecuperacao.novaSenha} onChange={handleChangeRecuperacao} required minLength="6"/>
                </div>
                <button type="submit" className="btn-login-submit" disabled={carregando}>
                  {carregando ? 'Salvando...' : 'Redefinir Senha'}
                </button>
              </form>
            )}

            <div className="login-toggle">
              <button type="button" className="btn-toggle-mode" onClick={() => { setModoRecuperacao(false); setEtapaRecuperacao(1); setMensagem({tipo: '', texto: ''}); }}>
                Voltar para o Login
              </button>
            </div>
          </>
        ) : (
          
          /* === FLUXO NORMAL: LOGIN E CADASTRO === */
          <>
            <h2 className="login-title">{modoLogin ? 'Bem-vindo!' : 'Crie sua conta'}</h2>
            <p className="login-subtitle">{modoLogin ? 'Entre para avaliar e cadastrar estabelecimentos.' : 'Junte-se à comunidade AbleGo.'}</p>
            
            {mensagem.texto && <div className={`login-alert ${mensagem.tipo}`}>{mensagem.texto}</div>}

            <form onSubmit={handleSubmit} className="login-form">
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

              {/* CAMPOS EXCLUSIVOS DO CADASTRO */}
              {!modoLogin && (
                <>
                  <div className="form-group-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="pergunta_secreta">Pergunta Secreta (Para recuperar senha)</label>
                      <select id="pergunta_secreta" name="pergunta_secreta" value={formData.pergunta_secreta} onChange={handleChange} required>
                        <option value="">Selecione uma pergunta...</option>
                        <option value="Qual o nome do seu primeiro animal de estimação?">Qual o nome do seu primeiro animal de estimação?</option>
                        <option value="Qual a sua cor favorita?">Qual a sua cor favorita?</option>
                        <option value="Qual a cidade em que sua mãe nasceu?">Qual a cidade em que sua mãe nasceu?</option>
                        <option value="Qual o nome do seu melhor amigo de infância?">Qual o nome do seu melhor amigo de infância?</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="resposta_secreta">Resposta da Pergunta Secreta</label>
                    <input type="text" id="resposta_secreta" name="resposta_secreta" value={formData.resposta_secreta} onChange={handleChange} required />
                  </div>

                  <div className="form-group-checkbox">
                    <label className="checkbox-item">
                      <input type="checkbox" name="pcd" checked={formData.pcd} onChange={handleChange} />
                      <span>Sou uma pessoa com deficiência (PcD)</span>
                    </label>
                  </div>
                </>
              )}

              {/* Botão de Esqueci a Senha só aparece no Login */}
              {modoLogin && (
                <div className="forgot-password-link">
                  <button type="button" onClick={() => { setModoRecuperacao(true); setMensagem({tipo:'', texto:''})}}>
                    Esqueci minha senha
                  </button>
                </div>
              )}

              <button type="submit" className="btn-login-submit" disabled={carregando}>
                {carregando ? 'Aguarde...' : (modoLogin ? 'Entrar' : 'Cadastrar')}
              </button>
            </form>

            <div className="login-toggle">
              <p>
                {modoLogin ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
                <button type="button" className="btn-toggle-mode" onClick={() => { setModoLogin(!modoLogin); setMensagem({ tipo: '', texto: '' }); }}>
                  {modoLogin ? 'Cadastre-se aqui' : 'Faça login'}
                </button>
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Login;