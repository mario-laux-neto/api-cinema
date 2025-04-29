import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Usuario from "./usuarioModel.js";
import Sessao from "./sessoesModel.js";

const UsuarioSessao = sequelize.define(
    'usuarios_sessoes',  // Nome da tabela no banco de dados
    {
        id: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            primaryKey: true,  // Define a coluna como chave primária
            autoIncrement: true,  // A coluna será auto-incrementada
        },
        idsessao: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            allowNull: false,  // Não permite valores nulos nesta coluna
            references: {
                model: 'sessoes',  // Relacionamento com a tabela 'sessoes'
                key: 'id',  // Chave estrangeira que se relaciona com a chave primária da tabela 'sessoes'
            }
        },
        idusuario: {
            type: DataTypes.INTEGER,  // Tipo de dado da coluna (inteiro)
            allowNull: false,  // Não permite valores nulos nesta coluna
            references: {
                model: 'usuarios',  // Relacionamento com a tabela 'usuarios'
                key: 'id',  // Chave estrangeira que se relaciona com a chave primária da tabela 'usuarios'
            }
        },
        valor_atual: {
            type: DataTypes.FLOAT,  // Tipo de dado da coluna (ponto flutuante)
            allowNull: false,  // Não permite valores nulos nesta coluna
            defaultValue: 0.0,  // Valor padrão da coluna é 0.0
        },
        descricao: {
            type: DataTypes.STRING(100),  // Tipo de dado da coluna (string) com tamanho máximo de 100 caracteres
            allowNull: true,  // Permite valores nulos nesta coluna
        },
        cancelado: {
            type: DataTypes.BOOLEAN,  // Tipo de dado da coluna (booleano)
            defaultValue: false,  // Valor padrão para 'cancelado' é false
        }
    },
    {
        freezeTableName: true,  // Impede que o Sequelize altere o nome da tabela automaticamente
        timestamps: true,  // Habilita a criação das colunas 'created_at' e 'updated_at'
        createdAt: 'created_at',  // Define o nome da coluna de timestamp de criação
        updatedAt: 'updated_at',  // Define o nome da coluna de timestamp de atualização
    }
);

// Relacionamentos: define as associações entre as tabelas
UsuarioSessao.belongsTo(Usuario, { foreignKey: 'idusuario', as: 'usuario' });
UsuarioSessao.belongsTo(Sessao, { foreignKey: 'idsessao', as: 'sessao' });

export default UsuarioSessao;
