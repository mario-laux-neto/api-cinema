// Importando o Sequelize, que é um ORM para bancos de dados SQL
import { Sequelize } from "sequelize";

// Importando variáveis de ambiente a partir do arquivo .env
import 'dotenv/config'

// Criando uma instância do Sequelize, que será usada para interagir com o banco de dados
export const sequelize = new Sequelize(
    process.env.POSTGRES_DB,      // Nome do banco de dados, retirado das variáveis de ambiente
    process.env.POSTGRES_USERNAME, // Nome de usuário do banco de dados, retirado das variáveis de ambiente
    process.env.POSTGRES_PASSWORD, // Senha do banco de dados, retirada das variáveis de ambiente
    {
        host: process.env.POSTGRES_HOST, // Host do banco de dados, retirado das variáveis de ambiente
        port: Number(process.env.POSTGRES_PORT), // Porta do banco de dados, convertida para número a partir da variável de ambiente
        dialect: 'postgres' // O tipo de banco de dados que estamos utilizando (PostgreSQL)
    }
);
