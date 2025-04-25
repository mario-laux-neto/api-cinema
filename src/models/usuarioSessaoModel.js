import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Usuario from "./usuarioModel.js";
import Sessao from "./sessoesModel.js";

const UsuarioSessao = sequelize.define(
    'usuarios_sessoes', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idsessao: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'sessoes',
                key: 'id',
            }
        },
        idusuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios', 
                key: 'id'
            }
        },
        valor_atual: {
            type: DataTypes.FLOAT, 
            allowNull: false,
            defaultValue: 0.0
        },
        descricao: {
            type: DataTypes.STRING(100),
            allowNull: true 
        },
        cancelado: {  
            type: DataTypes.BOOLEAN,
            defaultValue: false, 
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);


UsuarioSessao.belongsTo(Usuario, { foreignKey: 'idusuario', as: 'usuario' });
UsuarioSessao.belongsTo(Sessao, { foreignKey: 'idsessao', as: 'sessao' });

export default UsuarioSessao;
