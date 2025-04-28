import 'dotenv/config'
import express from 'express'
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import { dirname  } from 'node:path';
import { fileURLToPath } from 'node:url';
import './models/index.js';
import Routes from './routes/index.js';
import { sequelize } from './config/postgres.js';
import fileUpload from 'express-fileupload';


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const logStream = fs.createWriteStream(
    path.join(__dirname, '../access.log'),
    { flags: 'a' },
);

const corsOptions = {
    origin(origin, callback) {
        callback(null, true);
    },
    methods: 'GET,PUT,PATCH,DELETE,POST',
    credentials: true,
}
app.use(express.static('public'))
app.use(cors(corsOptions));
app.use(morgan('combined', { stream: logStream }));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb'}));
app.use(fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true,
    uriDecodeFileNames: true,
    debug: true,
    limits: { fileSize: 50 * 1024 * 1024 }
}))
app.use(express.static('public'))


Routes(app);
app.use((req, res) => {
    res.status(404).send('404 - página não encontrada');
})

sequelize.authenticate()
  .then(() => console.log('Conectado ao banco de dados!'))
  .catch((err) => console.error('Erro ao conectar no banco de dados:', err));


app.listen(process.env.API_PORT, (e) => {
    if (e) {
        return console.log(e);
    }
    console.log(`Rodando na URL http://localhost:${process.env.API_PORT}`)
})