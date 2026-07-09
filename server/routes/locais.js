const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/itens', async (req, res) => {
    try {
        const itens = await pool.query('SELECT * FROM itens_acessibilidade ORDER BY id');
        res.status(200).json(itens.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar itens de acessibilidade.');
    }
});

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                e.*,
                COALESCE(
                    json_agg(
                        json_build_object('id', i.id, 'nome', i.nome, 'icone', i.icone)
                    ) FILTER (WHERE i.id IS NOT NULL), '[]'
                ) as acessibilidade
            FROM estabelecimentos e
            LEFT JOIN estabelecimento_itens ei ON e.id = ei.estabelecimento_id
            LEFT JOIN itens_acessibilidade i ON ei.item_id = i.id
            GROUP BY e.id
            ORDER BY e.id DESC;
        `;
        const todosLocais = await pool.query(query);
        res.status(200).json(todosLocais.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar os locais.');
    }
});

router.post('/cadastrar', async (req, res) => {
    const { nome, endereco, categoria, imagem_url, itens, usuario_id } = req.body;

    try {
        const novoLocal = await pool.query(
            'INSERT INTO estabelecimentos (nome, endereco, categoria, imagem_url, usuario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, endereco, categoria, imagem_url, usuario_id || null]
        );
        
        const localId = novoLocal.rows[0].id;

        if (itens && itens.length > 0) {
            for (let itemId of itens) {
                await pool.query(
                    'INSERT INTO estabelecimento_itens (estabelecimento_id, item_id) VALUES ($1, $2)',
                    [localId, itemId]
                );
            }
        }

        res.status(201).json(novoLocal.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar o local.');
    }
});

// NOVA ROTA: Excluir Estabelecimento
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM estabelecimentos WHERE id = $1', [id]);
        res.status(200).send('Local excluído com sucesso.');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao excluir o local.');
    }
});

module.exports = router;