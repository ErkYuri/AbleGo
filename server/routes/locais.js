const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/itens', async (req, res) => {
    try {
        const itens = await pool.query('SELECT * FROM itens_acessibilidade ORDER BY id');
        res.status(200).json(itens.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar itens.');
    }
});

// Busca os locais calculando a média de notas e total de avaliações com subconsultas
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                e.*,
                (SELECT COALESCE(json_agg(json_build_object('id', i.id, 'nome', i.nome, 'icone', i.icone)), '[]')
                 FROM estabelecimento_itens ei 
                 JOIN itens_acessibilidade i ON ei.item_id = i.id 
                 WHERE ei.estabelecimento_id = e.id) as acessibilidade,
                (SELECT COALESCE(ROUND(AVG(nota), 1), 0) FROM avaliacoes WHERE estabelecimento_id = e.id) as nota_media,
                (SELECT COUNT(*) FROM avaliacoes WHERE estabelecimento_id = e.id) as total_avaliacoes
            FROM estabelecimentos e
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
                await pool.query('INSERT INTO estabelecimento_itens (estabelecimento_id, item_id) VALUES ($1, $2)', [localId, itemId]);
            }
        }
        res.status(201).json(novoLocal.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao cadastrar.');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, endereco, categoria, imagem_url, itens } = req.body;
    try {
        await pool.query('UPDATE estabelecimentos SET nome = $1, endereco = $2, categoria = $3, imagem_url = $4 WHERE id = $5', [nome, endereco, categoria, imagem_url, id]);
        await pool.query('DELETE FROM estabelecimento_itens WHERE estabelecimento_id = $1', [id]);
        if (itens && itens.length > 0) {
            for (let itemId of itens) {
                await pool.query('INSERT INTO estabelecimento_itens (estabelecimento_id, item_id) VALUES ($1, $2)', [id, itemId]);
            }
        }
        res.status(200).send('Atualizado com sucesso!');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao atualizar.');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM estabelecimentos WHERE id = $1', [id]);
        res.status(200).send('Excluído com sucesso.');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao excluir.');
    }
});

// --- NOVAS ROTAS DE AVALIAÇÃO ---

// Busca as avaliações de um local específico junto com o nome de quem avaliou
router.get('/:id/avaliacoes', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT a.*, u.nome as nome_usuario 
            FROM avaliacoes a 
            JOIN usuarios u ON a.usuario_id = u.id 
            WHERE a.estabelecimento_id = $1 
            ORDER BY a.data_criacao DESC
        `;
        const avaliacoes = await pool.query(query, [id]);
        res.status(200).json(avaliacoes.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar avaliações.');
    }
});

// Salva uma nova avaliação
router.post('/:id/avaliacoes', async (req, res) => {
    const { id } = req.params;
    const { usuario_id, nota, comentario } = req.body;
    try {
        const nova = await pool.query(
            'INSERT INTO avaliacoes (estabelecimento_id, usuario_id, nota, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, usuario_id, nota, comentario]
        );
        res.status(201).json(nova.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao salvar avaliação.');
    }
});

module.exports = router;