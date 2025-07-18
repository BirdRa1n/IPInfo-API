import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public auth_hash!: string;
    public plan: any;
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
    }
}, {
    sequelize,
    modelName: 'user'
});

export default User;