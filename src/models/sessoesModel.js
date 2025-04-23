import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Filme from './filmeModel.js';
import Sala from './salaModel.js';

const Sessao = sequelize.define(
    'sessoes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idfilme: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Filme,  // Relacionamento com Filme
                key: 'id',
            },
        },
        idsala: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Sala,  // Relacionamento com Sala
                key: 'id',
            },
        },
        lugares: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        datainicio: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        datafim: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'update_at',
    }
);

// Relacionamentos
Sessao.belongsTo(Filme, {
    foreignKey: 'idfilme',
    as: 'filme'
});

Sessao.belongsTo(Sala, {
    foreignKey: 'idsala',
    as: 'sala'
});

export default Sessao;
