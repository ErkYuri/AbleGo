const express = require('express');
const router = express.Router();
const pool = require('../database');


// Rota para cadastrar um local conforme o banco de dados
router.post('/cadastrar', async (req, res) => {
    const { nome, cep, logradouro, numero, bairro, cidade, estado, categoria, descricao } = req.body;

    try {
        const novoLocal = await pool.query(
            'INSERT INTO estabelecimentos (nome, cep, logradouro, numero, bairro, cidade, estado, categoria, descricao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [nome, cep, logradouro, numero, bairro, cidade, estado, categoria, descricao]
        );
        res.status(201).json(novoLocal.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar o local. Verifique se os campos estão corretos.');
    }
});

module.exports = router;