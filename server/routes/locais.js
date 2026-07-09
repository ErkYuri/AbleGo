const express = require('express');
const router = express.Router();
const pool = require('../database');

// 1. Rota para buscar os itens de acessibilidade
router.get('/itens', async (req, res) => {
    try {
        const itens = await pool.query('SELECT * FROM itens_acessibilidade ORDER BY id');
        res.status(200).json(itens.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar itens de acessibilidade.');
    }
});

// 2. Rota para buscar todos os locais e seus respectivos selos
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

// 3. Rota para cadastrar um local
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

// 4. Rota para excluir estabelecimento
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

// 5. NOVA ROTA: Atualizar/Editar um Local existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, categoria, imagem_url, itens } = req.body;

    try {
        // Atualiza as informações básicas na tabela de estabelecimentos
        await pool.query(
            'UPDATE estabelecimentos SET nome = $1, endereco = $2, categoria = $3, imagem_url = $4 WHERE id = $5',
            [nome, endereco, categoria, imagem_url, id]
        );

        // Limpa os selos antigos na tabela ponte para reescrever os novos
        await pool.query('DELETE FROM estabelecimento_itens WHERE estabelecimento_id = $1', [id]);

        // Insere os novos selos selecionados pelo usuário
        if (itens && itens.length > 0) {
            for (let itemId of itens) {
                await pool.query(
                    'INSERT INTO estabelecimento_itens (estabelecimento_id, item_id) VALUES ($1, $2)',
                    [id, itemId]
                );
            }
        }

        res.status(200).send('Local atualizado com sucesso!');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao atualizar o local.');
    }
});

module.exports = router;