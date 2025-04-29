// Importa os tipos de dados do Sequelize e a instância de conexão com o banco de dados
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

// Define o modelo 'Usuario', que será associado à tabela 'usuarios' no banco de dados
const Usuario = sequelize.define(
    'usuarios',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // Faz com que o valor da coluna seja auto-incrementado
        },
        nome: {
            type: DataTypes.STRING(100),  // Tipo de dado da coluna (string) com tamanho máximo de 100 caracteres
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        cpf: {
            type: DataTypes.STRING(14),  // Tipo de dado da coluna (string) com tamanho fixo de 14 caracteres
            allowNull: false,  // Não permite valores nulos nesta coluna
            unique: true,  // Garante que o valor de CPF será único na tabela
        },
        email: {
            type: DataTypes.STRING(150),  // Tipo de dado da coluna (string) com tamanho máximo de 150 caracteres
            allowNull: false,  // Não permite valores nulos nesta coluna
            unique: true,  // Garante que o valor de email será único na tabela
        },
        passwordHash: {
            field: 'password_hash',  // Define o nome real da coluna no banco de dados
            type: DataTypes.TEXT,  // Tipo de dado da coluna (texto longo)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        estudante: {
            type: DataTypes.BOOLEAN,  // Tipo de dado da coluna (booleano)
            defaultValue: false,  // Valor padrão para a coluna é 'false'
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        codigoRecuperacao: {
            field: 'codigo_recuperacao',  // Define o nome real da coluna no banco de dados
            type: DataTypes.STRING(6),  // Tipo de dado da coluna (string) com tamanho máximo de 6 caracteres
            allowNull: true,  // Permite valores nulos nesta coluna
        },
        codigoExpira: {
            field: 'codigo_expiracao',  // Define o nome real da coluna no banco de dados
            type: DataTypes.DATE,  // Tipo de dado da coluna (data)
            allowNull: true,  // Permite valores nulos nesta coluna
        }
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela automaticamente
        timestamps: true,  // Habilita a criação de colunas 'create_at' e 'update_at' automaticamente
        createdAt: 'create_at',  // Define o nome da coluna para o timestamp de criação
        updatedAt: 'update_at',  // Define o nome da coluna para o timestamp de atualização
    }
);

// Exporta o modelo 'Usuario' para ser utilizado em outros módulos (geralmente para realizar consultas ou manipulações)
export default Usuario;
