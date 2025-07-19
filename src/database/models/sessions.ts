import { DataTypes, Model } from "sequelize"; // Importar Model
import sequelize from "../database";

class Session extends Model { // Mudar para class Session extends Model
    public id!: number;
    public token!: string;
    public user_id!: number; // Adicionar user_id
}

Session.init({ // Usar .init para modelos Sequelize
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: { // Adicionar user_id
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nome da tabela de User
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'session'
});

export default Session;
