const express = require('express');
const router = express.Router();
const pool = require('../database');

// 1. Criar um novo local
router.post('/', async (req, res) => {
    const { nome, categoria, endereco, imagem_url, acessibilidade, usuario_id } = req.body;
    try {
        const arrayAcessibilidade = acessibilidade && acessibilidade.length > 0 ? acessibilidade : [];
        const novoLocal = await pool.query(
            'INSERT INTO estabelecimentos (nome, categoria, endereco, imagem_url, acessibilidade, usuario_id) VALUES ($1, $2, $3, $4, $5::INTEGER[], $6) RETURNING *',
            [nome, categoria, endereco, imagem_url, arrayAcessibilidade, usuario_id]
        );
        res.status(201).json(novoLocal.rows[0]);
    } catch (erro) {
        console.error('🔴 ERRO DETALHADO DO BANCO DE DADOS:', erro);
        res.status(500).send('Erro ao cadastrar o estabelecimento no banco de dados.');
    }
});

// 2. Buscar todos os locais
router.get('/', async (req, res) => {
    try {
        const locaisResult = await pool.query(`
            SELECT e.*, COALESCE(AVG(a.nota), 0) as nota_media, COUNT(a.id) as total_avaliacoes
            FROM estabelecimentos e
            LEFT JOIN avaliacoes a ON e.id = a.estabelecimento_id
            GROUP BY e.id ORDER BY e.id DESC
        `);
        const itensResult = await pool.query('SELECT * FROM itens_acessibilidade');
        const todosItens = itensResult.rows;

        const locaisFormatados = locaisResult.rows.map(local => {
            let itensDoLocal = [];
            if (local.acessibilidade && local.acessibilidade.length > 0) {
                itensDoLocal = local.acessibilidade.map(idItem => todosItens.find(i => i.id === idItem)).filter(i => i != null);
            }
            return {
                ...local,
                nota_media: parseFloat(local.nota_media).toFixed(1),
                total_avaliacoes: parseInt(local.total_avaliacoes),
                acessibilidade: itensDoLocal
            };
        });

        res.json(locaisFormatados);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar locais.');
    }
});

// 3. Buscar a lista de itens de acessibilidade
router.get('/itens', async (req, res) => {
    try {
        const itens = await pool.query('SELECT * FROM itens_acessibilidade ORDER BY id ASC');
        res.json(itens.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar itens de acessibilidade.');
    }
});

// 4. Excluir um local
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM estabelecimentos WHERE id = $1', [id]);
        res.status(200).send('Local excluído com sucesso.');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao excluir local.');
    }
});

// 5. Atualizar um local
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, endereco, imagem_url } = req.body;
    try {
        const atualizado = await pool.query(
            'UPDATE estabelecimentos SET nome = $1, categoria = $2, endereco = $3, imagem_url = $4 WHERE id = $5 RETURNING *',
            [nome, categoria, endereco, imagem_url, id]
        );
        res.json(atualizado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao atualizar local.');
    }
});

// 6. Buscar avaliações de um local (Trazendo o campo imagem_url da avaliação)
router.get('/:id/avaliacoes', async (req, res) => {
    const { id } = req.params;
    try {
        const avaliacoes = await pool.query(
            `SELECT a.*, u.nome as nome_usuario 
             FROM avaliacoes a 
             JOIN usuarios u ON a.usuario_id = u.id 
             WHERE a.estabelecimento_id = $1 
             ORDER BY a.data_criacao DESC`, 
            [id]
        );
        res.json(avaliacoes.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao buscar avaliações.');
    }
});

// 7. Postar uma nova avaliação (Salvando a imagem_url)
router.post('/:id/avaliacoes', async (req, res) => {
    const { id } = req.params;
    const { usuario_id, nota, comentario, imagem_url } = req.body;
    try {
        const novaAvaliacao = await pool.query(
            'INSERT INTO avaliacoes (nota, comentario, usuario_id, estabelecimento_id, imagem_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nota, comentario, usuario_id, id, imagem_url]
        );
        res.status(201).json(novaAvaliacao.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao enviar avaliação.');
    }
});

// 8. Excluir uma avaliação específica
router.delete('/avaliacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM avaliacoes WHERE id = $1', [id]);
        res.status(200).send('Avaliação excluída com sucesso.');
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao excluir avaliação.');
    }
});

// 9. Atualizar uma avaliação específica (Atualizando a imagem_url)
router.put('/avaliacao/:id', async (req, res) => {
    const { id } = req.params;
    const { nota, comentario, imagem_url } = req.body;
    try {
        const atualizado = await pool.query(
            'UPDATE avaliacoes SET nota = $1, comentario = $2, imagem_url = $3 WHERE id = $4 RETURNING *',
            [nota, comentario, imagem_url, id]
        );
        res.json(atualizado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao atualizar avaliação.');
    }
});

module.exports = router;