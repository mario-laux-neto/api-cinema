// Importa os tipos de dados do Sequelize e a instância de conexão com o banco de dados
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

// Define o modelo 'Sala', que será associado à tabela 'salas' no banco de dados
const Sala = sequelize.define(
    'salas',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // Faz com que o valor da coluna seja auto-incrementado
        },
        idPadraoLugares: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            allowNull: false,  // Não permite valores nulos nesta coluna
            references: {
                model: 'padrao_lugares',  // Define a tabela de referência ('padrao_lugares')
                key: 'id',  // Define a chave estrangeira como a coluna 'id' da tabela 'padrao_lugares'
            },
        },
        observacao: {
            type: DataTypes.STRING(255),  // Tipo de dado da coluna (string de até 255 caracteres)
            allowNull: true,  // Permite valores nulos nesta coluna
        },
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela automaticamente (mantém 'salas')
        timestamps: true,  // Habilita a criação de colunas 'create_at' e 'update_at' automaticamente
        createdAt: 'create_at',  // Define o nome da coluna para o timestamp de criação
        updatedAt: 'update_at',  // Define o nome da coluna para o timestamp de atualização
    }
);

// Exporta o modelo 'Sala' para ser utilizado em outros módulos (geralmente para realizar consultas ou manipulações)
export default Sala;
