import { DataTypes } from "sequelize";
import sequelize from "../database";

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

export default User;