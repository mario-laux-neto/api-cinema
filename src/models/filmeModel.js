import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Filme = sequelize.define(
    'filmes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        autor: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        duracao: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        imagem: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'imagem'
          }
          
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'update_at',
    }
    
);

export default Filme;
