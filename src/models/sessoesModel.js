// Importa os tipos de dados do Sequelize, a instância de conexão com o banco de dados, e os modelos 'Filme' e 'Sala' que são necessários para o relacionamento
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Filme from './filmeModel.js';
import Sala from './salaModel.js';

// Define o modelo 'Sessao', que será associado à tabela 'sessoes' no banco de dados
const Sessao = sequelize.define(
    'sessoes',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // Faz com que o valor da coluna seja auto-incrementado
        },
        idfilme: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            allowNull: false,  // Não permite valores nulos nesta coluna
            references: {
                model: Filme,  // Define o relacionamento com o modelo 'Filme' (tabela 'filmes')
                key: 'id',  // Define a chave estrangeira como a coluna 'id' da tabela 'filmes'
            },
        },
        idsala: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            allowNull: false,  // Não permite valores nulos nesta coluna
            references: {
                model: Sala,  // Define o relacionamento com o modelo 'Sala' (tabela 'salas')
                key: 'id',  // Define a chave estrangeira como a coluna 'id' da tabela 'salas'
            },
        },
        lugares: {
            type: DataTypes.JSONB,  // Tipo de dado da coluna (JSONB) para armazenar dados estruturados dos lugares
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        datainicio: {
            type: DataTypes.DATE,  // Tipo de dado da coluna (data e hora)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        datafim: {
            type: DataTypes.DATE,  // Tipo de dado da coluna (data e hora)
            allowNull: false,  // Não permite valores nulos nesta coluna
        },
        preco: {
            type: DataTypes.FLOAT,  // Tipo de dado da coluna (número decimal)
            allowNull: false,  // Não permite valores nulos nesta coluna
        }
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela automaticamente (mantém 'sessoes')
        timestamps: true,  // Habilita a criação de colunas 'create_at' e 'update_at' automaticamente
        createdAt: 'create_at',  // Define o nome da coluna para o timestamp de criação
        updatedAt: 'update_at',  // Define o nome da coluna para o timestamp de atualização
    }
);

// Relacionamentos entre as tabelas
Sessao.belongsTo(Filme, {  // Estabelece que a tabela 'sessoes' possui um relacionamento com 'filmes'
    foreignKey: 'idfilme',  // Define a chave estrangeira que faz referência à tabela 'filmes'
    as: 'filme'  // Alias para o relacionamento, pode ser usado nas consultas
});

Sessao.belongsTo(Sala, {  // Estabelece que a tabela 'sessoes' possui um relacionamento com 'salas'
    foreignKey: 'idsala',  // Define a chave estrangeira que faz referência à tabela 'salas'
    as: 'sala'  // Alias para o relacionamento, pode ser usado nas consultas
});

// Exporta o modelo 'Sessao' para ser utilizado em outros módulos (geralmente para realizar consultas ou manipulações)
export default Sessao;
