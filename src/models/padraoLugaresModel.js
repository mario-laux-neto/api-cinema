// Importa DataTypes do Sequelize para definir os tipos de dados das colunas
import { DataTypes } from "sequelize";
// Importa a instância de conexão com o banco de dados (sequelize)
import { sequelize } from "../config/postgres.js";

// Define o modelo 'PadraoLugares', que será associado à tabela 'padrao_lugares' no banco de dados
const PadraoLugares = sequelize.define(
    'padrao_lugares',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // Faz com que o valor da coluna seja auto-incrementado
        },
        lugares: {
            type: DataTypes.JSONB,  // Tipo de dado da coluna (JSONB, que armazena dados em formato JSON binário)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela automaticamente (não pluraliza o nome)
        timestamps: true,  // Habilita a criação de colunas 'create_at' e 'update_at' automaticamente
        createdAt: 'create_at',  // Define o nome da coluna para o timestamp de criação
        updatedAt: 'update_at',  // Define o nome da coluna para o timestamp de atualização
    }
);

// Exporta o modelo para ser utilizado em outros módulos (geralmente para realizar consultas ou manipulações)
export default PadraoLugares;
