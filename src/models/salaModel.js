import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Sala = sequelize.define(
    'salas',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idPadraoLugares: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'padrao_lugares', 
                key: 'id',
            },
        },
        observacao: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'update_at',
    }
);

export default Sala;
