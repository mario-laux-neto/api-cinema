import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Usuario = sequelize.define(
    'usuarios',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            field: 'password_hash', 
            type: DataTypes.TEXT,
            allowNull: false,
        },
        estudante: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        codigoRecuperacao: {
            field: 'codigo_recuperacao',
            type: DataTypes.STRING(6),
            allowNull: true,
        },
        codigoExpira: {
            field: 'codigo_expiracao',
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'update_at',
    }
);

export default Usuario;
