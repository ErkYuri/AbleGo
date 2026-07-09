const express = require('express');
const router = express.Router();
const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Chave secreta para gerar o crachá (Token JWT)
// Em um app real de produção, isso ficaria escondido num arquivo .env
const JWT_SECRET = 'ablego_super_secreto_123';

// 1. Rota para Cadastrar novo usuário
router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, pcd } = req.body;

    try {
        // Verifica se o email já está cadastrado
        const usuarioExiste = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExiste.rows.length > 0) {
            return res.status(400).send('Este email já está sendo usado por outra conta.');
        }

        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Salva no banco de dados (o pcd recebe false se o usuário não marcar nada)
        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, pcd) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, pcd',
            [nome, email, senhaCriptografada, pcd || false]
        );

        res.status(201).json(novoUsuario.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar usuário.');
    }
});

// 2. Rota para fazer Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo email
        const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        
        if (usuario.rows.length === 0) {
            return res.status(401).send('Email ou senha incorretos.');
        }

        // Compara a senha digitada com a senha criptografada do banco
        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);
        
        if (!senhaValida) {
            return res.status(401).send('Email ou senha incorretos.');
        }

        // Gera o Token (Crachá) válido por 1 dia
        const token = jwt.sign(
            { id: usuario.rows[0].id, nome: usuario.rows[0].nome },
            JWT_SECRET,
            { expiresIn: '1d' } 
        );

        // Devolve o token e os dados básicos do usuário para o Front-end
        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.rows[0].id,
                nome: usuario.rows[0].nome,
                pcd: usuario.rows[0].pcd
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao fazer login.');
    }
});

// 3. Rota para buscar o histórico completo do usuário (locais e avaliações)
router.get('/:id/perfil', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Busca os estabelecimentos que este usuário cadastrou
        const locais = await pool.query(
            'SELECT * FROM estabelecimentos WHERE usuario_id = $1 ORDER BY id DESC', 
            [id]
        );

        // Busca as avaliações que este usuário fez (trazendo junto o nome do local avaliado)
        const avaliacoes = await pool.query(
            `SELECT a.*, e.nome as nome_local 
             FROM avaliacoes a 
             JOIN estabelecimentos e ON a.estabelecimento_id = e.id 
             WHERE a.usuario_id = $1 
             ORDER BY a.data_criacao DESC`,
            [id]
        );

        // Empacota tudo e devolve para o Front-end
        res.status(200).json({
            locaisCadastrados: locais.rows,
            avaliacoesFeitas: avaliacoes.rows
        });
        
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao carregar os dados do perfil.');
    }
});

module.exports = router;