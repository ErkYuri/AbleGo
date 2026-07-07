const express = require('express');
const cors = require('cors'); // 1. Trazendo o segurança VIP
const app = express();
const pool = require('./database');
const rotasLocais = require('./routes/locais'); 

const PORT = 3000;

// 2. Avisando o servidor para liberar a entrada (o CORS tem que vir ANTES das rotas!)
app.use(cors()); 
app.use(express.json());
app.use('/api/locais', rotasLocais); 

// criando rota teste
app.get('/teste-banco', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');
        res.send(`Conexão bem sucedida! Hora no servidor: ${resultado.rows[0].now}`);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao tentar conectar ao banco.');
    }
});

// conectando
app.listen(PORT, () => {
    console.log(`Servidor conectado! Porta: ${PORT}`);
});