import { DataTypes } from "sequelize";
import sequelize from "../database";
import ApiKey from "./api_key";

const User = sequelize.define('user', {
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
});

User.hasMany(ApiKey);

export default User;