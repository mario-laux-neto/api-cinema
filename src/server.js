// Importa variáveis de ambiente do arquivo .env
import 'dotenv/config'

// Importa pacotes e módulos necessários para o funcionamento do servidor
import express from 'express'
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import './models/index.js';  // Importa os modelos de banco de dados
import Routes from './routes/index.js';  // Importa as rotas
import { sequelize } from './config/postgres.js';  // Conexão com o banco de dados PostgreSQL
import fileUpload from 'express-fileupload';  // Middleware para upload de arquivos

// Obtém o diretório atual do arquivo (necessário para definir caminhos relativos)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Criação de uma instância do Express
const app = express();

// Cria um stream para registrar logs de requisições HTTP em um arquivo
const logStream = fs.createWriteStream(
    path.join(__dirname, '../access.log'),
    { flags: 'a' },  // 'a' significa "append", ou seja, adicionar no final do arquivo
);

// Configuração de opções para o middleware CORS (Cross-Origin Resource Sharing)
const corsOptions = {
    origin(origin, callback) {
        callback(null, true);  // Permite todas as origens
    },
    methods: 'GET,PUT,PATCH,DELETE,POST',  // Métodos permitidos
    credentials: true,  // Permite o uso de credenciais
}

// Configura o servidor Express
app.use(express.static('public'))  // Serve arquivos estáticos da pasta 'public'
app.use(cors(corsOptions));  // Habilita o CORS
app.use(morgan('combined', { stream: logStream }));  // Registra logs das requisições no arquivo access.log
app.use(express.json({ limit: '50mb' }));  // Permite o envio de requisições com até 50MB de dados em JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // Permite o envio de dados em URL encoded com até 50MB
app.use(fileUpload({  // Configura o middleware de upload de arquivos
    createParentPath: true,  // Cria diretórios pai, se necessário
    safeFileNames: true,  // Garante que o nome do arquivo seja seguro
    preserveExtension: true,  // Preserva a extensão original do arquivo
    uriDecodeFileNames: true,  // Decodifica nomes de arquivos URI
    debug: true,  // Habilita o modo de depuração
    limits: { fileSize: 50 * 1024 * 1024 }  // Limita o tamanho do arquivo para 50MB
}));
app.use(express.static('public'))  // Serve arquivos estáticos da pasta 'public'

// Define as rotas da aplicação
Routes(app);

// Middleware para lidar com requisições para páginas inexistentes (erro 404)
app.use((req, res) => {
    res.status(404).send('404 - página não encontrada');
})

// Conexão com o banco de dados PostgreSQL
sequelize.authenticate()  // Tenta se conectar ao banco de dados
  .then(() => console.log('Conectado ao banco de dados!'))  // Sucesso
  .catch((err) => console.error('Erro ao conectar no banco de dados:', err));  // Erro na conexão

// Inicia o servidor na porta especificada no arquivo .env (API_PORT)
app.listen(process.env.API_PORT, (e) => {
    if (e) {
        return console.log(e);  // Exibe erro se houver
    }
    console.log(`Rodando na URL http://localhost:${process.env.API_PORT}`);  // Exibe mensagem de sucesso
})
