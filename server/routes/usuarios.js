const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');

// 1. Cadastro (Atualizado com Pergunta Secreta)
router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, pcd, pergunta_secreta, resposta_secreta } = req.body;
    try {
        const usuarioExiste = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExiste.rows.length > 0) return res.status(400).send('E-mail já cadastrado.');
        
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);
        
        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, pcd, pergunta_secreta, resposta_secreta) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, pcd',
            [nome, email, senhaCriptografada, pcd, pergunta_secreta, resposta_secreta]
        );
        res.status(201).json(novoUsuario.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar.');
    }
});

// 2. Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuario.rows.length === 0) return res.status(400).send('Usuário não encontrado.');
        
        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);
        if (!senhaValida) return res.status(400).send('Senha incorreta.');
        
        const token = "token_simulado_" + usuario.rows[0].id;
        
        res.status(200).json({
            token: token,
            usuario: { id: usuario.rows[0].id, nome: usuario.rows[0].nome, email: usuario.rows[0].email, pcd: usuario.rows[0].pcd }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro no login.');
    }
});

// 3. Buscar Perfil 
router.get('/:id/perfil', async (req, res) => {
    const { id } = req.params;
    try {
        const locais = await pool.query('SELECT * FROM estabelecimentos WHERE usuario_id = $1 ORDER BY id DESC', [id]);
        const avaliacoes = await pool.query(
            `SELECT a.*, e.nome as nome_local FROM avaliacoes a JOIN estabelecimentos e ON a.estabelecimento_id = e.id WHERE a.usuario_id = $1 ORDER BY a.data_criacao DESC`, [id]
        );
        res.status(200).json({ locaisCadastrados: locais.rows, avaliacoesFeitas: avaliacoes.rows });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao carregar perfil.');
    }
});

// 4. Atualizar Dados do Usuário
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, pcd } = req.body;
    try {
        const atualizado = await pool.query(
            'UPDATE usuarios SET nome = $1, email = $2, pcd = $3 WHERE id = $4 RETURNING id, nome, email, pcd',
            [nome, email, pcd, id]
        );
        res.status(200).json(atualizado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao atualizar perfil.');
    }
});

// --- NOVAS ROTAS: RECUPERAÇÃO DE SENHA ---

// 5. Buscar a pergunta secreta do usuário pelo email
router.get('/pergunta-secreta/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const usuario = await pool.query('SELECT pergunta_secreta FROM usuarios WHERE email = $1', [email]);
        if (usuario.rows.length === 0) return res.status(404).send('E-mail não encontrado.');
        
        res.status(200).json({ pergunta_secreta: usuario.rows[0].pergunta_secreta });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar pergunta secreta.');
    }
});

// 6. Validar resposta secreta e redefinir senha
router.post('/redefinir-senha', async (req, res) => {
    const { email, resposta_secreta, novaSenha } = req.body;
    try {
        // Busca o usuário para conferir a resposta (ignorando maiúsculas e minúsculas)
        const usuario = await pool.query('SELECT id, resposta_secreta FROM usuarios WHERE email = $1', [email]);
        if (usuario.rows.length === 0) return res.status(404).send('E-mail não encontrado.');

        // Verifica se a resposta bate (transformamos tudo em minúsculo para evitar erros de digitação)
        const respostaBanco = (usuario.rows[0].resposta_secreta || "").toLowerCase().trim();
        const respostaDigitada = (resposta_secreta || "").toLowerCase().trim();

        if (respostaBanco !== respostaDigitada) {
            return res.status(400).send('Resposta secreta incorreta.');
        }

        // Se acertou, criptografa a nova senha e salva
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

        await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [senhaCriptografada, usuario.rows[0].id]);
        
        res.status(200).send('Senha redefinida com sucesso!');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao redefinir a senha.');
    }
});

module.exports = router;