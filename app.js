const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
const connectDB = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());


async function startServer() {
    try {
        await connectDB();
      
       
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error.message);
        process.exit(1); 
    }
}

startServer();


readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));


app.get('/', (req, res) => {
    res.send('Servidor em execução');
});

