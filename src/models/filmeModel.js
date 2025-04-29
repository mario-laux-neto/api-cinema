// Importa DataTypes do Sequelize para definir os tipos de dados das colunas
import { DataTypes } from "sequelize";
// Importa a instância de conexão com o banco de dados (sequelize)
import { sequelize } from "../config/postgres.js";

// Define o modelo 'Filme', que será associado à tabela 'filmes' no banco de dados
const Filme = sequelize.define(
    'filmes',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // Faz com que o valor da coluna seja auto-incrementado
        },
        nome: {
            type: DataTypes.STRING(255),  // Tipo de dado da coluna (string de até 255 caracteres)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        descricao: {
            type: DataTypes.STRING(500),  // Tipo de dado da coluna (string de até 500 caracteres)
            allowNull: true,  // Permite valores nulos nesta coluna
        },
        autor: {
            type: DataTypes.STRING(255),  // Tipo de dado da coluna (string de até 255 caracteres)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        duracao: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        imagem: {
            type: DataTypes.STRING,  // Tipo de dado da coluna (string)
            allowNull: true,  // Permite valores nulos nesta coluna
            field: 'imagem'  // Define o nome real da coluna no banco de dados, no caso 'imagem'
        }
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela (no caso 'filmes')
        timestamps: true,  // Habilita a criação de colunas 'create_at' e 'update_at' automaticamente
        createdAt: 'create_at',  // Define o nome da coluna para o timestamp de criação
        updatedAt: 'update_at',  // Define o nome da coluna para o timestamp de atualização
    }
);

// Exporta o modelo para ser utilizado em outros módulos (geralmente para realizar consultas ou manipulações)
export default Filme;
