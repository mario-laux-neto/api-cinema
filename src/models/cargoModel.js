// Importa DataTypes do Sequelize para definir os tipos de dados das colunas
import { DataTypes } from "sequelize";
// Importa a instância de conexão com o banco de dados (sequelize)
import { sequelize } from "../config/postgres.js";

// Define o modelo 'Cargo', que será associado à tabela 'cargos' no banco de dados
const Cargo = sequelize.define(
    'cargos',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // Faz com que o valor da coluna seja auto-incrementado
        },
        descricao: {
            type: DataTypes.STRING(100),  // Tipo de dado da coluna (string de até 100 caracteres)
            allowNull: false,  // Não permite valores nulos nesta coluna
            unique: true,  // Garante que os valores na coluna sejam únicos
        }
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela (no caso 'cargos')
        timestamps: true,  // Habilita a criação de colunas 'created_at' e 'updated_at' automaticamente
        createdAt: 'created_at',  // Define o nome da coluna para o timestamp de criação
        updatedAt: 'updated_at',  // Define o nome da coluna para o timestamp de atualização
    }
);

// Exporta o modelo para ser utilizado em outros módulos (geralmente para realizar consultas ou manipulações)
export default Cargo;
