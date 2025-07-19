import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import ApiKey from "./api_key";
import Plan from "./plan";

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public auth_hash!: string;
    public planId?: number;
    public ApiKeys?: ApiKey[]; // Definindo a associação
    public plan?: Plan
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    auth_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'plans',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'user'
});

export default User;
