const express = require('express');
const router = express.Router();
const pool = require('../database');

// NOVO: Rota para buscar todos os locais cadastrados
router.get('/', async (req, res) => {
    try {
        // Busca tudo e ordena do mais recente para o mais antigo
        const todosLocais = await pool.query('SELECT * FROM estabelecimentos ORDER BY id DESC');
        res.status(200).json(todosLocais.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar os locais.');
    }
});

// Rota para cadastrar um local conforme o banco de dados
router.post('/cadastrar', async (req, res) => {
    const { nome, endereco, categoria, imagem_url } = req.body;

    try {
        const novoLocal = await pool.query(
            'INSERT INTO estabelecimentos (nome, endereco, categoria, imagem_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, endereco, categoria, imagem_url]
        );
        res.status(201).json(novoLocal.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar o local. Verifique se os campos estão corretos.');
    }
});

module.exports = router;