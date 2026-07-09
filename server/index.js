const express = require('express');
const cors = require('cors'); 
const app = express();
const pool = require('./database');

// Importação das rotas
const rotasLocais = require('./routes/locais'); 
const rotasUsuarios = require('./routes/usuarios'); // NOVO AQUI

const PORT = 3000;

app.use(cors()); 
app.use(express.json());

// Avisando o app para usar as rotas
app.use('/api/locais', rotasLocais); 
app.use('/api/usuarios', rotasUsuarios); // NOVO AQUI

app.get('/teste-banco', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');
        res.send(`Conexão bem sucedida! Hora no servidor: ${resultado.rows[0].now}`);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao tentar conectar ao banco.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor conectado! Porta: ${PORT}`);
});